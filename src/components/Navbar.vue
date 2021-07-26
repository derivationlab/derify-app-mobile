<template>
  <div class="navbar-container">
    <van-nav-bar :title="title" :border="false" :fixed="true">

      <template #left>
        <img
          @click="changeShowMenu(true)"
          src="@/assets/images/uil_bars.png"
          alt=""
          srcset=""
        />
      </template>

      <template #title v-if="logo">
        <img src="@/assets/images/logo.png" alt="" srcset="" />
      </template>

      <template #right v-if="walletAddress">
        <div class="first-letter-wrap-inline" @click="changeRouter('account')">
          <img v-if="user.chainEnum"  :src="user.chainEnum ? user.chainEnum.logo : '#'"/>
          <template v-else>W</template>
        </div>
      </template>
      <template #right v-else>
        <div class="first-letter-wrap-inline" @click="handleLogin"></div>
      </template>

    </van-nav-bar>
    <van-popup class="menu-popup" v-model="showMenu" position="left">
      <div class="interactive-error" v-if="loginError">{{ loginError }}</div>
      <div class="head-info" @click="handleLogin">
        <div class="head-info-left" v-if="walletAddress" @click="changeRouter('account')">
          <div class="first-letter-wrap">
            <img v-if="user.chainEnum"  :src="user.chainEnum ? user.chainEnum.logo : '#'"/>
            <template v-else>W</template>
          </div>
          <div class="info-div">
            <div class="info-name">
              钱包地址
            </div>
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
        <van-icon
          name="arrow"
          size="2.2rem"
          color="rgba(255, 255, 255, .85)"
        ></van-icon>
      </div>
      <div class="menu-list">
        <div
          class="menu-list-item"
          @click="changeRouter('home')"
          :class="$route.name === 'home' ? 'active' : ''"
        >
          <img
            class="menu-list-item-icon"
            src="@/assets/icons/icon-menu-active.png"
            alt=""
          />
          <van-icon
            class="menu-list-item-van-icon"
            name="home-o"
            :color="
              $route.name === 'home' ? '#FAE247' : 'rgba(255, 255, 255, .85)'
            "
            size="2.0rem"
          >
          </van-icon>
          <div class="menu-list-item-name">{{ $t("navbar.Home") }}</div>
        </div>
        <div
          class="menu-list-item"
          @click="changeRouter('exchange')"
          :class="$route.name === 'exchange' ? 'active' : ''"
        >
          <img
            class="menu-list-item-icon"
            src="@/assets/icons/icon-menu-active.png"
            alt=""
          />
          <van-icon
            class="menu-list-item-van-icon"
            name="exchange"
            :color="
              $route.name === 'exchange'
                ? '#FAE247'
                : 'rgba(255, 255, 255, .85)'
            "
            size="2.0rem"
          >
          </van-icon>
          <div class="menu-list-item-name">{{ $t("navbar.Trade") }}</div>
        </div>
        <div
          class="menu-list-item"
          @click="changeRouter('data')"
          :class="$route.name === 'data' ? 'active' : ''"
        >
          <img
            class="menu-list-item-icon"
            src="@/assets/icons/icon-menu-active.png"
            alt=""
          />
          <van-icon
            class="menu-list-item-van-icon"
            name="bar-chart-o"
            :color="
              $route.name === 'data' ? '#FAE247' : 'rgba(255, 255, 255, .85)'
            "
            size="2.0rem"
          >
          </van-icon>
          <div class="menu-list-item-name">{{ $t("navbar.Data") }}</div>
        </div>
        <div
          class="menu-list-item"
          @click="changeRouter('earnings')"
          :class="$route.name === 'earnings' ? 'active' : ''"
        >
          <img
            class="menu-list-item-icon"
            src="@/assets/icons/icon-menu-active.png"
            alt=""
          />
          <van-icon
            class="menu-list-item-van-icon"
            name="bag-o"
            :color="
              $route.name === 'earnings'
                ? '#FAE247'
                : 'rgba(255, 255, 255, .85)'
            "
            size="2.0rem"
          >
          </van-icon>
          <div class="menu-list-item-name">{{ $t("navbar.Rewards") }}</div>
        </div>
        <div
          class="menu-list-item"
          @click="changeRouter('broker')"
          :class="$route.name === 'broker' ? 'active' : ''"
        >
          <img
            class="menu-list-item-icon"
            src="@/assets/icons/icon-menu-active.png"
            alt=""
          />
          <van-icon
            class="menu-list-item-van-icon"
            name="friends-o"
            :color="
              $route.name === 'broker' ? '#FAE247' : 'rgba(255, 255, 255, .85)'
            "
            size="2.0rem"
          >
          </van-icon>
          <div class="menu-list-item-name">{{ $t("navbar.Partners") }}</div>
        </div>
      </div>
      <div class="language-wrap">
        <div
        v-for="(item,index) in lanData" :key="index"
          class="language-item"
          :class="navIndex === index ? 'active' : ''"
          @click="changeLan(index)"
        >
          {{item.lan}}
        </div>
        <!-- <div class="language-item" @click="En">en</div> -->
        <!-- <div class="language-item">繁 zh en</div> -->
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
      loginError: null,
      navIndex: 0,
      lanData: [
        {
          lan: '中',
          id: 1
        },
        {
          lan: 'En',
          id: 2
        }
      ]
    }
  },
  computed: {
    walletAddress () {
      const address = this.$store.state.contract.wallet_address
      if(!address){
        return ''
      }
      if (address.length === 42 && address.startsWith('0x')) {
        const length = address.length
        return `${address.substring(0, 6)}...${address.substring(
          length - 4,
          length
        )}`
      }
      return ''
    },
    showOpenStatus () {
      return this.$store.state.user.processStatus > 0
    },
    showWallet () {
      return this.$store.state.user.showWallet
    },
    user () {
      return this.$store.state.user
    }
  },
  created () {
    this.$nextTick(() => {
    })
  },
  methods: {
    changeLan (index) {
      this.navIndex = index
      if (!index) {
        this.$i18n.locale = 'zh'
        window.sessionStorage.setItem('locale', 'zh')
        window.sessionStorage.setItem('navIndex', index)
      } else {
        this.$i18n.locale = 'en'
        window.sessionStorage.setItem('locale', 'en')
        window.sessionStorage.setItem('navIndex', index)
      }
    },
    changeShowMenu (bool) {
      this.showMenu = bool
    },
    changeShowWallet (bool) {
      this.$store.commit("user/setShowWallet", bool)
    },
    changeRouter (name) {
      if (this.$route.name === name) {
        this.changeShowMenu(false)
        return
      }
      this.changeShowMenu(false)
      this.$router.push({ name })
    },
    handleLogin () {
      if (!this.walletAddress) {
        this.showWallet = true
        this.$store
          .dispatch('contract/loginWallet')
          .then((_) => {
            this.$toast('Successfully log in wallet')
          })
          .catch((err) => {
            this.$toast(err.message)
          })
          .finally((_) => {
            this.showWallet = false
            this.this.loginError = null
          })
      }
    },
    closeOpenStatus () {
      this.$store.commit("user/updateState", {processStatus: 0})
      this.$emit("closeOpenStatusPopup")
    }
  }
}
</script>

<style lang="less">
.first-letter-wrap-inline {
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  font-size: 1.6rem;
  border: 0.1rem solid rgba(255, 255, 255, 0.15);
  text-align: center;
  line-height: 4rem;
  display: inline-block;
  img{
    width: 4rem;
    height: 4rem;
  }
}
.head-info {
  padding: 10rem 2rem 2.4rem 2rem;
  border-bottom: 0.1rem solid rgba(255, 255, 255, 0.15);
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
      border: 0.1rem solid rgba(255, 255, 255, 0.15);
      text-align: center;
      line-height: 5rem;
      img{
        width: 5rem;
        height: 5rem;
      }
    }
    .info-div {
      margin-left: 2rem;
      padding: 0.5rem 0;
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
      color: rgba(255, 255, 255, 0.85);
      margin-left: 1.6rem;
    }
    &-icon {
      width: 0.8rem;
      height: 6.4rem;
      display: none;
    }
    &-van-icon {
      margin-left: 2.8rem;
    }
    &.active {
      background: #201b48;
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
    border: 0.1rem solid rgba(255, 255, 255, 0.15);
    &.active {
      color: @orange;
      border-color: @orange;
    }
  }
  .language-item + .language-item {
    margin-left: 1.2rem;
  }
}
  .error-notice {
    line-height: 4rem;
    border-radius: 1rem;
    margin: 2rem 1.5rem 2rem 1.5rem;
    border: 0.1rem solid @red;
    position: relative;
    color: @red;
    padding: 0 3rem 0 1rem;
    .error-right {
      position: absolute;
      right: 0;
      top: 0;
      display: inline-block;
      padding-right: 1rem;
    }
    .van-icon-cross{
      position: relative;
      display: inline-block;
      font: normal normal normal 14px/1 'vant-icon';
      font-size: inherit;
      text-rendering: auto;
      align-items: center;
    }
  }
</style>
