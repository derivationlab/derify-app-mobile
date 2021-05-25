<template>
  <div class="home">
    <van-nav-bar title="首页" :border="false" :fixed="true">
      <template #left>
        <img  @click="ClickBox" src="@/assets/images/uil_bars.png" alt="" srcset="">
      </template>
      <template #title>
        <img src="@/assets/images/logo.png" alt="" srcset="">
      </template>
    </van-nav-bar>
          <van-popup
      v-model="show"
      :style="{ height: '100%', width: '60%', padding: '0 0 0 1rem' }"
      position="left"
    >
      <!-- <van-list router>
        <van-cell to="/securitySettings"
          >11</van-cell
        >
      </van-list> -->
    </van-popup>
  </div>
</template>

<script>
import { NavBar, Popup } from 'vant'
export default {
  name: 'Home',
  data () {
    return {
      show: false
    }
  },
  components: {
    [NavBar.name]: NavBar,
    [Popup.name]: Popup
  },
  beforeCreate () {
    this.$store.dispatch('user/login')
  },
  methods: {
    ClickBox () {
      this.show = true
    }
  }
}
</script>
