<template>
  <div class="home-container page-container">

    <van-nav-bar
      :title="$t('Rewards.Bond.Card.TransactionHistory')"
      left-arrow
      :border="false"
      :fixed="true"
      @click-left="onClickLeft"
    >
      <template #left>
        <van-icon name="arrow-left" color="rgba(255, 255, 255, .85)" size="2.4rem"></van-icon>
      </template>
    </van-nav-bar>

    <div class="home-top">
      <van-tabs v-model="activeName">
        <van-tab :title="$t('Rewards.Mining.History.PositionMining')" name="1">
          <inven></inven>
        </van-tab>
        <van-tab :title="$t('Rewards.Staking.History.eDRF')" name="2">
          <edrf></edrf>
        </van-tab>
         <van-tab :title="$t('Rewards.Bond.History.bDRF')" name="3">
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
    inven,
    edrf,
    berf
  },
  data () {
    const activeName = this.$route.query.id+""
    return {
      show: false,
      activeName: activeName
    }
  },
  mounted () {
    this.activeName = this.$route.query.id+""
  },
  watch:{
    '$route.query.id':{
      handler(){
        // this.activeName = this.$route.query.id+""
      },
      immediate: true
    }
  },
  methods: {
    ClickBox () {
      this.show = true
    },
    onClickLeft() {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="less" scoped>
.home-top{
  margin-top: 1.6rem;
}
</style>
