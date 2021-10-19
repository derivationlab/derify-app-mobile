<template>
  <fragment  v-if="isLogin" key="login-wrap-fragment">
    <slot></slot>
  </fragment>
  <div :class="this.className" v-else @click="$loginWallet()">{{$t('Trade.Wallet.ConnectWallet')}}</div>
</template>

<script>
export default {
  props:['className'],
  computed:{
    isLogin () {
      return !!this.$store.state.user.isLogin
    }
  },
  template:{

  },
  methods:{
  }
}
</script>
