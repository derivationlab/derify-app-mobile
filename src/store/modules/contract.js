import {getCache, setCache} from '@/utils/cache'
import * as web3Utils from '@/utils/web3Utils'
import {getTradeList, getTradeBalanceDetail} from "@/api/trade";
import { Token, SideEnum, toHexString, toContractUnit, fromContractUnit } from '@/utils/contractUtil'
import { amountFormt, fck } from '@/utils/utils'
import { createTokenPriceChangeEvenet } from '@/api/trade'

const tokenPriceRateEnventMap = {};

export class UnitTypeEnum {
  static get USDT() {
    return 0
  }

  static get CurPair() {
    return 1
  }

  static get Percent() {
    return 2
  }
}

const state = {
  wallet_address: window.ethereum !== undefined ? ethereum.selectedAddress :  undefined,
  account: getCache('account') || null,
  pairs: [
    {key: 'BTC', name: 'BTC / USDT', num: 0, percent: 0, enable: true, address: Token.BTC},
    {key: 'ETH', name: 'ETH / USDT', num: 0, percent: 0, enable: true, address: Token.ETH},
    {key: 'BNB', name: 'BNB / USDT', num: 0, percent: 0, enable: false, address: '0xf3a6679b266899042276804930b3bfbaf807f15b'},
    {key: 'UNI', name: 'UNI / USDT', num: 0, percent: 0, enable: false, address: '0xf3a6679b266899042276804930b3bfbaf807f15b'}
  ],
  curPairKey: 'BTC',
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
    marginRate: 0
  },
  positionData: {positions: [], orderPositions: []},
  limitPositionData: [],
  curSpotPrice: 0
}

const mutations = {
  SET_WALLET_ADDRESS (state, address) {
    state.wallet_address = address
    setCache('wallet_address', address)
  },
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
    state.positionData.positions.splice(0, state.positionData.positions.length)
    state.positionData.orderPositions.splice(0, state.positionData.orderPositions.length)
  },
  ADD_POSITION_DATA (state, {positionData, pair}) {
    if(!positionData) {
      return
    }

    if(positionData.positions) {
      const positionIndexOfPair = [];

      state.positionData.positions.forEach((position, index) => {
        if(position.token === pair.address){
          positionIndexOfPair.push(index)
        }
      })

      positionIndexOfPair.forEach((index) => {
        state.positionData.positions.splice(index, 1)
      })

      positionData.positions.forEach((position) => {
        state.positionData.positions.push(position)
      })
    }

    if(positionData.orderPositions) {
      const positionIndexOfPair = [];

      state.positionData.orderPositions.forEach((position, index) => {
        if(position.token === pair.address){
          positionIndexOfPair.push(index)
        }
      })

      positionIndexOfPair.forEach((index) => {
        state.positionData.orderPositions.splice(index, 1)
      })


      positionData.orderPositions.forEach((position) => {
        state.positionData.orderPositions.push(position)
      })
    }
  },
  SET_LIMIT_POSITION_DATA (state, positionData) {
    state.limitPositionData = positionData
  }

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
        // web3Utils.deposit(state.wallet_address, amount).then(r => resolve(r)).catch(err => reject(err))
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

      if(state.wallet_address){
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

      const closeUpperBound = await web3Utils.contract(state.wallet_address).getCloseUpperBound({token, trader: state.wallet_address, side})

      commit('SET_CONTRACT_DATA', {closeUpperBound})
      return closeUpperBound
    })()
  },
  openPosition ({state}, {side, size, openType, price, leverage}) {
    return new Promise((resolve, reject) => {

      if(!state.wallet_address){
        reject('wallet not logged in')
        return
      }

      let idx = state.pairs.findIndex(pair => pair.key === state.curPairKey)

      if (idx === undefined) {
        idx = 0
      }

      const coin = state.pairs[idx]

      const params = {
        token: coin.address, side, openType, size, price, leverage
      }

      web3Utils.contract(state.wallet_address)
        .openPosition(params).then(r => {
          resolve(r)
        }).catch(e => reject(e))
    })
  },
  closePosition ({state}, {token, side, size}) {
    return new Promise((resolve, reject) => {

      if(!state.wallet_address){
        return resolve({})
      }

      web3Utils.contract(state.wallet_address)
        .closePosition(token, side, size).then(r => {
        resolve(r)
      }).catch(e => reject(e))
    })
  },
  orderStopPosition ({state}, {token, side, stopType, stopPrice}) {
    return new Promise((resolve, reject) => {

      if(!state.wallet_address){
        return resolve({})
      }


      const params = {
        token: token,
        trader: state.wallet_address,
        side,
        stopType,
        stopPrice
      }

      web3Utils.contract(state.wallet_address)
        .orderStopPosition(params).then(r => {
        resolve(r)
      }).catch(e => reject(e))
    })
  },
  closeAllPositions ({state}) {
    return new Promise((resolve, reject) => {

      if(!state.wallet_address){
        return resolve({})
      }


      web3Utils.contract(state.wallet_address)
        .closeAllPositions().then(r => {
        resolve(r)
      }).catch(e => reject(e))
    })
  },
  cancleOrderedPosition ({state}, {token, orderType, side, timestamp}) {
    return new Promise((resolve, reject) => {

      if(!state.wallet_address){
        return resolve({})
      }

      const params = {
        token:token,
        trader: state.wallet_address,
        orderType: orderType,
        side: side,
        timestamp: timestamp
      }

      web3Utils.contract(state.wallet_address)
        .cancleOrderedPosition(params).then(r => {
        resolve(r)
      }).catch(e => reject(e))
    })
  },
  cancleAllOrderedPositions ({state}, {token}) {
    return new Promise((resolve, reject) => {

      if(!state.wallet_address){
        resolve({})
        return
      }

      web3Utils.contract(state.wallet_address)
        .cancleAllOrderedPositions(token, state.wallet_address).then(r => {
        resolve(r)
      }).catch(e => reject(e))
    })
  },
  loadHomeData ({state, commit, dispatch}, entrustType = 0) {
    // load home page data
    const self = this
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
      dispatch('updateAllPairPrice')

      // 4.get sysOpenUpperBound
      data.sysOpenUpperBound = await contract.getSysOpenUpperBound({token: curPair.address, side: entrustType})
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

      const sysOpenUpperBound = await contract.getSysOpenUpperBound({token: curPair.address, side})
      commit('SET_CONTRACT_DATA', {sysOpenUpperBound})
      return sysOpenUpperBound
    })()
  },
  updateAllPairPrice ({state, commit}) {
    const contract = web3Utils.contract(state.wallet_address)

    if(!state.wallet_address){
      return {}
    }


    state.pairs.forEach((pair) => {

      if(!pair.enable){
        return
      }

      contract.getSpotPrice(pair.address).then((spotPrice) => {
        commit('UPDATE_PAIRS', [{num: fromContractUnit(spotPrice), key: pair.key}])
      })

      if(!tokenPriceRateEnventMap[pair.key]){
        tokenPriceRateEnventMap[pair.key] = createTokenPriceChangeEvenet(pair.key, (pairKey, priceChangeRate) => {
          //Update token price change

          if(pair.key === state.curPairKey) {
            commit('SET_CONTRACT_DATA', {tokenPriceRate: amountFormt(priceChangeRate * 100,4, true,0)})
          }

          commit('UPDATE_PAIRS', [{percent: amountFormt(priceChangeRate * 100,4, true,0), key: pairKey}])

          const matchPair = state.pairs.find((item) => item.key === pairKey)

          contract.getSpotPrice(matchPair.address).then((spotPrice) => {
            commit('UPDATE_PAIRS', [{num: fromContractUnit(spotPrice), key: matchPair.key}])
          })
        })
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
    return new Promise((resolve, reject) => {
      if(!state.wallet_address){
        return {}
      }

      const contract = web3Utils.contract(state.wallet_address)

      state.pairs.forEach((pair) => {

        const pairItem = pair
        if(!pairItem.enable){
          return
        }

        contract.getTraderAllPosition(state.wallet_address, pairItem.address).then((positionData) => {
          commit('ADD_POSITION_DATA', {positionData, pair: pairItem})

          resolve(state.positionData)
        }).catch(() => {
          reject()
        })
      })
    })
  },
  loadTradeRecords ({state, commit}) {
    return getTradeList(state.wallet_address)
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

  getTraderTradeBalanceDetail ({state, commit}) {
    return getTradeBalanceDetail(state.wallet_address)
  },
  async getPositionChangeFee ({state, commit, dispatch}, {side, actionType, size, price}) {

    if(!state.wallet_address){
      return {}
    }

    let idx = state.pairs.findIndex(pair => pair.key === state.curPairKey)

    if (idx === undefined) {
      idx = 0
    }

    const coin = state.pairs[idx]

    return web3Utils.contract(state.wallet_address).getTradingFee(coin.address, side, actionType, size, price)
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
      dispatch("loadAccountData")
    })
  },
  onWithDraw ({state, commit, dispatch}) {
    if(!state.wallet_address){
      return {}
    }

    const self = this;
    web3Utils.contract(state.wallet_address).onDeposit(state.wallet_address, function (){
      dispatch("loadAccountData")
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}


