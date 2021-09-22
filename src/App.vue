<template>
  <div id="app">
    <router-view>
    </router-view>
    <debug-console-view/>
  </div>
</template>

<style lang="less">
#app{
  background-color: #140B32;
  min-height: 100vh;
}
</style>
<script>
import DebugConsoleView from "@/components/DebugConsoleView/DebugConsoleView";
export default {
  components: {DebugConsoleView},
  data() {
    return {}
  }
}
</script>
