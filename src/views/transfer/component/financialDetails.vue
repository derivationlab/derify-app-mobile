<template>
  <div class=" home-container page-container">
    <van-nav-bar
      :title="$t('Trade.Account.BalanceHistory')"
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
        :finished-text="$t('Trade.Account.NoMoreInfo')"
        @load="onLoad"
      >
      <div class="heard">
        <div>{{$t('Trade.Account.Type')}}</div>
        <div>{{$t('Trade.Account.Amount')}}</div>
        <div class="center-span">{{$t('Trade.Account.Balance')}}</div>
        <div class="center-span">{{$t('Trade.Account.Time')}}</div>
      </div>
      <div class="heard" v-for="(data, i) in list" :key="i">
        <div class="color-type">{{getFeeType(data.fee_type)}}</div>
        <div>
          <div :class="data.amount < 0 ? 'fc-red' : 'fc-green'">{{data.amount | amountFormt(2, true)}}</div>
          <div class="unit-span mrt-5">USDT</div>
        </div>
        <div class="center-span">
          <div class="color-type">{{data.balance | amountFormt(2, false)}}</div>
          <div class="unit-span mrt-5">USDT</div>
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
    0: "Trade.Account.TradeFee", //-TradingFee,
    1: "Trade.Account.PCF", //-PositionChangeFee
    2: "Trade.Account.Profit", //-ProfitAndLoss
    3: "Trade.Account.RealizedPnL", //-ProfitAndLossAuto
    4: "Trade.Account.Gas", //-GasFee
    5: "Trade.Account.LiqCost", //-Liquidation
    6: "Trade.Account.Compensation", //-SysCompensation
    7: "Trade.Account.SysLoss", //-SysLossApportionment
    100: "Trade.Account.Deposit", //-Deposit
    101: "Trade.Account.Withdraw" //-Withdraw
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
      return feeTypeText ? this.$t(feeTypeText) : '--'
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
