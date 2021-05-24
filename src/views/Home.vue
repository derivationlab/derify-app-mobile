<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
    <Button type="primary">测试自动按需引入vant组件</Button>
  </div>
</template>

<script>
// @ is an alias to /src
import { Button } from 'vant'
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Home',
  components: {
    Button,
    HelloWorld
  }
}
</script>
