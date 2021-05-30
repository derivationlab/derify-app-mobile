<template>
  <div class="home-container page-container">
    <navbar title="收益-明细" />
    <div class="home-top">
      <van-tabs v-model="activeName">
        <van-tab title="持仓挖矿" name="1">
          <inven></inven>
        </van-tab>
        <van-tab title="eDRF" name="2">
          <edrf></edrf>
        </van-tab>
         <van-tab title="bDRF" name="3">
           <berf></berf>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar'
import inven from './inven/index.vue'
import edrf from './edrf/index.vue'
import berf from './bdrf/index.vue'
export default {
  name: 'detail',
  components: {
    Navbar,
    inven,
    edrf,
    berf
  },
  data () {
    return {
      show: false,
      activeName: ''
    }
  },
  mounted () {
    this.activeName = this.$route.query.id
  },
  methods: {
    ClickBox () {
      this.show = true
    }
  }
}
</script>

<style lang="less" scoped>
.home-top{
  margin-top: 1.6rem;
}
</style>
