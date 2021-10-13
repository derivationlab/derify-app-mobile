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
          <div class="color-type">{{getType(data.update_type)}}</div>
          <div>
            <div :class="data.amount > 0 ? 'fc-green' : 'fc-red'">{{data.amount | amountFormt(2, true, '--')}}</div>
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
const typeMap = {
  0: "Rewards.Staking.History.Earning",
  1: "Rewards.Staking.History.Withdraw",
  6: "Rewards.Staking.History.Burn",
};

export default {
  data () {
    return {
      list: [],
      loading: false,
      page: 0,
      finished: false
    }
  },
  methods: {
    onLoad () {
      const self = this;
      self.loading = true;
      const curpage = this.page++;

      this.$store.dispatch("earnings/getTraderEdrfHistory", {page: curpage}).then((data) => {
        if(!data || data.length < 1) {
          self.finished = true
          return
        }
        if(curpage < 1){
          this.list.splice(0);
        }

        data.forEach((item) => self.list.push(item))
      }).catch(() => {
        self.finished = true
      }).finally(() => {
        self.loading = false
      })
    },
    getType(type){
      return typeMap[type] ? this.$t(typeMap[type]) : "unknown";
    }
  },
  mounted () {

  }
}
</script>
<style lang="less" scoped>
.heard{
  margin: 2.4rem 0;
  display: flex;
  color: rgba(255,255,255,0.45);
  div{
    flex: 1;
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
