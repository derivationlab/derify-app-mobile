import {getCache, setCache} from '@/utils/cache'
import * as web3Utils from '@/utils/web3Utils'
import {getTradeList, getTradeBalanceDetail} from "@/api/trade";
import { Token, SideEnum, toHexString, toContractUnit } from '../../utils/contractUtil'

const state = {
  wallet_address: window.ethereum !== undefined ? ethereum.selectedAddress :  undefined,
  account: getCache('account') || null,
  pairs: [
    {key: 'BTC', name: 'BTC / USDT', num: 2030.23, percent: 1.23, enable: true, address: Token.BTC},
    {key: 'ETH', name: 'ETH / USDT', num: 2930.79, percent: -1.23, enable: true, address: Token.ETH},
    {key: 'BNB', name: 'BNB / USDT', num: 0, percent: 0, enable: false, address: '0xf3a6679b266899042276804930b3bfbaf807f15b'},
    {key: 'UNI', name: 'UNI / USDT', num: 0, percent: 0, enable: false, address: '0xf3a6679b266899042276804930b3bfbaf807f15b'}
  ],
  curPairKey: 'ETH',
  contractData: {
    positionChangeFeeRatio: '-', // 动仓费率
    traderOpenUpperBound: {size: 0, amount: 0},
    longPmrRate: '-', //挖矿收益 多
    shortPmrRate: '-',//挖矿收益 空
    tokenPriceRate: '-',//币种涨幅
    curSpotPrice: 0//币种价格
  },
  accountData: {
    balance: 0,
    marginBalance: 0,
    totalMargin: 0,
    marginRate: 0
  },
  positionData: [],
  limitPositionData: [],
  curSpotPrice: 0
}

const mutations = {
  SET_WALLET_ADDRESS (state, address) {
    state.wallet_address = address
    setCache('wallet_address', address)
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
  SET_POSITION_DATA (state, positionData) {
    state.positionData = positionData
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
  openPosition ({state}, {side, size, openType, price, leverage}) {
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

      const params = {
        token: coin.address, side, openType, size, price, leverage
      }

      web3Utils.contract(state.wallet_address)
        .openPosition(params).then(r => {
          resolve(r)
        }).catch(e => reject(e))
    })
  },
  closePosition ({state}, {coinAddress, side, size}) {
    return new Promise((resolve, reject) => {

      if(!state.wallet_address){
        return resolve({})
      }

      web3Utils.contract(state.wallet_address)
        .closePosition(coinAddress, side, size).then(r => {
        resolve(r)
      }).catch(e => reject(e))
    })
  },
  orderStopPosition ({state}, {coinAddress, side, stopType, stopPrice}) {
    return new Promise((resolve, reject) => {

      if(!state.wallet_address){
        return resolve({})
      }


      const params = {
        token: coinAddress,
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
  cancleOrderedPosition ({state}, {coinAddress, orderType, side, timestamp}) {
    return new Promise((resolve, reject) => {

      if(!state.wallet_address){
        return resolve({})
      }

      const params = {
        marketIdAddress:coinAddress,
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
  cancleAllOrderedPositions ({state}, {coinAddress}) {
    return new Promise((resolve, reject) => {

      if(!state.wallet_address){
        resolve({})
        return
      }

      web3Utils.contract(state.wallet_address)
        .cancleAllOrderedPositions(coinAddress, state.wallet_address).then(r => {
        resolve(r)
      }).catch(e => reject(e))
    })
  },
  loadHomeData ({state, commit}, entrustType = 0) {
    // 加载首页合约数据
    return (async function () {
      const data = {curSpotPrice: 0, positionChangeFeeRatio: 0}
      if(!state.wallet_address){
        return {}
      }

      const contract = web3Utils.contract(state.wallet_address)

      // 1.获取当前币种价格
      let idx = state.pairs.findIndex(pair => pair.key === state.curPairKey)

      if (idx === undefined) {
        idx = 0
      }

      const coin = state.pairs[idx]

      data.curSpotPrice = await contract.getSpotPrice(coin.address)
      commit('SET_CONTRACT_DATA', data)

      // 2.获取动仓费率
      data.positionChangeFeeRatio = await contract.getPositionChangeFeeRatio(coin.address)
      commit('SET_CONTRACT_DATA', data)

      // 3.获取可转仓量
      const price = data.curSpotPrice// 价格
      const leverage = 10// 杠杆

      data.traderOpenUpperBound = await contract.getTraderOpenUpperBound({marketIdAddress: coin.address, trader: state.wallet_address
        , openType: entrustType, price:  toHexString(price), leverage: toContractUnit(leverage)})



      commit('SET_CONTRACT_DATA', data)

      // 4.获取系统上限仓量
      data.sysOpenUpperBound = await contract.getSysOpenUpperBound({marketIdAddress: coin.address, side: entrustType})
      commit('SET_CONTRACT_DATA', data)
      return data
    }())
  },

  loadAccountData ({state, commit}) {
    // 1.获取
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

      console.log('loadAccountData', accountData)
      return accountData
    }())
  },
  loadPositionData ({state, commit}) {
    return (async function () {
      if(!state.wallet_address){
        return {}
      }

      const contract = web3Utils.contract(state.wallet_address)

      let idx = state.pairs.findIndex(pair => pair.key === state.curPairKey)

      if (idx === undefined) {
        idx = 0
      }

      const coin = state.pairs[idx]

      const positionData = await contract.getTraderAllPosition(state.wallet_address, coin.address)
      commit('SET_POSITION_DATA', positionData)
      return positionData
    })()
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

      const marketIdAddress = coin.address;

      const contract = web3Utils.contract(state.wallet_address)

      const data = await contract.getTraderOpenUpperBound({marketIdAddress: marketIdAddress
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


