<template>
  <van-popup class="wallet-popup" v-model="showPopup" @close="close">
    <div class="wallet-nav">
      <van-icon @click="close" class="wallet-nav-icon" size="2.4rem" name="arrow-left" color="rgba(255, 255, 255, .85)"></van-icon>
      <div>{{$t('Trade.Wallet.ConnectWallet')}}</div>
    </div>
    <div class="error-notice" v-if="showMetaMaskInstallError">
      <span>{{$t('Trade.Wallet.NoWalletErrorMsg', [WalletEnum.MetaMask])}}</span>
      <div class="error-right">
        <van-icon name="cross" class="van-icon-close" color="#EA446B" @click="()=>{this.showMetaMaskInstallError=false}"></van-icon>
      </div>
    </div>
    <div class="error-notice" v-if="showNetworkError">
      <span>{{$t('Trade.Wallet.MainChainUnmatch', [mainChain.name])}}</span>
      <div class="error-right">
        <van-icon name="cross" class="van-icon-close" color="#EA446B" @click="()=>{this.showNetworkError=false}"></van-icon>
      </div>
    </div>
    <div class="wallet-wrap">
      <div class="wallet-wrap-title">{{$t('Trade.Wallet.ChooseNetwork')}}</div>
      <div class="wallet-select-area">
        <div :class="'wallet-item ' + (selectedWalletNetwork.chainId === ChainEnum.BSC.chainId ? 'active' : '')" @click="changeNetwork(ChainEnum.BSC)">
          <img class="wallet-item-image" src="@/assets/images/wallet/bnb-logo.png" alt="">
          <div class="wallet-item-name">{{ChainEnum.BSC.name}}</div>
          <img class="wallet-item-select" src="@/assets/images/wallet/select.png" alt="">
        </div>
        <div :class="'wallet-item ' + (selectedWalletNetwork.chainId === ChainEnum.Rinkeby.chainId ? 'active' : '')" @click="changeNetwork(ChainEnum.Rinkeby)">
          <img class="wallet-item-image" src="@/assets/images/wallet/eth-logo.png" alt="">
          <div class="wallet-item-name">Ethereum ({{ChainEnum.Rinkeby.name}})</div>
          <img class="wallet-item-select" src="@/assets/images/wallet/select.png" alt="">
        </div>
        <div :class="'wallet-item disabled-item' + (selectedWalletNetwork.chainId === 99 ? 'active' : '')">
          <img class="wallet-item-image" src="@/assets/images/wallet/ht-logo.png" alt="">
          <div class="wallet-item-name">HECO</div>
          <img class="wallet-item-select" src="@/assets/images/wallet/select.png" alt="">
        </div>
        <div :class="'wallet-item  disabled-item' + (selectedWalletNetwork.chainId === 99 ? 'active' : '')">
          <img class="wallet-item-image" src="@/assets/images/wallet/sln-logo.png" alt="">
          <div class="wallet-item-name">Solana</div>
          <img class="wallet-item-select" src="@/assets/images/wallet/select.png" alt="">
        </div>
      </div>
    </div>
    <div class="wallet-wrap">
      <div class="wallet-wrap-title">{{$t('Trade.Wallet.ChooseWallet')}}</div>
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
    <div class="btn-wrap">
      <div class="derify-mid-btn derify-big-btn btn-yellow" @click="handleLogin">{{$t("global.Confirm")}}</div>
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
      selectedWalletNetwork: ChainEnum.BSC,
      ChainEnum, WalletEnum,
      mainChain,
      chainNetWorks: ChainEnum.values,
      selectedWallet: WalletEnum.MetaMask,
      showMetaMaskInstallError: false,
      showNetworkError: false,
    }
  },
  computed: {
    user () {
      return this.$store.state.user
    },
    isCanLogin () {
      const walletChainNet = this.$store.state.user.chainEnum.chainId;
      const isSelectMain = this.selectedWalletNetwork && this.selectedWalletNetwork.chainId === walletChainNet
      //const walletMain = this.$store.state.user.chainEnum.chainId === mainChain.chainId

      const isSelectMetaMask = this.selectedWallet === WalletEnum.MetaMask
      const walletMetaMask = this.$store.state.user.isMetaMask

      return isSelectMetaMask && walletMetaMask;
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
      //this.showNetworkError = chainEnum.chainId !== this.user.chainEnum.chainId;
      this.selectedWalletNetwork = chainEnum
    },

    async switchNetwork(chainEnum){
      try {
        // check if the chain to connect to is installed
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{chainId: '0x'+(chainEnum.chainId).toString(16)}], // chainId must be in hexadecimal numbers
        });
        return true;
      } catch (error) {

        if (error.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: '0x'+(chainEnum.chainId).toString(16),
                  rpcUrls: [chainEnum.rpc],
                  chainName: chainEnum.name,
                  blockExplorerUrls: [chainEnum.explorer],
                  nativeCurrency:{
                    name:"BNB",
                    symbol: "BNB",
                    decimals: 18
                  }
                },
              ],
            });

            return true;
          } catch (addError) {
            console.error(addError);
          }
        }
        console.error(error);
        return false;
      }
    },

    changeWallet(wallet) {
      this.showMetaMaskInstallError = !this.$store.state.user.isMetaMask
      this.selectedWallet = wallet
    },
    async handleLogin () {
      //page network
      const selectedWalletNetwork = this.selectedWalletNetwork;

      //wallet nework
      const walletMain = this.$store.state.user.chainEnum.chainId === selectedWalletNetwork.chainId;

      const isSelectMetaMask = this.selectedWallet === WalletEnum.MetaMask
      const walletMetaMask = this.$store.state.user.isMetaMask

      if(!walletMetaMask || !isSelectMetaMask){
        this.showMetaMaskInstallError = true;
        return false;
      }

      if(!walletMain){
        const ret = await this.switchNetwork(selectedWalletNetwork);
        if(!ret){
          this.showNetworkError = true;
          return;
        }
      }

      if(this.isCanLogin) {

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
.btn-wrap{
  display: flex;
  justify-content: center;
  .derify-mid-btn{
    &.derify-big-btn{
      width: 20rem;
    }
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
      &.disabled-item {
        opacity: 0.5;
      }
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
        color: rgba(255, 255, 255, 1);
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
