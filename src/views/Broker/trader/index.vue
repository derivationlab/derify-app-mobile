<template>
  <div>
    <van-list
        :v-model="loading"
        :finished="finished"
        :loading-text="$t('global.Loading')"
        @load="onLoad"
      >
      <div class="heard">
        <div>{{$t('Broker.Broker.History.Type')}}</div>
        <div>{{$t('Broker.Broker.History.Amount')}}</div>
        <div class="center-span">{{$t('Broker.Broker.History.Balance')}}</div>
        <div class="center-span">{{$t('Broker.Broker.History.Time')}}</div>
      </div>
      <template v-for="(data,key) in list">
        <div class="heard" :key="key">
          <div class="heard-col">
            <div class="color-type">{{$t(getUpdateType(data.update_type))}}</div>
            <div class="unit-span mrt-5" v-if="data.update_type!==1"><TextView :text="data.trader" show-pos="mid" len="10"/></div>
          </div>

          <div class="heard-col center-span">
            <div :class="data.amount > 0 ? 'fc-green' : 'fc-red'">{{data.amount | amountFormt(2, true, '--')}}</div>
            <div class="unit-span mrt-5">{{ usdTokenName }}</div>
          </div>
          <div class="heard-col center-span">
            <div class="color-type">{{data.balance | amountFormt(2, false, '--')}}</div>
            <div class="unit-span mrt-5">{{ usdTokenName }}</div>
          </div>
          <div class="heard-col unit-span">
            {{new Date(data.event_time).Format("yyyy-MM-dd hh:mm:ss")}}
          </div>
        </div>
      </template>
        <!-- <van-cell v-for="item in list" :key="item" :title="item" /> -->
      </van-list>
  </div>
</template>
<script>
import TextView from '@/components/TextView'
import {getUSDTokenName} from '@/config'
export default {
  components: {TextView},
  props:['broker'],
  data () {
    return {
      list: [],
      page: 0,
      size: 10,
      loading: false,
      finished: false
    }
  },
  computed:{
    usdTokenName(){
      return getUSDTokenName();
    }
  },
  methods: {
    getUpdateType(type) {
      return 'Rewards.Bond.History.Type' + type;
    },
    onLoad () {

      if(this.loading){
        return;
      }

      const curpage = this.page++;
      this.$store.dispatch('broker/getBrokerRewardHistory',
        {broker: this.broker, page: curpage, size: this.size})
      .then((records) => {

        if(!records || records.length < 1) {
          this.finished = true
          return
        }

        if(curpage < 1){
          this.list.splice(0);
        }

        records.forEach((record) => {
          this.list.push(record)
        })

      }).catch((e) => {
        console.warn(e)
      }).finally(() => {
        this.loading = false
      })
    }
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
  .fc-red {
    color: @red;
  }

  .fc-green {
    color: @green;
  }
}

</style>
