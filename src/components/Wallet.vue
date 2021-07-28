<template>
  <van-popup class="wallet-popup" v-model="showPopup" @close="close">
    <div class="wallet-nav">
      <van-icon @click="close" class="wallet-nav-icon" size="2.4rem" name="arrow-left" color="rgba(255, 255, 255, .85)"></van-icon>
      <div>连接钱包</div>
    </div>
    <div class="error-notice" v-if="showMetaMaskInstallError">
      <span>未检测到钱包，请先安装Metamask钱包。</span>
      <div class="error-right">
        <van-icon name="cross" class="van-icon-close" color="#EA446B" @click="()=>{this.showMetaMaskInstallError=false}"></van-icon>
      </div>
    </div>
    <div class="error-notice" v-if="showNetworkError">
      <span>您选择的主网与钱包的主网不一致，请将钱包主网切换至以太坊（{{mainChain.name}}）后重新登录。</span>
      <div class="error-right">
        <van-icon name="cross" class="van-icon-close" color="#EA446B" @click="()=>{this.showNetworkError=false}"></van-icon>
      </div>
    </div>
    <div class="wallet-wrap">
      <div class="wallet-wrap-title">选择网络</div>
      <div class="wallet-select-area">
        <div :class="'wallet-item ' + (selectedWalletNetwork.chainId === mainChain.chainId ? 'active' : '')" @click="changeNetwork(mainChain)">
          <img class="wallet-item-image" src="@/assets/images/wallet/eth-logo.png" alt="">
          <div class="wallet-item-name">Ethereum (xDai)</div>
          <img class="wallet-item-select" src="@/assets/images/wallet/select.png" alt="">
        </div>
        <div :class="'wallet-item ' + (selectedWalletNetwork.chainId === 99 ? 'active' : '')">
          <img class="wallet-item-image" src="@/assets/images/wallet/ht-logo.png" alt="">
          <div class="wallet-item-name">HECO</div>
          <img class="wallet-item-select" src="@/assets/images/wallet/select.png" alt="">
        </div>
        <div :class="'wallet-item ' + (selectedWalletNetwork.chainId === 99 ? 'active' : '')">
          <img class="wallet-item-image" src="@/assets/images/wallet/bnb-logo.png" alt="">
          <div class="wallet-item-name">Binance</div>
          <img class="wallet-item-select" src="@/assets/images/wallet/select.png" alt="">
        </div>
        <div :class="'wallet-item ' + (selectedWalletNetwork.chainId === 99 ? 'active' : '')">
          <img class="wallet-item-image" src="@/assets/images/wallet/sln-logo.png" alt="">
          <div class="wallet-item-name">Solana</div>
          <img class="wallet-item-select" src="@/assets/images/wallet/select.png" alt="">
        </div>
      </div>
    </div>
    <div class="wallet-wrap">
      <div class="wallet-wrap-title">选择钱包</div>
      <div class="wallet-select-area">
        <div :class="'wallet-item ' + (selectedWallet === WalletEnum.MetaMask ? 'active' : '')"  @click="changeWallet(WalletEnum.MetaMask)">
          <img class="wallet-item-image" src="@/assets/images/wallet/mask-logo.png" alt="">
          <div class="wallet-item-name">Metamask</div>
          <img class="wallet-item-select" src="@/assets/images/wallet/select.png" alt="">
        </div>
        <div class="wallet-item no-border"></div>
        <div class="wallet-item no-border"></div>
        <div class="wallet-item no-border"></div>
      </div>
    </div>
  </van-popup>
</template>

<script>

  import { ChainEnum, mainChain, WalletEnum } from '../store/modules/user'

export default {
  props: ['show'],
  data () {
    return {
      showPopup: this.show,
      selectedWalletNetwork: {},
      ChainEnum, WalletEnum, mainChain,
      selectedWallet: null,
      showMetaMaskInstallError: false,
      showNetworkError: false,
    }
  },
  computed: {
    user () {
      return this.$store.state.user
    }
  },
  watch: {
    show () {
      this.showPopup = this.show
    }
  },
  methods: {
    close () {
      this.$emit('closeWalletPopup', false)
    },
    changeNetwork(chainEnum) {

      this.showNetworkError = chainEnum.chainId !== this.user.chainEnum.chainId

      this.selectedWalletNetwork = chainEnum
      this.handleLogin()
    },
    changeWallet(wallet) {
      this.showMetaMaskInstallError = !this.$store.state.user.isMetaMask
      this.selectedWallet = wallet
      this.handleLogin()
    },
    handleLogin () {

      const isSelectMain = this.selectedWalletNetwork.chainId === mainChain.chainId
      const walletMain = this.$store.state.user.chainEnum.chainId === mainChain.chainId

      const isSelectMetaMask = this.selectedWallet === WalletEnum.MetaMask
      const walletMetaMask = this.$store.state.user.isMetaMask

      if(isSelectMain && walletMain && isSelectMetaMask && walletMetaMask) {

        this.$store
          .dispatch('contract/loginWallet')
          .then((_) => {

            this.$toast('Successfully log in wallet')
            this.showPopup = false
            this.$forceUpdate()
          })
          .catch((err) => {
            this.$toast(err.message)
          })
          .finally((_) => {
            this.loginError = null
          })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.wallet-nav {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.7rem;
  height: 6.6rem;
  font-weight: 500;
  position: relative;
  &-icon {
    position: absolute;
    top: 2.1rem;
    left: 1.5rem;
  }
}
.wallet-wrap {
  padding: 2rem 1.5rem 2rem 1.5rem;
  &-title {
    color: rgba(255, 255, 255, .65);
    font-size: 1.4rem;
  }
  .wallet-select-area {
    display: flex;
    margin-top: 1rem;
    .wallet-item {
      border: .1rem solid rgba(255, 255, 255, .15);
      border-radius: 1rem;
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 1.6rem .8rem 1.2rem .8rem;
      margin-right: 1rem;
      flex: .25;
      &.no-border {
        border: none;
      }
      &:last-child {
        margin-right: 0;
      }
      &-image {
        width: 3.2rem;
        height: 3.2rem;
      }
      &-name {
        margin-top: 1.2rem;
        font-size: 1.2rem;
        color: rgba(255, 255, 255, .65);
        word-break: break-all;
        text-align: center;
      }
      &-select {
        width: 2.2rem;
        height: 2.2rem;
        position: absolute;
        right: 0;
        top: 0;
        display: none;
      }
      &.active {
        border-color: @orange;
        .wallet-item-name {
          color: @orange;
        }
        .wallet-item-select {
          display: block;
        }
      }
    }
  }
}
</style>
