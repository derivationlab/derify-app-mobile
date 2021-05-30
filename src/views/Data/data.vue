<template>
  <div class="home-container page-container">
    <navbar title="数据" />
    <div class="home-top">
      数据
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
