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
import { createDataEvenet } from '@/api/trade'
let eventSource = null;
export default {
  components: {DebugConsoleView},
  data() {
    return {}
  },
  computed:{
    curPair () {
      const {curPairKey, pairs} = this.$store.state.contract
      return pairs.find(pair => pair.key === curPairKey)
    },
  },
  created () {
    const self = this;

    if(eventSource){
      eventSource.close();
      eventSource = null;
    }

    eventSource = createDataEvenet((datas) => {
      datas.forEach((data) => {
        if(data.token === self.curPair.address){
          self.$store.commit('contract/SET_CONTRACT_DATA', {longPmrRate: data.longPmrRate * 100, shortPmrRate: data.shortPmrRate * 100})
        }

        self.$store.dispatch('contract/updateAllPairPrice', {token: data.token, priceChangeRate: data.price_change_rate})
      })

    })
  },
  beforeDestroy () {
    if(!eventSource){
      eventSource.close();
      eventSource = null;
    }
  }
}
</script>
