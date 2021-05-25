<template>
  <div class="home">
    <van-nav-bar title="首页" :border="false" :fixed="true">
      <template #left>
        <img src="@/assets/images/uil_bars.png" alt="" srcset="">
      </template>
      <template #title>
        <text>经纪商</text>
      </template>
    </van-nav-bar>
  </div>
</template>

<script>
import { NavBar } from 'vant'
export default {
  name: 'Home',
  components: {
    [NavBar.name]: NavBar
  },
  beforeCreate () {
    this.$store.dispatch('user/login')
  }
}
</script>
