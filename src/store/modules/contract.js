import {getCache, setCache} from '@/utils/cache'
import * as web3Utils from '@/utils/web3Utils'
import {getTradeList, getTradeBalanceDetail} from "@/api/trade";

const state = {
  wallet_address: window.ethereum !== undefined ? ethereum.selectedAddress :  undefined,
  account: getCache('account') || null,
  pairs: [
    {key: 'BTC', name: 'BTC / USDT', num: 2030.23, percent: 1.23, enable: true, address: '0x7afe7373126eb5ef766caad2072c4a87810fbfa3'},
    {key: 'ETH', name: 'ETH / USDT', num: 2930.79, percent: -1.23, enable: true, address: '0xf3a6679b266899042276804930b3bfbaf807f15b'},
    {key: 'BNB', name: 'BNB / USDT', num: 0, percent: 0, enable: false, address: '0xf3a6679b266899042276804930b3bfbaf807f15b'},
    {key: 'UNI', name: 'UNI / USDT', num: 0, percent: 0, enable: false, address: '0xf3a6679b266899042276804930b3bfbaf807f15b'}
  ],
  curPairKey: 'ETH',
  contractData: {
    positionChangeFeeRatio: '-', // 动仓费率
    traderOpenUpperBound: '-',
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
        commit('SET_WALLET_ADDRESS', res[0])
        dispatch('setAccount')
      }).catch(err => reject(err))
    })
  },
  setAccount ({commit, state}) {
    return new Promise((resolve, reject) => {
      if (!state.wallet_address) {
        reject(new Error('log in wallet first'))
      } else {
        web3Utils.getAccount(state.wallet_address).then(r => {
          commit('SET_ACCOUNT', r)
          resolve(r)
        }).catch(err => reject(err))
      }
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
      let idx = state.pairs.findIndex(pair => pair.key === state.curPairKey)

      if (idx === undefined) {
        idx = 0
      }

      const coin = state.pairs[idx]

      web3Utils.contract(state.wallet_address)
        .openPosition(coin.address, side, openType, size, price, leverage).then(r => {
          resolve(r)
        }).catch(e => reject(e))
    })
  },
  closePosition ({state}, {coinAddress, side, size}) {
    return new Promise((resolve, reject) => {
      web3Utils.contract(state.wallet_address)
        .closePosition(coinAddress, side, size).then(r => {
        resolve(r)
      }).catch(e => reject(e))
    })
  },
  orderStopPosition ({state}, {coinAddress, side, stopType, stopPrice}) {
    return new Promise((resolve, reject) => {

      web3Utils.contract(state.wallet_address)
        .orderStopPosition(coinAddress, side, stopType, stopPrice).then(r => {
        resolve(r)
      }).catch(e => reject(e))
    })
  },
  closeAllPositions ({state}, { }) {
    return new Promise((resolve, reject) => {

      web3Utils.contract(state.wallet_address)
        .closeAllPositions().then(r => {
        resolve(r)
      }).catch(e => reject(e))
    })
  },
  cancleOrderedPosition ({state}, {coinAddress, orderType, side, timestamp}) {
    return new Promise((resolve, reject) => {

      web3Utils.contract(state.wallet_address)
        .cancleOrderedPosition(coinAddress, orderType, side, timestamp).then(r => {
        resolve(r)
      }).catch(e => reject(e))
    })
  },
  cancleAllOrderedPositions ({state}, {coinAddress}) {
    return new Promise((resolve, reject) => {
      web3Utils.contract(state.wallet_address)
        .cancleAllOrderedPositions(coinAddress).then(r => {
        resolve(r)
      }).catch(e => reject(e))
    })
  },
  getMarketAccount ({state}) {
    if(!state.wallet_address){
      return {}
    }

    return new Promise((resolve, reject) => {
      const idx = state.pairs.findIndex(pair => pair.key === state.curPairKey)
      web3Utils.getMarketAccount(state.wallet_address, idx).then(r => {
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

      // 2.获取动仓费率
      data.positionChangeFeeRatio = await contract.getPositionChangeFeeRatio(coin.address)

      // 3.获取可转仓量
      const price = data.curSpotPrice// 价格
      const leverage = 1e8// 杠杆
      data.traderOpenUpperBound = await contract.getTraderOpenUpperBound(coin.address, state.wallet_address, entrustType, price, leverage)

      // 4.获取系统上限仓量
      data.sysOpenUpperBound = await contract.getSysOpenUpperBound(coin.address, entrustType)

      data.traderOpenUpperBound = data.sysOpenUpperBound

      commit('SET_CONTRACT_DATA', data)

      console.log('loadHomeData', data);
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

      console.log('loadPositionData', positionData);

      commit('SET_POSITION_DATA', positionData)
      return positionData
    })()
  },
  loadOrderedPositionData ({state, commit}, {coinAddress}) {
    return (async function () {
      if(!state.wallet_address){
        return {}
      }

      let idx = state.pairs.findIndex(pair => pair.key === state.curPairKey)

      if (idx === undefined) {
        idx = 0
      }

      const coin = state.pairs[idx]

      coinAddress = coin.address;
      const contract = web3Utils.contract(state.wallet_address)

      const positionData = await contract.getTraderAllLimitPosition(state.wallet_address, coinAddress)

      commit('SET_LIMIT_POSITION_DATA', positionData)
      return positionData
    })()
  },
  loadTradeRecords ({state, commit}) {
    return getTradeList(state.wallet_address)
  },
  getTraderOpenUpperBound ({state, commit}, {openType, price, leverage}) {

    let idx = state.pairs.findIndex(pair => pair.key === state.curPairKey)

    if (idx === undefined) {
      idx = 0
    }

    const coin = state.pairs[idx]

    const marketIdAddress = coin.address;

    const contract = web3Utils.contract(state.wallet_address)

    return contract.getTraderOpenUpperBound(marketIdAddress, state.wallet_address, openType, price, leverage);
  },
  getTraderTradeBalanceDetail ({state, commit}) {
    return getTradeBalanceDetail(state.wallet_address)
  },
  onDeposit ({state, commit, dispatch}) {
    const self = this;
    web3Utils.contract(state.wallet_address).onDeposit(state.wallet_address, function (){
      dispatch("loadAccountData")
    })
  },
  onWithDraw ({state, commit, dispatch}) {
    const self = this;
    web3Utils.contract(state.wallet_address).onDeposit(state.wallet_address, function (){
      dispatch("loadAccountData")
    })
  }
}

export class SideEnum {
  static get LONG (){
    return 0;
  }

  static get SHORT (){
    return 1;
  }

  static get HEDGE() {
    return 2
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
