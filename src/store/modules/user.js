
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

let wethereum = window.ethereum

if(!wethereum){
  wethereum = {selectedAddress: null, chainId: "1", networkVersion: null, isMetaMask: false}
}

export const mainChain = ChainEnum.Kovan

const state = {
  selectedAddress: wethereum.selectedAddress,
  showWallet: !wethereum.selectedAddress,
  chainEnum: networkMap[parseInt(wethereum.chainId)],
  isEthum: mainChain.chainId === parseInt(wethereum.chainId),
  networkVersion: wethereum.networkVersion,
  isMetaMask: wethereum.isMetaMask
}


const mutations = {
  setShowWallet (state, showWallet) {
    state.showWallet = showWallet
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
