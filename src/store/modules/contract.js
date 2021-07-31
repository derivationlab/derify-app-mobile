import { getCache, setCache } from '@/utils/cache'
import * as web3Utils from '@/utils/web3Utils'

const state = {
  wallet_address: getCache('wallet_address') || '',
  account: getCache('account') || null,
  pairs: [
    { key: 'BTC', name: 'BTC / USDT', num: 2030.23, percent: 1.23, enable: true, address: '0xf3a6679b266899042276804930b3bfbaf807f15b' },
    { key: 'ETH', name: 'ETH / USDT', num: 2930.79, percent: -1.23, enable: true, address: '0xf3a6679b266899042276804930b3bfbaf807f15b' },
    { key: 'BNB', name: 'BNB / USDT', num: 0, percent: 0, enable: false, address: '0xf3a6679b266899042276804930b3bfbaf807f15b' },
    { key: 'UNI', name: 'UNI / USDT', num: 0, percent: 0, enable: false, address: '0xf3a6679b266899042276804930b3bfbaf807f15b' }
  ],
  curPairKey: 'ETH',
  contractData: {
    positionChangeFeeRatio: '-', // 动仓费率
    traderOpenUpperBound: '-',
    curSpotPrice: 0
  },
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
    state.contractData = Object.assign({}, state.contractData, { ...updates })
  }

}

const actions = {
  loginWallet ({ commit, dispatch }) {
    return new Promise((resolve, reject) => {
      web3Utils.enable().then(res => {
        commit('SET_WALLET_ADDRESS', res[0])
        dispatch('setAccount')
      }).catch(err => reject(err))
    })
  },
  setAccount ({ commit, state }) {
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
  depositAccount ({ state }, amount) {
    return new Promise((resolve, reject) => {
      if (!state.wallet_address) {
        reject(new Error('log in wallet first'))
      } else {
        web3Utils.contract(state.wallet_address).deposit(amount).then(r => resolve(r)).catch(err => reject(err))
        // web3Utils.deposit(state.wallet_address, amount).then(r => resolve(r)).catch(err => reject(err))
      }
    })
  },
  withdrawAccount ({ state }, amount) {
    return new Promise((resolve, reject) => {
      if (!state.wallet_address) {
        reject(new Error('log in wallet first'))
      } else {
        const idx = state.pairs.findIndex(pair => pair.key === state.curPairKey)
        web3Utils.withdraw(state.wallet_address, idx, amount).then(r => resolve(r)).catch(err => reject(err))
      }
    })
  },
  getSpotPrice ({ state, commit }) {
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
  openPosition ({ state }, { side, size, price, leverage }) {
    return new Promise((resolve, reject) => {
      const idx = state.pairs.findIndex(pair => pair.key === state.curPairKey)
      web3Utils.openPosition(state.wallet_address, idx, side, size, price, leverage).then(r => {
        resolve(r)
      }).catch(e => reject(e))
    })
  },
  getMarketAccount ({ state }) {
    return new Promise((resolve, reject) => {
      const idx = state.pairs.findIndex(pair => pair.key === state.curPairKey)
      web3Utils.getMarketAccount(state.wallet_address, idx).then(r => {
        resolve(r)
      }).catch(e => reject(e))
    })
  },
  loadHomeData ({ state, commit }) {
    // 加载首页合约数据
    return new async function () {
      const data = { curSpotPrice: 0, positionChangeFeeRatio: 0 }

      const contract = web3Utils.contract(state.wallet_address)

      // 1.获取当前币种价格
      let idx = state.pairs.findIndex(pair => pair.key === state.curPairKey)

      if (idx === undefined) {
        idx = 0
      }

      const coin = state.pairs[idx];

      data.curSpotPrice = await contract.getSpotPrice(coin.address);

      // 2.获取动仓费率
      data.positionChangeFeeRatio = await contract.getPositionChangeFeeRatio(coin.address);

      // 3.获取可转仓量
      const entrustType = 0;// 开仓类型
      const price = 0;// 价格
      const leverage = 0;// 杠杆
      data.traderOpenUpperBound = await contract.getTraderOpenUpperBound(coin.address, state.wallet_address, entrustType, price, leverage)

      const side = 0;
      // 4.获取系统上限仓量
      data.sysOpenUpperBound = await contract.getSysOpenUpperBound(coin.address, side);

      data.traderOpenUpperBound = data.sysOpenUpperBound;

      commit('SET_CONTRACT_DATA', data);

      return data
    };
  },

  loadTradePositions ({ state, commit }) {
    //1.获取
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
