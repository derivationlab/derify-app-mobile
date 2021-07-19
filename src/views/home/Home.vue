<template>
  <div class="home-container page-container">
    <navbar :logo="true" title="首页" />
    <div class="home-top">
      <div class="home-top-left">
        <div class="home-top-coin" @click="changeShowMarket(true)">
          <span class="home-top-coin-name">{{curPair.name}}</span>
          <van-icon color="rgba(255, 255, 255, .85)" name="arrow" size="1.6rem"></van-icon>
        </div>
        <div class="home-top-num">
          {{curSpotPrice | fck(-8)}}
        </div>
        <div class="home-top-percent up">+999.99%</div>
      </div>
      <div class="home-top-right">
        <div class="home-top-icons">
          <img src="@/assets/icons/icon-k.png" alt="" class="home-top-icon" @click="changeRouter('exchange')">
          <img src="@/assets/icons/icon-hu.png" alt="" class="home-top-icon" @click="changeRouter('account')">
        </div>
        <div class="home-top-items">
          <span class="fc-65">动仓费率：</span>
          <span class="fc-red">{{curPositionChangeFeeRatio | fck(-8)}}%</span>
        </div>
        <div class="home-top-items">
          <span class="fc-65">持仓挖矿奖励：</span>
          <span class="fc-green">多</span>
          <span>0.01%</span>
          <span class="fc-65 margin">/</span>
          <span class="fc-red">空</span>
          <span>0.12%</span>
        </div>
      </div>
    </div>
    <template v-if="$route.name === 'home'">
    <div class="home-mid">
      <div class="home-mid-one">
        <van-dropdown-menu :overlay="false" class="derify-dropmenu">
          <van-dropdown-item v-model="entrustType" :options="entrustTypeConfig" @input="updateTraderOpenUpperBound">
              <div class="derify-dropmenu-title" slot="title">
                <span>{{entrustTypeConfig[entrustType].text}}</span>
                <van-icon name="arrow-down" size="1.8rem" color="rgba(255, 255, 255, .85)" />
              </div>
          </van-dropdown-item>
        </van-dropdown-menu>
        <van-dropdown-menu :overlay="false" class="derify-dropmenu">
          <van-dropdown-item v-model="leverage" :options="leverageConfig" @input="updateTraderOpenUpperBound">
              <div class="derify-dropmenu-title" slot="title">
                <span>{{leverageConfig[leverage].text}}</span>
                <van-icon name="arrow-down" size="1.8rem" color="rgba(255, 255, 255, .85)" />
              </div>
          </van-dropdown-item>
        </van-dropdown-menu>
      </div>
      <div class="home-mid-two">
        <div class="fc-65 fz-12">开仓价</div>
        <div class="home-mid-input" v-if="entrustType === 0">
          <van-field class="derify-input" type="text" input-align="center" disabled value="以市价成交" />
        </div>
        <div class="home-mid-input" v-else>
          <van-field class="derify-input" type="number" v-model.number="amount" @input="updateTraderOpenUpperBound"/>
          <div class="fc-30">USDT</div>
        </div>
      </div>
      <div class="home-mid-two">
        <div class="home-mid-two-title">
          <div class="fc-65 fz-12">开仓量</div>
          <div class="fz-12">
            <span class="fc-65">可开：{{unit === 0 ? curTraderOpenUpperBound.size
                : unit === 1 ? curTraderOpenUpperBound.amount : 100}} {{unitConfig[unit].text}}</span>
            <span class="fc-yellow" @click="transfer">划转</span>
          </div>
        </div>
        <div class="home-mid-input">
          <van-field class="derify-input" type="number" v-model.number="size" />
          <van-dropdown-menu :overlay="false" class="derify-dropmenu no-border">
            <van-dropdown-item v-model="unit" :options="unitConfig"  @change="unitSelectChange">
                <div class="derify-dropmenu-title" slot="title">
                  <span>{{unitConfig[unit].text}}</span>
                  <van-icon name="arrow-down" size="1.8rem" color="rgba(255, 255, 255, .85)" />
                </div>
            </van-dropdown-item>
          </van-dropdown-menu>
        </div>
      </div>
      <div class="home-mid-three">
        <van-slider bar-height=".4rem" button-size="1.8rem" v-model="value5" @input="calculatePositionSize"/>
      </div>
      <div class="home-mid-four">
        <div class="home-mid-four-btn green-gra" @click="changeShowOpen(true, 0)">看涨 开多</div>
        <div class="home-mid-four-btn red-gra" @click="changeShowOpen(true, 1)">看跌 开空</div>
        <div class="home-mid-four-btn yellow-gra" @click="changeShowOpen(true, 2)">双向对冲</div>
      </div>
    </div>
    </template>
    <div id="myChart" :style="{width: '100%', height: '36.5rem', display: $route.name === 'home' ? 'none':'block'}"></div>
    <div class="home-last">
      <van-tabs v-model="active" @click="tabChange">
        <van-tab v-for="(value, key) in tabs" :key="key" :name="key" :title="value">
          <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="loadMore"
          >
            <div class="exchange-block" v-for="(data,i) in datalist" :key="i">
              <div class="exchange-block-title">
                <div class="left">

                  <div v-if="data.side === 0" class="mr-4 text-icon-red">多</div>
                  <div v-if="data.side === 1" class="mr-4 text-icon-green">空</div>
                  <div class="fz-16 mr-4">ETH/USDT</div>
                  <div class="number-icon-green mr-4">{{data.leverage | fck(-8, 0)}}x</div>
                  <img @click="changeShowHint(true, active)" class="left-help-icon" src="@/assets/icons/icon-help.png" alt="">
                </div>
                <div class="right" v-if="active === 'key1'" @click="changeShowUnwind(true, data)">
                  <div class="fz-12">平仓</div>
                  <van-icon size="1.2rem" color="rgba(255, 255, 255, .85)" name="arrow"></van-icon>
                </div>
                <div class="right" v-if="active === 'key2'" @click="cancleOrderedPosition(data)">
                  <div class="fz-12">取消委托</div>
                  <van-icon size="1.2rem" color="rgba(255, 255, 255, .85)" name="arrow"></van-icon>
                </div>
                <div class="right" v-if="active === 'key3'">
                  <div class="fz-12 fc-45">2021-01-20 19:39:29</div>
                </div>
              </div>
              <template v-if="active === 'key1'">
                <div class="exchange-item">
                  <div class="exchange-item-left">
                    <div class="fc-45">浮动盈亏：</div>
                    <div :class="i % 2 === 0 ? 'fc-green' : 'fc-red'">{{data.unrealizedPnl | fck(-8)}}</div>
                    <div>USDT</div>
                  </div>
                  <div class="exchange-item-right">
                    <div class="fc-45">持仓量：</div>
                    <div>{{data.size}} ETH</div>
                  </div>
                </div>
                <div class="exchange-item">
                  <div class="exchange-item-left">
                    <div class="fc-45">当前价格：</div>
                    <div>{{data.spotPrice | fck(-8)}} USDT</div>
                  </div>
                  <div class="exchange-item-right">
                    <div class="fc-45">开仓均价：</div>
                    <div>{{data.averagePrice | fck(-8)}} ETH</div>
                  </div>
                </div>
                <div class="exchange-item">
                  <div class="exchange-item-left">
                    <div class="fc-45">止损设置：</div>
                    <div>
                      <template v-if="data.stopLossPrice > 0">{{data.stopLossPrice | fck(-8)}}</template>
                      <template v-else>-</template></div>
                  </div>
                  <div class="exchange-item-right">
                    <div class="fc-45">止盈设置：</div>
                    <div><template v-if="data.stopProfitPrice > 0">{{data.stopProfitPrice | fck(-8)}}</template>
                      <template v-else>-</template></div>
                  </div>
                </div>
                <div class="exchange-item">
                  <div class="exchange-item-left">
                    <div class="fc-45">持仓保证金：</div>
                    <div>{{data.margin | fck(-8)}} USDT</div>
                  </div>
                  <div class="exchange-item-right">
                    <div class="fc-45">保证金率：</div>
                    <div>{{data.marginRate | fck(-8)}}%</div>
                  </div>
                </div>
                <div class="exchange-item">
                  <div class="exchange-item-left">
                    <div class="fc-45">强平金额：</div>
                    <div>{{data.liquidatePrice | fck(-8)}} USDT</div>
                  </div>
                  <div class="exchange-item-right" @click="changeShowSet(true, data)">
                    <div>设置止盈/止损</div>
                    <van-icon size="1.2rem" color="rgba(255, 255, 255, .85)" name="arrow"></van-icon>
                  </div>
                </div>
              </template>
              <template v-if="active ==='key2'">
                <div class="exchange-item">
                  <div class="exchange-item-left">
                    <div class="fc-45">委托价格：</div>
                    <div>{{data.price | fck(-8)}} USDT</div>
                  </div>
                  <div class="exchange-item-right">
                    <div class="fc-45">委托类型：</div>
                    <div :class="i % 2 === 0 ? 'fc-green' : 'fc-red'">限价委托</div>
                  </div>
                </div>
                <div class="exchange-item">
                  <div class="exchange-item-left">
                    <div class="fc-45">委托数量：</div>
                    <div>{{data.size}} ETH</div>
                  </div>
                  <div class="exchange-item-right">
                    <div class="fc-45">委托时间：</div>
                    <div>{{data.timestamp}}</div>
                  </div>
                </div>
                <div class="exchange-item">
                  <div class="exchange-item-left">
                    <div class="fc-45">止损设置：</div>
                    <div>
                      <template v-if="data.stopLossPrice > 0">{{data.stopLossPrice | fck(-8)}}</template>
                      <template v-else>-</template>
                    </div>
                  </div>
                  <div class="exchange-item-right">
                    <div class="fc-45">止盈设置：</div>
                    <div>
                      <div>
                        <template v-if="data.stopProfitPrice > 0">{{data.stopProfitPrice | fck(-8)}}</template>
                        <template v-else>-</template>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
              <template v-if="active ==='key3'">
                <div class="exchange-item">
                  <div class="exchange-item-left">
                    <div class="fc-45">盈亏：</div>
                    <div>{{data.realizedPnl}}</div>
                  </div>
                  <div class="exchange-item-right">
                    <div class="fc-45">委托类型：</div>
                    <div :class="i % 2 === 0 ? 'fc-green' : 'fc-red'">
                      {{data.tradeType}}
                    </div>
                  </div>
                </div>
                <div class="exchange-item">
                  <div class="exchange-item-left">
                    <div class="fc-45">成交价格：</div>
                    <div>{{data.price}} USDT</div>
                  </div>
                  <div class="exchange-item-right">
                    <div class="fc-45">成交数量：</div>
                    <div>{{data.size}} ETH</div>
                  </div>
                </div>
                <div class="exchange-item">
                  <div class="exchange-item-left">
                    <div class="fc-45">成交金额：</div>
                    <div>{{data.amount}} USDT</div>
                  </div>
                  <div class="exchange-item-right">
                    <div class="fc-45">手续费：</div>
                    <div>{{data.tradingFee}} USDT</div>
                  </div>
                </div>
                <div class="exchange-item">
                  <div class="exchange-item-left">
                    <div class="fc-45">动仓费：</div>
                    <div>{{data.positionChangeFee}} USDT</div>
                  </div>
                  <div class="exchange-item-right">
                    <div class="fc-45">分摊补偿：</div>
                    <div>{{data.shareCompensation}} bDRf</div>
                  </div>
                </div>
              </template>
            </div>
          </van-list>
        </van-tab>
      </van-tabs>
    </div>
    <market :show="showMarket" @closeMarketPopup="changeShowMarket" />
    <hint :show="showHint" :type="hintType" @closeHintPopup="changeShowHint" />
    <set-popup :extraData="setExtraData" :show="showSet" @closeSetPopup="changeShowSet" />
    <unwind :extraData="unwindExtraData" :show="showUwind" @closeUnwindPopup="changeShowUnwind" />
    <one-key-unwind :show="showOneKeyUnwind" @closeOneKeyUnwindPopup="changeShowOneKeyUnwind" />
    <open :extraData="openExtraData" :show="showOpen" :type="openType" @closeOpenPopup="changeShowOpen" />
    <open-status :show="showOpenStatus" :type="openStatus" @closeOpenStatusPopup="changeShowOpenStatus" />
  </div>
</template>

<script>
import Navbar from '@/components/Navbar'
import Market from './Popup/Market'
import Hint from './Popup/Hint'
import SetPopup from './Popup/Set'
import Unwind from './Popup/Unwind'
import OneKeyUnwind from './Popup/OneKeyUnwind'
import Open from './Popup/Open'
import OpenStatus from './Popup/OpenStatus'
import options from '@/utils/kExample'

const context = {
  myChart: null
};
export default {
  name: 'Home',
  components: {
    Navbar,
    Market,
    Hint,
    SetPopup,
    Unwind,
    OneKeyUnwind,
    Open,
    OpenStatus
  },
  props:{
    contractData: {
      type: Object,
      default: null
    }
  },
  computed: {
    curPair () {
      const {curPairKey, pairs} = this.$store.state.contract
      return pairs.find(pair => pair.key === curPairKey)
    },
    curSpotPrice () {
      return this.$store.state.contract.contractData.curSpotPrice
    },
    curPositionChangeFeeRatio () {
      return this.$store.state.contract.contractData.positionChangeFeeRatio
    }
  },
  data () {
    return {
      entrustType: 0,
      leverage: 0,
      amount: 0,
      size: 0,
      value5: 20,
      unit: 0,
      curTraderOpenUpperBound: {size: 0, amount: 0},
      entrustTypeConfig: [
        {text: '市价委托', value: 0},
        {text: '限价委托', value: 1}
      ],
      leverageConfig: [
        {text: '10x', value: 0},
        {text: '5x', value: 1},
        {text: '3x', value: 2}
      ],
      unitConfig: [
        {text: 'USDT', value: 0},
        {text: 'ETH', value: 1},
        {text: '%', value: 2}
      ],
      active: 'key1',
      tabs: {
        key1: '我的持仓',
        key2: '当前委托',
        key3: '成交记录'
      },
      datalist: [1, 2, 3, 4],
      loading: false,
      finished: false,
      showMarket: false, // 市场弹窗，选择币种
      showHint: false, // 概念提示弹窗
      hintType: 'key1', // 概念提示的种类
      showSet: false, // 止盈止损弹窗
      showUwind: false, // 平仓弹窗
      showOneKeyUnwind: false, // 一键平仓弹窗
      showOpen: false, // 开仓确认弹窗
      openType: null, // 开仓类型
      showOpenStatus: false, // 开仓状态弹窗
      openStatus: 'fail', // 开仓状态
      openExtraData: {size: 0},
      positionChangeFeeRatio: 0, //动仓费率
      setExtraData: null,
      unwindExtraData: {size: 0}
    }
  },
  methods: {
    ClickBox () {
      this.show = true
    },
    loadMore () {
    },
    changeShowMarket (bool) {
      this.showMarket = bool
    },
    changeShowHint (bool, type) {
      this.hintType = type
      this.showHint = bool
    },
    changeShowSet (bool, position) {
      this.showSet = bool

      if(!bool){
        return
      }

      this.setExtraData = {...position};

    },
    changeShowUnwind (bool, position) {
      this.showUwind = bool

      if(!bool){
        return
      }
      this.unwindExtraData = {...position}

    },
    changeShowOneKeyUnwind (bool) {
      this.showOneKeyUnwind = bool
    },
    changeShowOpen (bool, type) {
      if (bool) {
        const {entrustType, leverage, amount, size, unit} = this
        if (entrustType === 1 && !amount) {
          this.$toast('please input amount first')
          return
        }
        if (!size) {
          this.$toast('please input size first')
          return
        }

        if(type === 0 || type === 1){
          if(unit === 0){
            if (size > this.curTraderOpenUpperBound.size) {
              this.$toast('输入的开仓量超出上限')
              return
            }
          }else if(unit === 1){
            if (size > this.curTraderOpenUpperBound.amount) {
              this.$toast('输入的开仓量超出上限')
              return
            }
          }
        }

        this.openExtraData = {
          entrustType,
          leverage,
          amount: amount,
          size: size,
          side: type,
          unit,
          positionChangeFee: this.positionChangeFeeRatio * amount * size
        }
      }
      this.openType = type
      this.showOpen = bool
    },
    changeShowOpenStatus (bool, status) {
      this.openStatus = status
      this.showOpenStatus = bool
    },
    transfer () {
      this.$router.push({path: '/account'})
    },
    changeRouter (name) {
      if (this.$route.name === name) {
        return
      }
      this.$router.push({name})
    },
    drawKline () {
      console.log(context.myChart)
      if(context.myChart){
        context.myChart.dispose();
      }
      context.myChart = this.$echarts.init(document.getElementById('myChart'))

      context.myChart.setOption(options)
      context.myChart.resize()
    },
    tabChange (key) {
      console.log(`tabChange ${key}`)
      const self = this;

      if(key === 'key1'){
        const dataList = this.datalist

        dataList.splice(0)
        self.loading = true
        this.$store.dispatch('contract/loadPositionData').then(r => {
          // Array<Position>
          if (r === undefined) {
            return
          }

          r.forEach((item) => {
            if (item !== undefined || !isNaN(item)) {
              dataList.push(item)
            }
          })

          self.loading = false
        })
      }

      if(key === 'key2'){
        const dataList = this.datalist;

        dataList.splice(0)
        self.loading = true
        this.$store.dispatch('contract/loadOrderedPositionData', {}).then(r => {
          // Array<Position>
          if (r === undefined) {
            return
          }

          r.forEach((item) => {
            if (item !== undefined || !isNaN(item)) {
              dataList.push(item)
            }
          })

          self.loading = false
        })
      }

      if(key === 'key3'){
        const dataList = this.datalist;

        dataList.splice(0)
        self.loading = true
        this.$store.dispatch('contract/loadTradeRecords').then(r => {
          //@see TradeRecord
          if (r === undefined) {
            return
          }

          r.forEach((item) => {
            if (item !== undefined || !isNaN(item)) {
              dataList.push(item)
            }
          })

          self.loading = false
        })
      }
    },
    cancleOrderedPosition (data) {
      const timestamp = new Date().getTime();
      //执行取消委托
      this.$store.dispatch('contract/cancleOrderedPosition',
          {
            coinAddress: data.coinAddress,
            orderType: data.orderType,
            side: data.side,
            timestamp}).then(r => {
      })
    },
    calculatePositionSize (sliderValue) {
      const {unit} = this// 0 ETH，1 USDT 2 %
      if (unit ===  0) {
        this.size = Math.round(sliderValue /100 * this.curTraderOpenUpperBound.amount)
      }else if (unit === 1) {
        this.size = Math.round(sliderValue /100 * this.curTraderOpenUpperBound.amount)
      }else{
        this.size = sliderValue
      }

    },
    unitSelectChange (unit) {
      console.log('unitSelectChange')
      this.unit = unit;
      this.calculatePositionSize(this.value5)
    },
    updateTraderOpenUpperBound () {
      //杠杆数发生变化, 重新计算仓量

      const openType = this.entrustType
      const price = this.amount  * 1e8
      const leverage = this.leverage  * 1e8

      this.$store.dispatch("contract/getTraderOpenUpperBound",
        {openType, price, leverage})
        .then(r => {
          console.log('getTraderOpenUpperBound', r)
        this.curTraderOpenUpperBound = r;
      });
    }
  },
  watch: {
    contractData:{
      handler (val) {
        this.contractData = val;
      },
      deep: true
    }
  },
  beforeMount () {
    const self = this
    this.$store.dispatch('contract/loadHomeData', this.entrustType).then(r => {
      self.positionChangeFeeRatio = r.positionChangeFeeRatio;
      console.log('loadHomeData', self.positionChangeFeeRatio)
      this.size = Math.round(this.value5 /100 * this.curTraderOpenUpperBound);
    })

    // this.$store.dispatch('contract/getMarketAccount').then(r => {
    //   // TODO: render records in page
    //   console.log('market======', r)
    // })

    const dataList = this.datalist

    dataList.splice(0)
    self.loading = true
    this.$store.dispatch('contract/loadPositionData').then(r => {
      // Array<Position>
      if (!(r instanceof Array)) {
        return
      }

      r.forEach((item) => {
        if (item !== undefined || !isNaN(item)) {
          dataList.push(item)
        }
      })

      self.loading = false
    })

    this.updateTraderOpenUpperBound()
  },
  updated () {
    this.$nextTick(() => this.drawKline())
  }
}
</script>

<style lang="less" scoped>
.home-top {
  padding: 2rem 0.4rem;
  display: flex;
  justify-content: space-between;
  &-left, &-right {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
  }
  &-right {
    align-items: flex-end;
  }
  &-coin {
    display: flex;
    align-items: center;
    &-name {
      margin-right: 0.4rem;
    }
  }
  &-num {
    color: @green;
    font-weight: bold;
    font-size: 3rem;
    &-small {
      font-size: 2rem;
    }
  }
  &-percent {
    font-size: 1rem;
    height: 1.5rem;
    padding: 0 0.3rem;
    line-height: 1.5rem;
    border-radius: 1.5rem;
    color: #000;
      &.up {
      background: @green;
    }
    &.down {
      background: @red;
    }
  }
  &-icons {
    margin-top: 2.5rem;
    .home-top-icon {
      width: 1.6rem;
      height: 1.6rem;
      + .home-top-icon {
        margin-left: .6rem;
      }
    }
  }
  &-items {
    margin-top: .8rem;
    .fc-green,.fc-red {
      margin-right: .4rem;
      &:last-child {
        margin-right: 0;
      }
    }
    .fc-65.margin {
      margin: 0 .4rem;
    }
  }
  .home-top-items + .home-top-items {
    margin-top: .4rem;
  }
}
.home-mid {
  background: #272354;
  border-radius: 1.6rem;
  padding: 2.5rem 1.6rem;
  &-one {
    display: flex;
    justify-content: space-between;
    .derify-dropmenu:first-child {
      flex: .7;
      margin-right: .8rem;
    }
    .derify-dropmenu:last-child {
      flex: .3
    }
  }
  &-two {
    margin-top: 2rem;
    &-title {
      display: flex;
      justify-content: space-between;
      .fc-yellow {
        margin-left: .4rem;
      }
    }
  }
  &-three {
    margin-top: 2.0rem;
  }
  &-input {
    width: 100%;
    height: 44px;
    border: 1px solid rgba(255,255,255,0.15);
    border-radius: 22px;
    margin-top: .4rem;
    position: relative;
    .fc-30 {
      position: absolute;
      font-size: 1.5rem;
      top: 1rem;
      right: 1.6rem;
    }
    .derify-dropmenu {
      position: absolute;
      top: 0;
      right: 0;
    }
  }
  &-four {
    margin-top: 3rem;
    &-btn {
      width: 100%;
      height: 4.8rem;
      border-radius: 2.4rem;
      line-height: 4.8rem;
      text-align: center;
      font-size: 1.8rem;
      &.yellow-gra {
        color: #140B32;
      }
    }
    &-btn + &-btn {
      margin-top: 1.8rem;
    }
  }
}
.home-last {
  margin-top: 4rem;
}
.exchange-block {
  margin-top: 3rem;
  &-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .mr-4 {
      margin-right: .4rem;
    }
    .left, .right {
      display: flex;
      align-items: center;
      &-help-icon {
        width: 1.6rem;
        height: 1.6rem;
      }
    }
  }
  .exchange-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1.2rem;
    font-size: 1.2rem;
    + .exchange-item {
      margin-top: .8rem;
    }
    &-left,&-right {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      .fc-green,.fc-red {
        margin-right: .4rem;
        &:last-child {
          margin-right: 0;
        }
      }
    }
    &-right {
      justify-content: flex-end;
    }
  }
}
</style>
