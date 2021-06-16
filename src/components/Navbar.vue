<template>
<div class="navbar-container">
  <van-nav-bar :title="title" :border="false" :fixed="true">
    <template #left>
      <img @click="changeShowMenu(true)" src="@/assets/images/uil_bars.png" alt="" srcset="">
    </template>
    <template #title v-if="logo">
      <img src="@/assets/images/logo.png" alt="" srcset="">
    </template>
  </van-nav-bar>
  <van-popup class="menu-popup" v-model="showMenu" position="left">
    <div class="interactive-error" v-if="loginError">{{loginError}}</div>
    <div class="head-info" @click="handleLogin">
      <div class="head-info-left" v-if="walletAddress">
        <div class="first-letter-wrap">OK</div>
        <div class="info-div">
          <div class="info-name">USER_NAME</div>
          <div>{{ walletAddress }}</div>
        </div>

      </div>
      <div class="head-info-left" v-else>
        <div class="first-letter-wrap">C</div>
        <div class="info-div">
          <div class="info-name">Click To Log In</div>
          <div>click to log in wallet</div>
        </div>
      </div>
      <van-icon name="arrow" size="2.2rem" color="rgba(255, 255, 255, .85)"></van-icon>
    </div>
    <div class="menu-list">
      <div class="menu-list-item" @click="changeRouter('home')" :class="$route.name === 'home' ? 'active' : ''">
        <img class="menu-list-item-icon" src="@/assets/icons/icon-menu-active.png" alt="">
        <van-icon
          class="menu-list-item-van-icon"
          name="home-o"
          :color="$route.name === 'home' ?  '#FAE247' : 'rgba(255, 255, 255, .85)'"
          size="2.0rem">
        </van-icon>
        <div class="menu-list-item-name">Home</div>
      </div>
      <div class="menu-list-item" @click="changeRouter('exchange')" :class="$route.name === 'exchange' ? 'active' : ''">
        <img class="menu-list-item-icon" src="@/assets/icons/icon-menu-active.png" alt="">
        <van-icon
          class="menu-list-item-van-icon" name="exchange"
          :color="$route.name === 'exchange' ?  '#FAE247' : 'rgba(255, 255, 255, .85)'"
          size="2.0rem">
        </van-icon>
        <div class="menu-list-item-name">Exchange</div>
      </div>
      <div class="menu-list-item" @click="changeRouter('data')" :class="$route.name === 'data' ? 'active' : ''">
        <img class="menu-list-item-icon" src="@/assets/icons/icon-menu-active.png" alt="">
        <van-icon
          class="menu-list-item-van-icon"
          name="bar-chart-o"
          :color="$route.name === 'data' ?  '#FAE247' : 'rgba(255, 255, 255, .85)'"
          size="2.0rem">
        </van-icon>
        <div class="menu-list-item-name">Dashboard</div>
      </div>
      <div class="menu-list-item" @click="changeRouter('earnings')" :class="$route.name === 'earnings' ? 'active' : ''">
        <img class="menu-list-item-icon" src="@/assets/icons/icon-menu-active.png" alt="">
        <van-icon
          class="menu-list-item-van-icon"
          name="bag-o"
          :color="$route.name === 'earnings' ?  '#FAE247' : 'rgba(255, 255, 255, .85)'"
          size="2.0rem">
        </van-icon>
        <div class="menu-list-item-name">Yield</div>
      </div>
      <div class="menu-list-item" @click="changeRouter('broker')" :class="$route.name === 'broker' ? 'active' : ''">
        <img class="menu-list-item-icon" src="@/assets/icons/icon-menu-active.png" alt="">
        <van-icon
          class="menu-list-item-van-icon"
          name="friends-o"
          :color="$route.name === 'broker' ?  '#FAE247' : 'rgba(255, 255, 255, .85)'"
          size="2.0rem">
        </van-icon>
        <div class="menu-list-item-name">Brokers</div>
      </div>
    </div>
    <div class="language-wrap">
      <div class="language-item active">简</div>
      <div class="language-item">繁</div>
      <div class="language-item">En</div>
    </div>
  </van-popup>
  <wallet :show="showWallet" @closeWalletPopup="changeShowWallet" />
</div>
</template>

<script>
import Wallet from './Wallet'

export default {
  props: ['logo', 'title'],
  components: {
    Wallet
  },
  data () {
    return {
      showMenu: false,
      showWallet: false,
      loginError: null
    }
  },
  computed: {
    walletAddress () {
      const address = this.$store.state.contract.wallet_address
      if (address.length === 42 && address.startsWith('0x')) {
        const length = address.length
        return `${address.substring(0, 6)}...${address.substring(length - 4, length)}`
      }
      return ''
    }
  },
  methods: {
    changeShowMenu (bool) {
      this.showMenu = bool
    },
    changeShowWallet (bool) {
      this.showWallet = bool
    },
    changeRouter (name) {
      if (this.$route.name === name) {
        this.changeShowMenu(false)
        return
      }
      this.changeShowMenu(false)
      setTimeout(_ => {
        this.$router.push({ name })
      }, 500)
    },
    handleLogin () {
      if (!this.walletAddress) {
        this.showWallet = true
        this.$store.dispatch('contract/loginWallet').then(_ => {
          this.$toast('Successfully log in wallet')
        }).catch(err => {
          this.$toast(err.message)
        }).finally(_ => {
          this.showWallet = false
          this.this.loginError = null
        })
      }
    }
  },
  beforeMount () {
    if (this.walletAddress) {
      this.$store.dispatch('contract/setAccount')
    }
  }
}
</script>

<style lang="less">
.head-info {
  padding: 10rem 2rem 2.4rem 2rem;
  border-bottom: .1rem solid rgba(255, 255, 255, .15);
  display: flex;
  justify-content: space-between;
  align-items: center;
  &-left {
    display: flex;
    .first-letter-wrap {
      width: 5rem;
      height: 5rem;
      border-radius: 50%;
      font-size: 1.6rem;
      border: .1rem solid rgba(255, 255, 255, .15);
      text-align: center;
      line-height: 5rem;
    }
    .info-div {
      margin-left: 2rem;
      padding: .5rem 0;
      height: 5rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: flex-start;
      font-size: 1.2rem;
      .info-name {
        font-size: 1.6rem;
        font-weight: 700;
      }
    }
  }
}
.menu-list {
  margin-top: 2.4rem;
  &-item {
    display: flex;
    height: 6.4rem;
    align-items: center;
    &-name {
      font-size: 1.7rem;
      color: rgba(255, 255, 255, .85);
      margin-left: 1.6rem;
    }
    &-icon {
      width: .8rem;
      height: 6.4rem;
      display: none;
    }
    &-van-icon {
      margin-left: 2.8rem;
    }
    &.active {
      background: #201B48;
      .menu-list-item-name {
        color: @orange;
      }
      .menu-list-item-icon {
        display: block;
      }
      .menu-list-item-van-icon {
        margin-left: 2rem;
      }
    }
  }
}
.language-wrap {
  width: 100%;
  padding-left: 3.2rem;
  display: flex;
  align-items: center;
  position: absolute;
  bottom: 4rem;
  left: 0;
  .language-item {
    height: 2.9rem;
    padding: 0 1.4rem;
    border-radius: 2.9rem;
    font-size: 1.4rem;
    display: flex;
    align-items: center;
    color: rgba(255, 255, 255, 0.45);
    border: .1rem solid rgba(255, 255, 255, .15);
    &.active {
      color: @orange;
      border-color: @orange;
    }
  }
  .language-item + .language-item {
    margin-left: 1.2rem;
  }
}
</style>
