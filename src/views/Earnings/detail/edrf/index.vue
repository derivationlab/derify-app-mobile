<template>
  <div>
    <van-list
        v-model="loading"
        :finished="finished"
        :finished-text="$t('global.NoMoreInfo')"
        :loading-text="$t('global.Loading')"
        @load="onLoad"
      >
      <div class="heard">
        <div>{{$t('Rewards.Staking.History.Type')}}</div>
        <div>{{$t('Rewards.Staking.History.Amount')}}</div>
        <div class="center-span">{{$t('Rewards.Staking.History.Balance')}}</div>
        <div class="center-span">{{$t('Rewards.Staking.History.Time')}}</div>
      </div>
      <template v-for="(data,key) in list">
        <div class="heard" :key="key">
          <div class="color-type">{{data.pmr_update_type === 0 ? $t('Rewards.Staking.History.Earning') : $t('Rewards.Staking.History.Withdraw')}}</div>
          <div>
            <div :class="data.amount > 0 ? 'color-type fc-green' : 'color-type fc-red'">{{data.amount | amountFormt(2, true, '--')}}</div>
            <div class="unit-span mrt-5">eDRF</div>
          </div>
          <div class="center-span">
            <div class="color-type">{{data.balance | amountFormt(2, true, '--')}}</div>
            <div class="unit-span mrt-5">eDRF</div>
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
    this.$store.dispatch("earnings/getTraderBondBalance").then((data) => {
      if(data instanceof Array){
        self.list.splice(0)
        data.forEach((item) => self.list.push(item))
      }

    }).finally(() => {
      self.loading = false
      self.finished = true
    });;
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
