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
        <div>{{$t('Rewards.Bond.History.Type')}}</div>
        <div>{{$t('Rewards.Bond.History.Amount')}}</div>
        <div class="center-span">{{$t('Rewards.Bond.History.Balance')}}</div>
        <div class="center-span">{{$t('Rewards.Bond.History.Time')}}</div>
      </div>
      <template v-for="(data,key) in list">
        <div class="heard" :key="key">
          <div class="color-type">{{$t(getUpdateType(data.bond_update_type))}}</div>
          <div>
            <div :class="data.amount > 0 ? 'fc-green' : 'fc-red'">{{data.amount | amountFormt(2, true, '--')}}</div>
            <div class="unit-span mrt-5">bDRF</div>
          </div>
          <div class="center-span">
            <div class="color-type">{{data.balance | amountFormt(2, false, '--')}}</div>
            <div class="unit-span mrt-5">bDRF</div>
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
      page: 0,
      finished: false
    }
  },
  methods: {
    onLoad () {
      if(this.loading){
        return;
      }

      const self = this;
      self.loading = true;
      const curpage = this.page++;

      this.$store.dispatch("earnings/getTraderBondBalance", {page: curpage}).then((data) => {

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
      });
    },
    getUpdateType(type) {
      return 'Rewards.Bond.History.Type' + type;
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
