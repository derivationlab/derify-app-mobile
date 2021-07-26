<template>
  <div>
    <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
      <div class="heard">
        <div>操作类型</div>
        <div>金额</div>
        <div class="center-span">余额</div>
        <div class="center-span">时间</div>
      </div>
      <template v-for="(data,key) in list">
        <div class="heard" :key="key">
          <div class="color-type">{{data.pmr_update_type === 0 ? '收入' : '提取'}}</div>
          <div>
            <div class="color-type">{{data.amount | amountFormt(2, true, '-')}}</div>
            <div class="unit-span mrt-5">USDT</div>
          </div>
          <div class="center-span">
            <div class="color-type">{{data.balance | amountFormt(2, true, '-')}}</div>
            <div class="unit-span mrt-5">USDT</div>
          </div>
          <div class="center-span unit-span">
            {{new Date(data.event_time).Format("yyyy-MM-dd hh:mm:ss")}}
          </div>
        </div>
      </template>
        <!-- <van-cell v-for="item in list" :key="item" :title="item" /> -->
      </van-list>
  </div>
</template>
<script>
export default {
  data () {
    return {
      list: [],
      loading: false,
      finished: false
    }
  },
  methods: {
    onLoad () {

    }
  },
  mounted () {
    const self = this;
    self.loading = true
    this.$store.dispatch("earnings/getTraderPMRBalance").then((data) => {

      if(data instanceof Array){
        self.list.splice(0)
        data.forEach((item) => self.list.push(item))
        self.loading = false
      }
    });
  }
}
</script>
<style lang="less" scoped>
.heard{
  margin: 2.4rem 0;
  display: flex;
  div{
    flex: 1;
    color: rgba(255,255,255,0.45);
    font-size: 1.3rem;
  }
  .center-span{
    width: 10%;
    text-align:center;
  }
  .unit-span{
    color: rgba(255,255,255,0.45);
    font-weight: 400;
  }
  .color-type{
    color: rgba(255,255,255,0.85);
  }
}

</style>
