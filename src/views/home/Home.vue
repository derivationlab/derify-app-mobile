<template>
  <div class="home">
    <navbar :logo="true" title="首页" />
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

<style lang="less" scoped>
</style>
