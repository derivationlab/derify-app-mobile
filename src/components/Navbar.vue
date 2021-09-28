<template>
  <div class="navbar-container">
    <van-nav-bar :title="title" :border="false" :fixed="true">

      <template #left>
        <template v-if="showGoback">
          <van-icon @click="$router.go(-1)" name="arrow-left" color="rgba(255, 255, 255, .85)" size="2.4rem"></van-icon>
        </template>
        <template v-else>
          <img
            @click="changeShowMenu(true)"
            src="@/assets/images/uil_bars.png"
            alt=""
            srcset=""
          />
        </template>
      </template>

      <template #title v-if="logo">
        <img src="@/assets/images/logo.png" alt="" srcset="" style="height: 3rem"/>
      </template>

      <template #right v-if="isLogin">
        <div class="first-letter-wrap-inline" @click="() => {

          if(user.hasBroker){
            changeRouter('account')
          }
        }">
          <img v-if="user.chainEnum"  :src="user.chainEnum ? user.chainEnum.logo : '#'"/>
          <template v-else>W</template>
        </div>
      </template>
      <template #right v-else>
        <div class="first-letter-wrap-inline" @click="$loginWallet()">C</div>
      </template>

    </van-nav-bar>

    <van-popup class="menu-popup" v-model="showMenu" position="left">
      <div class="interactive-error" v-if="loginError">{{ loginError }}</div>
      <div class="head-info">
        <div class="head-info-left" v-if="isLogin" @click="changeRouter('account')">
          <div class="first-letter-wrap">
            <img v-if="user.chainEnum"  :src="user.chainEnum ? user.chainEnum.logo : '#'"/>
            <template v-else>W</template>
          </div>
          <div class="info-div">
            <div class="info-name">
              {{$t('Trade.navbar.WalletAddress')}}
            </div>
            <div>{{ walletAddress }}</div>
          </div>
        </div>
        <div class="head-info-left"  v-else @click="$loginWallet()">
          <div class="first-letter-wrap">C</div>
          <div class="info-div">
            <div class="info-name">{{$t('Trade.navbar.ClickToLogin')}}</div>
            <div>{{$t('Trade.navbar.ConnectWallet')}}</div>
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
          <div class="menu-list-item-name">{{ $t("Trade.navbar.Home") }}</div>
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
          <div class="menu-list-item-name">{{ $t("Trade.navbar.Trade") }}</div>
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
          <div class="menu-list-item-name">{{ $t("Trade.navbar.Rewards") }}</div>
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
          <div class="menu-list-item-name">{{ $t("Trade.navbar.Broker") }}</div>
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
          <div class="menu-list-item-name">{{ $t("Trade.navbar.Data") }}</div>
        </div>
      </div>
      <div class="language-wrap">
        <div
        v-for="(item,index) in lanData" :key="index"
          class="language-item"
          :class="navIndex === item.id ? 'active' : ''"
          @click="changeLan(item.id)"
        >
          {{item.lan}}
        </div>
      </div>
    </van-popup>
    <wallet :show="showWallet" @closeWalletPopup="changeShowWallet" />
  </div>
</template>

<script>
import Wallet from './Wallet'
export default {
  props: ['logo', 'title', 'showGoback'],
  components: {
    Wallet
  },
  data () {
    let navIndex = window.sessionStorage.getItem('navIndex')
    if(!navIndex) {
      navIndex = 1
    }else{
      navIndex = parseInt(navIndex)
    }

    return {
      showMenu: false,
      loginError: null,
      navIndex: navIndex,
      lanData: [
        {
          lan: 'En',
          locale: 'en',
          id: 1
        },
        {
          lan: '中',
          locale: 'zh',
          id: 2
        }
      ]
    }
  },
  computed: {
    walletAddress () {
      const address = this.$store.state.user.selectedAddress
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
    },
    isLogin () {
      return this.$store.state.user.isLogin
    }
  },
  created () {
    this.$nextTick(() => {
    })
  },
  methods: {
    changeLan (index) {
      this.navIndex = index
      const lang = this.lanData.find((item) => item.id === index)
      this.$i18n.locale = lang.locale
      window.sessionStorage.setItem('locale', JSON.stringify(lang))
      window.sessionStorage.setItem('navIndex', lang.id)
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

</style>
