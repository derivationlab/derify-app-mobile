import { bindBroker, getBrokerList } from '../../api/broker'

const state = {
  brokers:[]
}

const mutations = {
  updateState (state, palyload) {
  },
  addBrokers (state, brokers) {
    brokers.forEach((broker => {
      state.brokers.push(broker)
    }))
  },
}

const actions = {
  getBrokerList({state, commit, dispatch}, {page = 0, size=10}) {
    return (async () => {
      const brokers = await getBrokerList(page, size)
      commit('addBrokers', brokers)
      return brokers
    })()
  },
  bindBroker ({state, commit, dispatch}, {trader, brokerId}) {
    return (async () => {
      return await bindBroker({
        brokerId,
        trader
      })
    })()
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
