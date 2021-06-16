import { getCache, setCache } from '@/utils/cache'
import { enable, getAccount, deposit } from '@/utils/web3Utils'

const state = {
  wallet_address: getCache('wallet_address') || '',
  account: getCache('account') || null
}
const mutations = {
  SET_WALLET_ADDRESS (state, address) {
    state.wallet_address = address
    setCache('wallet_address', address)
  },
  SET_ACCOUNT (state, account) {
    state.account = account
    setCache('account', account)
  }
}

const actions = {
  loginWallet ({ commit, dispatch }) {
    return new Promise((resolve, reject) => {
      enable().then(res => {
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
        getAccount(state.wallet_address).then(r => {
          commit('SET_ACCOUNT', r)
          resolve(r)
        }).catch(err => reject(err))
      }
    })
  },
  depositAccount ({ commit }, amount) {
    return new Promise((resolve, reject) => {
      if (!state.wallet_address) {
        reject(new Error('log in wallet first'))
      } else {
        deposit(state.wallet_address, amount).then(r => {
          resolve(r)
        }).catch(err => reject(err))
      }
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
