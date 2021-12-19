import {getCache, setCache} from '@/utils/cache'
import * as web3Utils from '@/utils/web3Utils'
import { getTradeList, getTradeBalanceDetail, getTraderEDRFBalance } from '@/api/trade'
import { Token, SideEnum, toHexString, toContractUnit, fromContractUnit, UnitTypeEnum } from '@/utils/contractUtil'
import { amountFormt, fck, toChecksumAddress } from '@/utils/utils'

const openPositionListener/*:{callback:Function, commit:Dispatch}[]*/ = [];
const closePositionListener/*:{callback:Function, commit:Dispatch}[]*/ = [];


const priceChangeListener/*:{callback:Function, commit:Dispatch}[]*/ = [];


const state = {
  get wallet_address () {
    return window.ethereum !== undefined && window.ethereum.selectedAddress ? toChecksumAddress(ethereum.selectedAddress) :  undefined
  },
  account: getCache('account') || null,
  pairs: [
    {key: 'BTC', name: 'BTC / USDT', num: 0, percent: 0, enable: true, address: Token.BTC,longPmrRate: 0,shortPmrRate:0},
    {key: 'ETH', name: 'ETH / USDT', num: 0, percent: 0, enable: true, address: Token.ETH,longPmrRate: 0,shortPmrRate:0},
    {key: 'BNB', name: 'BNB / USDT', num: 0, percent: 0, enable: false, address: '0xf3a6679b266899042276804930b3bfbaf807f15b',longPmrRate: 0,shortPmrRate:0},
    {key: 'UNI', name: 'UNI / USDT', num: 0, percent: 0, enable: false, address: '0xf3a6679b266899042276804930b3bfbaf807f15b',longPmrRate: 0,shortPmrRate:0}
  ],
  curPairKey:  window.localStorage.getItem('curPairKey') || 'BTC',
  contractData: {
    positionChangeFeeRatio: '-',
    traderOpenUpperBound: {size: 0, amount: 0},
    sysOpenUpperBound: {size: 0, amount: 0},
    closeUpperBound: {size: 0, amount: 0},
    longPmrRate: '-',
    shortPmrRate: '-',
    tokenPriceRate: '-',
    curSpotPrice: 0
  },
  accountData: {
    balance: 0,
    marginBalance: 0,
    totalMargin: 0,
    marginRate: 0,
    availableMargin: 0
  },
  positionData: {positions: [], orderPositions: []},
  limitPositionData: [],
  curSpotPrice: 0
}

const actions = {
  loginWallet ({commit, dispatch}) {
    return new Promise((resolve, reject) => {
      web3Utils.enable().then(res => {
        resolve(res)
      }).catch(err => reject(err))
    })
  },
  depositAccount ({state}, amount) {
    return new Promise((resolve, reject) => {
      if (!state.wallet_address) {
        reject(new Error('log in wallet first'))
      } else {
        web3Utils.contract(state.wallet_address).deposit(amount).then(r => resolve(r)).catch(err => reject(err))
      }
    })
  },
  withdrawAccount ({state}, amount) {
    return new Promise((resolve, reject) => {

      if (!state.wallet_address) {
        reject(new Error('log in wallet first'))
      } else {
        web3Utils.contract(state.wallet_address).withdraw(amount).then(r => resolve(r)).catch(err => reject(err))
      }
    })
  },
  getSpotPrice ({state, commit}) {
    return new Promise((resolve, reject) => {

      if(!state.wallet_address){
        resolve({})
        return
      }

      let idx = state.pairs.findIndex(pair => pair.key === state.curPairKey)

      if (idx === undefined) {
        idx = 0
      }

      const coin = state.pairs[idx]

      web3Utils.contract(state.wallet_address).getSpotPrice(coin.address).then(r => {
        commit('SET_CURSPOTPRICE', r)
        resolve(r)
      }).catch(e => reject(e))
    })
  },
  getCloseUpperBound ({state, commit, dispatch}, {token, side}) {

    return (async () => {

      if(!state.wallet_address || token === undefined || side === undefined){
        return
      }
      let closeUpperBound = { size: Infinity}
      if(side !== SideEnum.HEDGE) {
        closeUpperBound = await web3Utils.contract(state.wallet_address).getCloseUpperBound({token, trader: state.wallet_address, side})
      }

      commit('SET_CONTRACT_DATA', {closeUpperBound})
      return closeUpperBound
    })()
  },
  openPosition ({state,dispatch}, {side, size, openType, price, leverage, brokerId}) {
    return new Promise((resolve, reject) => {

      if(!state.wallet_address){
        reject('wallet not logged in')
        return
      }

      let token = state.pairs.find(pair => pair.key === state.curPairKey)

      if (token === undefined) {
        return
      }

      const params = {
        token: token.address, side, openType, size, price, leverage
      }

      web3Utils.contract(state.wallet_address, brokerId)
        .openPosition(params).then(r => {
        resolve(r);
        dispatch("loadHomeData");
      }).catch(e => reject(e))
    })
  },
  closePosition ({state,dispatch}, {token, side, size, brokerId}) {
    return new Promise((resolve, reject) => {

      if(!state.wallet_address){
        return resolve({})
      }

      web3Utils.contract(state.wallet_address, brokerId)
        .closePosition(token, side, size).then(r => {
        resolve(r);
        dispatch("loadHomeData");
      }).catch(e => reject(e))
    })
  },
  orderStopPosition ({state,dispatch}, {token, side, takeProfitPrice, stopLossPrice}) {
    return new Promise((resolve, reject) => {

      if(!state.wallet_address){
        return resolve({})
      }
      const params = {
        token: token,
        trader: state.wallet_address,
        side,
        takeProfitPrice,
        stopLossPrice
      }

      web3Utils.contract(state.wallet_address)
        .orderStopPosition(params).then(r => {
        resolve(r);
        dispatch("loadHomeData");
      }).catch(e => reject(e))
    })
  },
  closeAllPositions ({state,dispatch}, {brokerId}) {
    return new Promise((resolve, reject) => {

      if(!state.wallet_address){
        return resolve({})
      }


      web3Utils.contract(state.wallet_address, brokerId)
        .closeAllPositions().then(r => {
        resolve(r);
        dispatch("loadHomeData");
      }).catch(e => reject(e))
    })
  },
  /**
   *
   * @param state
   * @param token
   * @param closeType {CancelOrderedPositionTypeEnum}
   * @param side {SideEnum}
   * @param timestamp
   * @returns {Promise<void>}
   */
  cancleOrderedPosition ({state,dispatch}, {token, closeType, side, timestamp}) {
    return new Promise((resolve, reject) => {

      if(!state.wallet_address){
        return resolve({})
      }

      const params = {
        token:token,
        trader: state.wallet_address,
        closeType: closeType,
        side: side,
        timestamp: timestamp
      }

      web3Utils.contract(state.wallet_address)
        .cancleOrderedPosition(params).then(r => {
        resolve(r);
        dispatch("loadHomeData");
      }).catch(e => reject(e))
    })
  },
  cancleAllOrderedPositions ({state,dispatch}, {token}) {
    return new Promise((resolve, reject) => {

      if(!state.wallet_address){
        resolve({})
        return
      }

      web3Utils.contract(state.wallet_address)
        .cancleAllOrderedPositions(token, state.wallet_address).then(r => {
        resolve(r)
        dispatch("loadHomeData");
      }).catch(e => reject(e))
    })
  },
  loadHomeData ({state, commit, dispatch}, entrustType = 0) {
    // load home page data
    const self = this
    const side = entrustType
    return (async function () {
      const data = {curSpotPrice: 0, positionChangeFeeRatio: 0}
      if(!state.wallet_address){
        return {}
      }

      const contract = web3Utils.contract(state.wallet_address)

      // 1.get cur token spotPrice
      const curPair = state.pairs.find(pair => pair.key === state.curPairKey)

      data.curSpotPrice = await contract.getSpotPrice(curPair.address)
      commit('SET_CONTRACT_DATA', data)

      // 2.get positionChangeFeeRatio
      data.positionChangeFeeRatio = await contract.getPositionChangeFeeRatio(curPair.address)
      commit('SET_CONTRACT_DATA', data)

      // 3.get traderOpenUpperBound
      const price = data.curSpotPrice
      const leverage = 10

      data.traderOpenUpperBound = await contract.getTraderOpenUpperBound({token: curPair.address, trader: state.wallet_address
        , openType: entrustType, price:  toHexString(price), leverage: toContractUnit(leverage)})

      commit('SET_CONTRACT_DATA', data)

      //4.update all token price
      dispatch('updateAllPairPrice',{})

      // 4.get sysOpenUpperBound
      data.sysOpenUpperBound = await contract.getSysOpenUpperBound({token: curPair.address, side: side})
      commit('SET_CONTRACT_DATA', data)
      return data
    }())
  },
  getSysOpenUpperBound ({state, commit, dispatch}, {side}) {
    return (async () => {
      if(!state.wallet_address){
        return 0
      }

      const curPair = state.pairs.find(pair => pair.key === state.curPairKey)

      if(!curPair){
        return 0
      }

      const contract = web3Utils.contract(state.wallet_address)
      let sysOpenUpperBound = {size: Infinity}
      if(side !== SideEnum.HEDGE) {
        sysOpenUpperBound = await contract.getSysOpenUpperBound({token: curPair.address, side})
      }

      commit('SET_CONTRACT_DATA', {sysOpenUpperBound})
      return sysOpenUpperBound
    })()
  },
  getSysCloseUpperBound ({state, commit, dispatch}, {side}) {
    return (async () => {
      if(!state.wallet_address){
        return 0
      }

      const curPair = state.pairs.find(pair => pair.key === state.curPairKey)
      if(!curPair){
        return 0
      }

      const contract = web3Utils.contract(state.wallet_address)
      let sysCloseUpperBound = {size: Infinity}
      if(side !== SideEnum.HEDGE) {
        sysCloseUpperBound = await contract.getSysCloseUpperBound({token: curPair.address, side})
      }

      commit('SET_CONTRACT_DATA', {sysCloseUpperBound})
      return sysCloseUpperBound
    })
  },
  updateAllPairPrice ({state, commit}, {token,priceChangeRate, longPmrRate, shortPmrRate}) {
    const contract = web3Utils.contract(state.wallet_address)

    if(!state.wallet_address){
      return {}
    }

    state.pairs.forEach(async (pair) => {
      if(!pair.enable || pair.address !== token){
        return
      }

      if(pair.address === token){
        const spotPrice = await contract.getSpotPrice(pair.address);

        if(spotPrice || spotPrice === 0){
          pair.num = fromContractUnit(spotPrice);
        }

        if(priceChangeRate || priceChangeRate === 0){
          pair.percent = priceChangeRate * 100;
        }

        if(longPmrRate || longPmrRate === 0){
          pair.longPmrRate = longPmrRate * 100;
        }

        if(shortPmrRate || shortPmrRate === 0){
          pair.shortPmrRate = shortPmrRate * 100;
        }

        commit('UPDATE_PAIRS', [pair])
      }
    })

  },

  loadAccountData ({state, commit}) {
    // 1.get user account data
    return (async function () {
      if(!state.wallet_address){
        return {}
      }

      const contract = web3Utils.contract(state.wallet_address)

      const accountData = await contract.getTraderAccount(state.wallet_address)

      const tradeVariables = await contract.getTraderVariables(state.wallet_address)

      Object.assign(accountData, {marginBalance: tradeVariables.marginBalance
        , totalPositionAmount: tradeVariables.totalPositionAmount
        , marginRate: tradeVariables.marginRate})

      commit('SET_ACCOUNT_DATA', accountData)

      return accountData
    }())
  },
  loadPositionData ({state, commit}) {
    return (async () => {
      if(!state.wallet_address){
        commit('RESET_POSITION_DATA');
        return {}
      }

      const contract = web3Utils.contract(state.wallet_address)

      const positionDatas = []
      for(let idx = 0; idx < state.pairs.length; idx++) {
        const pairItem = state.pairs[idx]
        if(!pairItem.enable){
          continue
        }

        try{
          positionDatas.push({positionData: await contract.getTraderAllPosition(state.wallet_address, pairItem.address), pair: pairItem})
        }catch (e){
          console.error("getTraderAllPosition exception:", e)
        }

      }
      commit('RESET_POSITION_DATA');
      positionDatas.forEach((positionData) => {
        commit('ADD_POSITION_DATA', {...positionData})
      })

    })()
  },
  getTraderOpenUpperBound ({state, commit}, {openType, price, leverage}) {
    return (async () => {

      if(!state.wallet_address){
        return {}
      }

      let idx = state.pairs.findIndex(pair => pair.key === state.curPairKey)

      if (idx === undefined) {
        idx = 0
      }

      const coin = state.pairs[idx]

      const token = coin.address;

      const contract = web3Utils.contract(state.wallet_address)

      const data = await contract.getTraderOpenUpperBound({token: token
        , trader:  state.wallet_address, openType, price, leverage})

      const update = Object.assign({}, state.contractData, {traderOpenUpperBound: data})
      commit("SET_CONTRACT_DATA", update)
      return data;
    })()
  },
  loadTradeRecords ({state, commit}, {page=0, size=10}) {
    return getTradeList(state.wallet_address, page, size)
  },
  getTraderTradeBalanceDetail ({state, commit}, {page = 0, size = 10}) {
    return getTradeBalanceDetail(state.wallet_address, page, size)
  },
  async getPositionChangeFee ({state, commit, dispatch}, {side, actionType, size, price}) {

    if(!state.wallet_address){
      return {}
    }

    let token = state.pairs.find(pair => pair.key === state.curPairKey)

    if (!token) {
      return
    }

    return web3Utils.contract(state.wallet_address).getPositionChangeFee(token.address, side, actionType, size, price)
  },
  getTradingFee ({state, commit, dispatch}, {size, price}) {
    let idx = state.pairs.findIndex(pair => pair.key === state.curPairKey)

    if (idx === undefined) {
      idx = 0
    }

    const coin = state.pairs[idx]

    return web3Utils.contract(state.wallet_address).getTradingFee(coin.address, size, price)
  },
  onDeposit ({state, commit, dispatch}) {
    if(!state.wallet_address){
      return {}
    }

    const self = this;
    web3Utils.contract(state.wallet_address).onDeposit(state.wallet_address, function (){
      dispatch("loadHomeData")
    })
  },
  onWithDraw ({state, commit, dispatch}) {
    if(!state.wallet_address){
      return {}
    }

    const self = this;
    web3Utils.contract(state.wallet_address).onDeposit(state.wallet_address, function (){
      dispatch("loadHomeData")
    })
  },
  onOpenPosition({state, commit, dispatch}, callback){
    openPositionListener.push({state, commit, dispatch, callback});
  },

  onClosePosition({state, commit, dispatch}){
    openPositionListener.push({state, commit, dispatch, callback});
  }
}


const mutations = {
  UPDATE_PAIRS (state, pairs) {
    const pairMap = {};
    state.pairs.forEach((item, index) => {
      pairMap[item.key] = {item, index};
    })

    pairs.forEach((item) => {
      const oldItem = pairMap[item.key]
      if(!oldItem) {
        return
      }

      state.pairs[oldItem.index] = Object.assign(oldItem.item, item)
    })
  },
  SET_ACCOUNT (state, account) {
    state.account = account
    setCache('account', account)
  },
  SET_CURPAIRKEY (state, key) {
    window.localStorage.setItem("curPairKey", key);
    state.curPairKey = key
  },
  SET_CURSPOTPRICE (state, price) {
    state.curSpotPrice = price
  },
  SET_CONTRACT_DATA (state, updates) {
    state.contractData = Object.assign({}, state.contractData, {...updates})
  },
  SET_ACCOUNT_DATA (state, accountData) {
    state.accountData = Object.assign(state.accountData, accountData)
  },
  RESET_POSITION_DATA (state) {
    state.positionData.positions.splice(0)
    state.positionData.orderPositions.splice(0)
  },
  ADD_POSITION_DATA (state, {positionData, pair}) {
    if(!positionData) {
      return
    }

    if(positionData.positions) {
      const positionsMap = {};

      state.positionData.positions.forEach((position, index) => {
        const key = position.token + '.' + position.side
        positionsMap[key] = position
      })


      positionData.positions.forEach((position) => {
        const key = position.token + '.' + position.side
        positionsMap[key] = position
      })

      state.positionData.positions.splice(0)

      for(var key in positionsMap) {
        state.positionData.positions.push(positionsMap[key])
      }


    }

    if(positionData.orderPositions) {
      const positionsMap = {};

      state.positionData.orderPositions.forEach((position, index) => {
        const key = position.timestamp + '.' + position.token + '.' + position.side + '.' + position.orderType
        positionsMap[key] = position
      })

      positionData.orderPositions.forEach((position, index) => {
        const key = position.timestamp + '.' + position.token + '.' + position.side + '.' + position.orderType
        positionsMap[key] = position
      })

      state.positionData.orderPositions.splice(0)

      for(key in positionsMap) {
        state.positionData.orderPositions.push(positionsMap[key])
      }
    }
  },
  SET_LIMIT_POSITION_DATA (state, positionData) {
    state.limitPositionData = positionData
  },
  SET_POSITION_DATA (state, positionData) {
    state.positionData = positionData
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}


