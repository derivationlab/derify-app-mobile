
export class ChainEnum {
  constructor(chainId, name, logo = require('@/assets/images/wallet/eth-logo.png')){
    this.chainId = chainId
    this.name = name
    this.logo = logo
  }

  static get ETH() {
    return new ChainEnum(1, "Ethereum mainnet", require('@/assets/images/wallet/eth-logo.png'))
  }

  static get Kovan() {
    return new ChainEnum(42, "Kovan")
  }

  static get Goerli() {
    return new ChainEnum(5, "Goerli")
  }

  static get Rinkeby() {
    return new ChainEnum(4, "Rinkeby")
  }

  static get Ropsten() {
    return new ChainEnum(3, "Ropsten")
  }

  static get Morden() {
    return new ChainEnum(2, "Morden")
  }
}

const networkMap = {
  1: ChainEnum.ETH,
  2: ChainEnum.Morden,
  3: ChainEnum.Ropsten,
  4: ChainEnum.Rinkeby,
  5: ChainEnum.Goerli,
  42: ChainEnum.Kovan,
  // 1337: "Geth private chains (default)",
}

export class WalletEnum {
  static get MetaMask () {
    return 'MetaMask'
  }
}

/**
 * ÓÃ»§µÈ´ý×´Ì¬
 * 0(finished)->1(waiting)->2(success)->0(finished)
 * 0(finished)->1(waiting)->3(failed)->0(finished)
 *
 */
export class UserProcessStatus {
  static get finished() {
    return 0
  }

  static get waiting() {
    return 1
  }

  static get success() {
    return 2
  }

  static get failed() {
    return 3
  }
}

export const mainChain = ChainEnum.Rinkeby

const state = {
  selectedAddress: "",
  showWallet: false,
  isLogin: false,
  chainEnum: mainChain,
  isEthum: false,
  networkVersion: "",
  isMetaMask: false,
  processStatus: UserProcessStatus.finished,
  processStatusMsg: ''
};

export function getWallet(){

  if(!window.ethereum){
    return {selectedAddress: null, chainId: "1", networkVersion: null, isMetaMask: false, isLogin: false}
  }

  let wethereum = window.ethereum
  const isEthum = mainChain.chainId === parseInt(wethereum.chainId)
  return {
    selectedAddress: wethereum.selectedAddress,
    isLogin: wethereum.selectedAddress && isEthum,
    showWallet: !wethereum.selectedAddress || !isEthum,
    chainEnum: networkMap[parseInt(wethereum.chainId)],
    isEthum,
    networkVersion: wethereum.networkVersion,
    isMetaMask: wethereum.isMetaMask
  }
}

const mutations = {
  setShowWallet (state, showWallet) {
    state.showWallet = showWallet
  },
  updateProcessStatus (state, {status = UserProcessStatus.finished, msg = ''}) {
    state.processStatus = status
    state.processStatusMsg = msg
  },
  updateState (state, updates) {
    state = Object.assign(state, {...updates})
  }
}

const actions = {
  checkLogin ({commit, dispatch}) {

  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
