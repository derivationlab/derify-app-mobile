<template>
  <div class="home-container page-container">
    <navbar :logo="true" title="首页" />
    <div class="home-top">
      <div class="home-top-coin">
        收益
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
  // beforeCreate () {
  //   this.$store.dispatch('user/login')
  // }
}
</script>

<style lang="less" scoped>
</style>
