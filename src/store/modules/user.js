import * as web3Utils from '@/utils/web3Utils'
import {Token} from "@/utils/contractUtil";
import { bindBroker, getBindBrokerByTrader, getBrokerByTrader, getBrokerIdByTrader } from '../../api/broker'
import { toChecksumAddress } from '@/utils/utils'
import store from '@/store'

let walletChangeVersion = 0;

export class ChainEnum {
  static values = []
  constructor(chainId, name, logo = require('@/assets/images/wallet/eth-logo.png'), disabled = true, rpcUrl= '', explorerUrl=''){
    this.chainId = chainId
    this.name = name
    this.logo = logo
    this.disabled = disabled
    this.rpc = rpcUrl;
    this.explorer = explorerUrl;
    ChainEnum.values.push(this)
  }

  static get ETH() {
    return new ChainEnum(1, "mainnet", require('@/assets/images/wallet/eth-logo.png'))
  }

  static get Kovan() {
    return new ChainEnum(42, "Kovan", true)
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

  static get BSC() {
    return new ChainEnum(0x38, "BNB", '', false, 'https://bsc-dataseed.binance.org', 'https://bscscan.com')
  }

  /**
   *
   * @return {ChainEnum[]}
   */
  static get values() {
    return ChainEnum.values
  }
}

const networkMap = {
  1: ChainEnum.ETH,
  2: ChainEnum.Morden,
  3: ChainEnum.Ropsten,
  4: ChainEnum.Rinkeby,
  5: ChainEnum.Goerli,
  42: ChainEnum.Kovan,
  0x38: ChainEnum.BSC,
  // 1337: "Geth private chains (default)",
}

export class WalletEnum {
  static get MetaMask () {
    return 'MetaMask'
  }
}

/**
 * user wait pop box
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
  processStatusMsg: '',
  balanceOfDUSD: 0,
  brokerInfo: null,
  brokerId: null
};

export async function asyncInitWallet() {
  if(!window.ethereum || !!window.ethereum.chainId){
    return {}
  }

  window.ethereum.chainId = await window.ethereum.request({method: 'eth_chainId'})
  window.ethereum.ethAccounts = await window.ethereum.request({method: 'eth_accounts'})

  if(window.ethereum.ethAccounts.length > 0){
    window.ethereum.selectedAddress = toChecksumAddress(window.ethereum.ethAccounts[0])
  }

  window.ethereum.networkVersion = await window.ethereum.request({method: 'net_version'})

  return window.ethereum
}

export async function getWallet(){

  if(!window.ethereum){
    return {selectedAddress: null, chainId: "1", networkVersion: null, isMetaMask: false, isLogin: false}
  }

  window.ethereum.selectedAddress = toChecksumAddress(window.ethereum.selectedAddress);
  let wethereum = window.ethereum
  const isEthum = mainChain.chainId === parseInt(wethereum.chainId)

  const chainId = parseInt(wethereum.chainId)

  const chainEnum = networkMap.hasOwnProperty(chainId) ? networkMap[chainId] : new ChainEnum(chainId, 'unkown');
  let brokerId = "";
  let brokerInfo = null;
  let traderBroker = null;

  if(window.ethereum.selectedAddress){
    try{
      brokerInfo = await getBrokerByTrader(wethereum.selectedAddress);
      traderBroker = await getBindBrokerByTrader(wethereum.selectedAddress);
      brokerId = traderBroker ? traderBroker.broker : "";
    }catch (e){
      console.error("getBrokerIdByTrader error", e)
    }
  }


  const isLogin = wethereum.selectedAddress && isEthum;
  const trader = isLogin ? wethereum.selectedAddress : "";

  return {
    selectedAddress: wethereum.selectedAddress,
    isLogin: wethereum.selectedAddress && isEthum,
    hasBroker: !!brokerId,
    showWallet: false,
    chainEnum: chainEnum,
    brokerId: brokerId,
    isEthum,
    networkVersion: wethereum.networkVersion,
    isMetaMask: wethereum.isMetaMask,
    trader,
    brokerInfo,
    traderBroker
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
  getBalanceOfDUSD ({state, commit, dispatch}) {
    return (async () => {

      if(!state.selectedAddress) {
        return
      }

      const balanceOf = await web3Utils.contract(state.selectedAddress).balanceOf(state.selectedAddress, Token.DUSD)
      commit('updateState', {balanceOfDUSD : balanceOf})
      return balanceOf;
    })();
  },
  initWallet({state, commit, dispatch}) {
    return (async () => {
      await asyncInitWallet();
      const walletInfo = await getWallet();
      walletInfo.walletChangeVersion = ++walletChangeVersion;
      commit("updateState", walletInfo);

      return walletInfo;
    })();
  },
  bindBroker ({state, commit, dispatch}, {trader, brokerId}) {
    return (async () => {
      const data = await bindBroker({
        brokerId,
        trader
      });

      if(data.success) {
        commit('updateState', {hasBroker: true, brokerId})
      }

      return data;
    })();
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
