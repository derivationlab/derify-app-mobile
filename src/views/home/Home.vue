<template>
  <div class="home-container page-container">
    <navbar :logo="true" title="首页" />
    <div class="home-top">
      <div class="home-top-left">
        <div class="home-top-coin">
          <span>ETH/USDT</span>
          <van-icon color="#FFF" size="1.6rem"></van-icon>
        </div>
        <div class="home-top-num">
          <span>1234</span><span class="home-top-num-small">.50</span>
        </div>
        <div class="home-top-percent">+999.99%</div>
      </div>
      <div class="home-top-right">
        <div class="home-top-icons"></div>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar'

export default {
  name: 'Home',
  components: {
    Navbar
  },
  data () {
    return {
      show: false
    }
  },
  methods: {
    ClickBox () {
      this.show = true
    }
  }
}
</script>

<style lang="less" scoped>
</style>
