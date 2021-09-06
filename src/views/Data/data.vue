<template v-if="show">
  <div class="home-container page-container">
    <navbar :title="$t('Trade.navbar.Data')" />
    <div class="home-top">
      <div class="data-filter-wrap">
        <div class="derify-dropmenu-wrap">
          <van-dropdown-menu :overlay="false" class="derify-dropmenus">
            <van-dropdown-item v-model="mainOption" :options="mainOptions"  @change="loadData"
                               class="derify-dropmenu-item-wrap derify-dropmenu-item">
              <div class="derify-dropmenu-title" slot="title">
                <span>{{mainOptions[mainOption].text}}</span>
                <van-icon name="arrow-down" size="1.8rem" color="rgba(255, 255, 255, .85)" />
              </div>
            </van-dropdown-item>
          </van-dropdown-menu>
        </div>

        <div class="derify-dropmenu-wrap" v-if="mainOptions[mainOption].hasSubOption">
          <van-dropdown-menu :overlay="false" class="derify-dropmenus">
            <van-dropdown-item v-model="subOption" :options="subOptions" @change="loadData"
                               class="derify-dropmenu-item-wrap derify-dropmenu-item">
              <div class="derify-dropmenu-title" slot="title">
                <span>{{subOptions[subOption].text}}</span>
                <van-icon name="arrow-down" size="1.8rem" color="rgba(255, 255, 255, .85)" />
              </div>
            </van-dropdown-item>
          </van-dropdown-menu>
        </div>
      </div>

      <template v-if="mainOption === 0">
        <div class="classify-div">
          <div class="div1">
            <span class="ify-span"><span class="colory"></span> {{$t('Data.Data.Trade.TradingVolume')}}（24h）</span>
            <div class="ify-div">
              <span class="num">{{tradeData.current.trading_amount}}</span>
              <span class="unit">USDT</span>
            </div>
          </div>
          <div class="div1">
            <span class="ify-span"><span class="colorb"></span>{{$t('Data.Data.Trade.TradFeeEarning')}}（24h）</span>
            <div class="ify-div">
              <span class="num">{{tradeData.current.trading_fee}}</span>
              <span class="unit">USDT</span>
            </div>
          </div>
        </div>
      </template>
      <template v-if="mainOption === 1">
        <div class="classify-div">
          <div class="div1">
            <span class="ify-span"><span class="color-green"></span> {{$t('Data.Data.Held.TotalLong')}}</span>
            <div class="ify-div">
              <span class="fc-green">{{heldData.current.long_position_amount}}</span>
              <span class="unit">USDT</span>
            </div>
          </div>
          <div class="div1">
            <span class="ify-span"><span class="color-red"></span>{{$t('Data.Data.Held.TotalShort')}}</span>
            <div class="ify-div">
              <span class="fc-red">{{heldData.current.short_position_amount}}</span>
              <span class="unit">USDT</span>
            </div>
          </div>
        </div>
      </template>
      <template v-if="mainOption === 2">
        <div class="classify-div">
            <div class="div1">
              <span class="ify-span fz-12">{{$t('Data.Data.Insurance.InsurancePoolBalance')}}</span>
              <div class="ify-div">
                <span class="num fc-yellow fz-20">{{insuranceData.current.insurance_pool}}</span>
                <span class="unit">USDT</span>
              </div>
            </div>
        </div>
      </template>

      <template v-if="mainOption === 3">
        <div class="token-info-wrap">
          <div class="div1">
            <span class="ify-span">DRF{{$t('Data.Data.Token.Price')}}</span>
            <div class="ify-div">
              <span class="num">{{tokenData.current.drfPrice}}</span>
              <span class="unit fz-12">USDT</span>
            </div>
          </div>
          <div class="div1">
            <span class="ify-span">DRF{{$t('Data.Data.Token.TotalDestroyedVolume')}}</span>
            <div class="ify-div">
              <span class="num">{{tokenData.current.drfBurnt}}</span>
              <span class="unit fz-12">DRF</span>
            </div>
          </div>
          <div class="div1">
            <span class="ify-span">DRF{{$t('Data.Data.Token.BuyBackFundBalance')}}(USDT)</span>
            <div class="ify-div">
              <span class="num">{{tokenData.current.drfBuyBack}}</span>
              <span class="unit fz-12"> USDT</span>
            </div>
          </div>
          <div class="div1">
            <span class="ify-span">eDRF{{$t('Data.Data.Token.Price')}}</span>
            <div class="ify-div">
              <span class="num">{{tokenData.current.edrfPrice}}</span>
              <span class="unit fz-12">USDT</span>
            </div>
          </div>
          <div class="div1">
            <span class="ify-span">bDRF{{$t('Data.Data.Token.Price')}}</span>
            <div class="ify-div">
              <span class="num">{{tokenData.current.bdrfPrice}}</span>
              <span class="unit fz-12">USDT</span>
            </div>
          </div>
        </div>
      </template>
    </div>
    <template v-if="mainOption !== 3">
      <div id="myChart" :style="{width: '100%', height: '36.5rem'}"></div>
    </template>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar'
import {options,data0} from '@/utils/kExample'
import getEchartsOptions from "@/utils/kline";
import { fromContractUnit, Token } from '@/utils/contractUtil'
import generateDataEchartsOptions from '@/utils/data-chart'

window.data0 = data0;
const context = {
  myChart: null
};
export default {
  name: 'Home',
  components: {
    Navbar
    // theme
  },
  data () {
    return {
      show: true,
      mainOption: 0,
      subOption: 0,
      tradeData: {
        current: {
          "trading_amount": 0,
          "trading_fee": 0
        },
        history: []
      },
      heldData: {
        current: {long_position_amount: 0, short_position_amount: 0},
        history: []
      },
      insuranceData: {
        current: {
          "insurance_pool": 0
        },
        history: []
      },
      tokenData: {
        current: {
          "drfPrice": 0,
          "drfBurnt": 0,
          "drfBuyBack": 0,
          "edrfPrice": 0,
          "bdrfPrice": 0
        }
      }
    }
  },
  mounted () {
    this.loadData()
  },
  computed:{
    mainOptions () {
      return [
        {value: 0, text: this.$t('Data.Data.Trade.TradingVolume'), hasSubOption: true},
        {value: 1, text: this.$t('Data.Data.Held.PositionVolume'), hasSubOption: true},
        {value: 2, text: this.$t('Data.Data.Insurance.InsurancePool')},
        {value: 3, text: this.$t('Data.Data.Token.TokenInfo')}
      ]
    },
    subOptions () {
      return [
        {value: 0, text: this.$t('Data.Data.Trade.All'), token: 'all'},
        {value: 1, text: 'ETH/USDT', token: Token.ETH},
        {value: 2, text: 'BTC/USDT', token: Token.BTC},
      ]
    },
    subToken () {
      if(this.subOptions[this.subOption]) {
        return this.subOptions[this.subOption].token
      }

      return 'all'
    }
  },
  methods: {
    drawLine (options) {
      if(!this.show){
        return
      }

      if(!options){
        return
      }

      // Based on the prepared dom, initialize the echarts instance
      if(context.myChart !== null) {
        context.myChart.dispose()
        context.myChart = null
      }

      // Draw a chart
      context.myChart = this.$echarts.init(document.getElementById('myChart'))
      context.myChart.setOption(options)
      context.myChart.resize()
    },
    loadData() {
      if(this.mainOption === 0) {
        this.$store.dispatch('data/loadTradeData', this.subToken).then((data) => {
          this.tradeData = Object.assign(this.tradeData, data)
          //updare echarts

          //trading_fee: number, day_time: string, trading_amount: number
          //trading_amount trading_fee
          const color = ['#fae247', '#475FFA']
          const xaxis = []

          const tradAmSeries = {stack: 'trading amount', data: []}
          const tradFeeSeries = {stack: 'trading fee', data: []}
          const seriers = [tradAmSeries, tradFeeSeries]

          //{long_position_amount: number, short_position_amount: number, day_time: string}
          for(let i = 0; i < data.history.length; i++) {
            const item = data.history[i];
            xaxis.push(item.day_time)
            tradAmSeries.data.push(item.trading_amount)
            tradFeeSeries.data.push(item.trading_fee)
          }

          const options = generateDataEchartsOptions(color, xaxis, seriers)
          this.drawLine(options)
        }).catch(() => {

        }).finally(() => {

        })
      }

      if(this.mainOption === 1) {
        this.$store.dispatch('data/loadHeldData', this.subToken).then((data) => {
          this.heldData = Object.assign(this.heldData, data)
          //updare echarts

          //long short
          const color = ['#00C49A', '#EA446B']
          const xaxis = []

          const longSeries = {stack: 'long', data: []}
          const shortSeries = {stack: 'short', data: []}
          const seriers = [longSeries, shortSeries]

          //{long_position_amount: number, short_position_amount: number, day_time: string}
          data.history.forEach((item) => {
            xaxis.push(item.day_time)
            longSeries.data.push(item.long_position_amount)
            shortSeries.data.push(item.short_position_amount)
          })

          const options = generateDataEchartsOptions(color, xaxis, seriers)
          this.drawLine(options)

        }).catch(() => {

        }).finally(() => {

        })
      }

      if(this.mainOption === 2) {
        this.$store.dispatch('data/loadInsuranceData', this.subToken).then((data) => {
          this.insuranceData = Object.assign(this.insuranceData, data)
          //updare echarts

          //insurance_pool: number, day_time: string
          //insurance_pool
          const color = ['#fae247']
          const xaxis = []

          const insuranceSeriers = {stack: 'insurance pool', data: []}
          const seriers = [insuranceSeriers]

          //{long_position_amount: number, short_position_amount: number, day_time: string}
          data.history.forEach((item) => {
            xaxis.push(item.day_time)
            insuranceSeriers.data.push(item.insurance_pool)
          })

          const options = generateDataEchartsOptions(color, xaxis, seriers)
          this.drawLine(options)
        }).catch(() => {

        }).finally(() => {

        })
      }

      if(this.mainOption === 3) {
        this.$store.dispatch('data/loadTokenInfoData', this.subToken).then((data) => {
          this.tradeData = data
          //updare kcharts
        }).catch(() => {

        }).finally(() => {

        })
      }
    }
  }
}
</script>

<style lang="less">
.derify-dropmenus .van-dropdown-item__content{
 width: auto;
}
.home-top{
  padding: 6.6rem 1.6rem 0 1.6rem;
}
.data-filter-wrap{
  display: flex;
  .derify-dropmenus {
    .van-dropdown-menu__bar{
      padding-bottom: 0;
      margin-top: 0;
      margin-bottom: 0;
      background-color: transparent;
      border-bottom: none;
    }
  }
  .derify-dropmenu-wrap{
    min-width: 13rem;
  }
}
</style>
<style lang="less" scoped>
.page-container{
  padding: 0;
}

.token-info-wrap{
  .div1{
    display: flex;
    justify-content: space-between;
    color: rgba(255,255,255,0.65);
    height: 3rem;
    line-height: 3rem;
  }
  .num{
    color: rgba(255,255,255,0.85);
    font-weight: bold;
  }
  .unit{
    font-size: 1.2rem;
    font-weight: 400;
    padding-left: 0.5rem;
  }
}
.classify-div{
  display: flex;
  margin: 2rem 0;
  .div1{
    flex: 1;
    margin-left: 1rem;
    .ify-span{
      font-size: 1.2rem;
      font-weight: 400;
      color: rgba(255,255,255,0.65);
      .colory ,.colorb,.color-red,.color-green{
        display: inline-block;
        width: .8rem;
        height: .8rem;
        border-radius: 50%;
        background-color: #fae247;
        margin-left: -1rem;
        margin-right: .5rem;
      }
      .colorb{
        background-color: #475FFA;
      }
      .color-red{
        background-color: @red;
      }
      .color-green{
        background-color: @green;
      }
    }
    .ify-div{
      margin-top: .9rem;
      .num{
        font-size: 1.5rem;
        font-weight: 500;
        color: rgba(255,255,255,0.85);
      }
      .unit{
        font-size: 1.2rem;
        font-weight: 400;
        padding-left: 0.5rem;
        color: rgba(255,255,255,0.45);
      }
    }
  }
}
</style>
