import {
  getCurrentIndexData,
  getCurrentInsurancePoolData,
  getCurrentPositionData,
  getHistoryInsurancePoolData,
  getHistoryPositionData, getHistoryTradingData
} from '@/api/data'

const state = {

}
const mutations = {
  updateState (state, updates) {
    state = Object.assign(state, {...updates})
  }
}

const actions = {
  loadTradeData ({state, commit, dispatch}, token) {
    return (async() => {
      const current = {}
      const history = await getHistoryTradingData(token)

      return {current,history}
    })()
  },
  loadHeldData ({state, commit, dispatch}, token) {
    return (async() => {
      const current = await getCurrentPositionData(token)
      const history = await getHistoryPositionData(token)
      return {current,history}
    })()
  },
  loadInsuranceData ({state, commit, dispatch}) {
    return (async() => {
      const current = await getCurrentInsurancePoolData()
      const history = await getHistoryInsurancePoolData()

      return {current,history}
    })()
  },
  loadTokenInfoData ({state, commit, dispatch}) {
    return (async() => {
      const current = await getCurrentIndexData()
      const history = await getHistoryPositionData()

      return {current}
    })()
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
