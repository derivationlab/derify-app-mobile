<template>
  <div class=" home-container page-container">
    <van-nav-bar
      :title="$t('Trade.Account.FinanceDetail.BalanceHistory')"
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
        :v-model="loading"
        :finished="finished"
        :loading-text="$t('global.Loading')"
        @load="onLoad"
      >
      <div class="heard">
        <div>{{$t('Trade.Account.FinanceDetail.Type')}}</div>
        <div>{{$t('Trade.Account.FinanceDetail.Amount')}}</div>
        <div class="center-span">{{$t('Trade.Account.FinanceDetail.Balance')}}</div>
        <div class="center-span">{{$t('Trade.Account.FinanceDetail.Time')}}</div>
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
  import { EVENT_WALLET_CHANGE } from '../../../utils/web3Utils'

  const feeTypeMap = {
    0: "Trade.Account.FinanceDetail.TradFee", //-TradingFee,
    1: "Trade.Account.FinanceDetail.PCF", //-PositionChangeFee
    2: "Trade.Account.FinanceDetail.Profit", //-ProfitAndLoss
    3: "Trade.Account.FinanceDetail.RealizedPnL", //-ProfitAndLossAuto
    4: "Trade.Account.FinanceDetail.Gas", //-GasFee
    5: "Trade.Account.FinanceDetail.LiqCost", //-Liquidation
    6: "Trade.Account.FinanceDetail.Compensation", //-SysCompensation
    7: "Trade.Account.FinanceDetail.SysLoss", //-SysLossApportionment
    100: "Trade.Account.FinanceDetail.Deposit", //-Deposit
    101: "Trade.Account.FinanceDetail.Withdraw" //-Withdraw
  }

export default {
  data () {
    return {
      list: [],
      loading: false,
      page: 0,
      finished: false
    }
  },
  computed: {
    isLogin () {
      return this.$store.state.user.isLogin
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

      if(!this.loading) {
        return
      }

      const self = this;
      const list = this.list;
      const curpage = this.page++;
      this.$store.dispatch('contract/getTraderTradeBalanceDetail', {page: curpage}).then(r => {
        // Array<TradeBalanceDetail>
        self.loading = false

        if(curpage < 1){
          list.splice(0);
        }

        if (!r || r.length < 1) {
          this.finished = true
          return
        }


        r.forEach((item) => {
          if (item !== undefined || !isNaN(item)) {
            list.push(item)
          }
        })
      }).catch(() => {
        self.loading = false
        this.finished = true
      }).finally(() => {
        self.loading = false
      })
    }
  },
  mounted() {
    this.$eventBus.$on(EVENT_WALLET_CHANGE, () => {
      if(this.page < 1){
        this.onLoad()
      }
    })
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
