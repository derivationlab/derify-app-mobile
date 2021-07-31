import { Token,SideEnum } from '@/utils/contractUtil'
import * as web3Util from '@/utils/web3Utils'
import { getCache } from '../../utils/cache'
import { getTraderBondBalance, getTraderPMRBalance } from '../../api/trade'

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
  accountData: {
    totalPositionAmount: 0
  },
  pmrReward: 0,
  bondInfo: {
    /**
     * Convertible bond bDRF
     * Derify account balance (accuracy of 8 digits)
     */
    bondBalance: 0,

    /**
     * Income plan deposit (accuracy of 8 digits)
     */
    bondReturnBalance: 0,

    /**
     * Convertible bond for bDRF
     * Wallet account balance (accuracy of 8 digits)
     */
    bondWalletBalance: 0,

    /**
     * Annualized bond yield£¨accuracy of 8 digits£©
     */
    bondAnnualInterestRate: 0
  }
}

const mutations = {
  updateSate (state, palyload) {
    Object.assign(state, {...palyload})
  }
}

const actions = {
  loadEarningData ({state, commit, dispatch}) {
    return (async () => {
      const contract = web3Util.contract(state.wallet_address)
      const pmrReward = await contract.getPMReward(state.wallet_address)
      const traderVariable = await contract.getTraderVariables(state.wallet_address)
      const bondInfo = await contract.getBondInfo(state.wallet_address)

      const earningData = {pmrReward, accountData: {...traderVariable}, bondInfo}
      commit('updateSate', earningData)

      return earningData
    })()
  },
  withdrawPMReward ({state, commit, dispatch}, {amount}) {
    const contract = web3Util.contract(state.wallet_address)
    return contract.withdrawPMReward(amount)
  },
  withdrawBond ({state, commit, dispatch}, {amount}) {
    const contract = web3Util.contract(state.wallet_address)
    return contract.withdrawBond(amount)
  },
  exchangeBond ({state, commit, dispatch}, {amount, bondAccountType}) {
    const contract = web3Util.contract(state.wallet_address)
    return contract.exchangeBond({amount, bondAccountType})
  },
  depositBondToBank ({state, commit, dispatch}, {amount, bondAccountType}) {
    const contract = web3Util.contract(state.wallet_address)
    return contract.depositBondToBank({amount, bondAccountType})
  },
  redeemBondFromBank ({state, commit, dispatch}, {amount, bondAccountType }) {
    const contract = web3Util.contract(state.wallet_address)
    return contract.redeemBondFromBank({amount, bondAccountType })
  },
  getTraderPMRBalance ({state, commit, dispatch}) {
    const contract = web3Util.contract(state.wallet_address)
    return getTraderPMRBalance(state.wallet_address)
  },
  getTraderBondBalance ({state, commit, dispatch}) {
    const contract = web3Util.contract(state.wallet_address)
    return getTraderBondBalance(state.wallet_address)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
