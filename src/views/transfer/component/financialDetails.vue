<template>
  <div class=" home-container page-container">
    <van-nav-bar
      title="资金划转"
      left-arrow
      :border="false"
      :fixed="true"
      @click-left="onClickLeft"
    >
      <template #left>
        <van-icon name="arrow-left" color="rgba(255, 255, 255, .85)" size="2.4rem"></van-icon>
      </template>
    </van-nav-bar>
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
      <div class="heard" v-for="(data, i) in list" :key="i">
        <div class="color-type">{{getFeeType(data.fee_type)}}</div>
        <div>
          <div :class="data.amount < 0 ? 'fc-red' : 'fc-green'">{{data.amount | amountFormt(2, true)}}</div>
          <div class="unit-span mrt-5">bDRF</div>
        </div>
        <div class="center-span">
          <div class="color-type">{{data.balance | amountFormt(2, false)}}</div>
          <div class="unit-span mrt-5">bDRF</div>
        </div>
        <div class="center-span unit-span">
          {{new Date(data.event_time).Format("yyyy-MM-dd hh:mm:ss")}}
        </div>
      </div>
        <!-- <van-cell v-for="item in list" :key="item" :title="item" /> -->
      </van-list>
  </div>
</template>
<script>

  import { amountFormt } from '../../../utils/utils'

  const feeTypeMap = {
    0: "手续费", //-TradingFee, 手续费
    1: "动仓费", //-PositionChangeFee, 动仓费
    2: "盈亏", //-ProfitAndLoss, 盈亏（根据amount正负判断盈/亏）
    3: "盈亏", //-ProfitAndLossAuto, 盈亏（自动减仓和强制平仓时的盈亏）
    4: "gas费", //-GasFee, gas费
    5: "清算费用", //-Liquidation，清算费用
    6: "系统补偿", //-SysCompensation, 系统补偿
    7: "系统亏损分摊", //-SysLossApportionment, 系统亏损分摊
    100: "资金转入", //-Deposit, 资金转入
    101: "资金转出" //-Withdraw, 资金转出
  }

export default {
  data () {
    return {
      list: [],
      loading: false,
      finished: false
    }
  },
  methods: {
    getFeeType (feeType) {
      const feeTypeText = feeTypeMap[feeType];
      return feeTypeText ? feeTypeText : '-'
    },
    onClickLeft () {
      this.$router.go(-1)
    },
    onLoad () {
      const self = this;
      self.loading = true
      self.finished = false
      const list = this.list

      this.$store.dispatch('contract/getTraderTradeBalanceDetail').then(r => {
        // Array<TradeBalanceDetail>
        if (r === undefined) {
          return
        }

        r.forEach((item) => {
          if (item !== undefined || !isNaN(item)) {
            list.push(item)
          }
        })

        self.loading = false
        self.finished = true

        console.log(list)
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
