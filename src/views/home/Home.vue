<template>
  <div class="home-container page-container">
    <navbar :logo="true" title="首页" />
    <div class="home-top">
      <div class="home-top-left">
        <div class="home-top-coin" @click="changeShowMarket(true)">
          <span class="home-top-coin-name">ETH / USDT</span>
          <van-icon color="rgba(255, 255, 255, .85)" name="arrow" size="1.6rem"></van-icon>
        </div>
        <!-- 注释 -->
        <div class="home-top-num">
          <span>134</span><span class="home-top-num-small">.50</span>
        </div>
        <div class="home-top-percent up">+999.99%</div>
      </div>
      <div class="home-top-right">
        <div class="home-top-icons">
          <img src="@/assets/icons/icon-k.png" alt="" class="home-top-icon">
          <img src="@/assets/icons/icon-hu.png" alt="" class="home-top-icon">
        </div>
        <div class="home-top-items">
          <span class="fc-65">动仓费率：</span>
          <span class="fc-red">-0.1234%</span>
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
    <div class="home-mid">
      <div class="home-mid-one">
        <van-dropdown-menu :overlay="false" class="derify-dropmenu">
          <van-dropdown-item v-model="value1" :options="option1">
              <div class="derify-dropmenu-title" slot="title">
                <span>{{option1[value1].text}}</span>
                <van-icon name="arrow-down" size="1.8rem" color="rgba(255, 255, 255, .85)" />
              </div>
          </van-dropdown-item>
        </van-dropdown-menu>
        <van-dropdown-menu :overlay="false" class="derify-dropmenu">
          <van-dropdown-item v-model="value2" :options="option2">
              <div class="derify-dropmenu-title" slot="title">
                <span>{{option2[value2].text}}</span>
                <van-icon name="arrow-down" size="1.8rem" color="rgba(255, 255, 255, .85)" />
              </div>
          </van-dropdown-item>
        </van-dropdown-menu>
      </div>
      <div class="home-mid-two">
        <div class="fc-65 fz-12">开仓价</div>
        <div class="home-mid-input">
          <van-field class="derify-input" type="text" input-align="center" disabled v-model="value3" />
          <div class="fc-30">USDT</div>
        </div>
      </div>
      <div class="home-mid-two">
        <div class="home-mid-two-title">
          <div class="fc-65 fz-12">开仓量</div>
          <div class="fz-12">
            <span class="fc-65">可开：2.00000000 ETH</span>
            <span class="fc-yellow">划转</span>
          </div>
        </div>
        <div class="home-mid-input">
          <van-field class="derify-input" type="number" v-model="value4" />
          <van-dropdown-menu :overlay="false" class="derify-dropmenu no-border">
            <van-dropdown-item v-model="value6" :options="option3">
                <div class="derify-dropmenu-title" slot="title">
                  <span>{{option3[value6].text}}</span>
                  <van-icon name="arrow-down" size="1.8rem" color="rgba(255, 255, 255, .85)" />
                </div>
            </van-dropdown-item>
          </van-dropdown-menu>
        </div>
      </div>
      <div class="home-mid-three">
        <van-slider bar-height=".4rem" button-size="1.8rem" v-model="value5" />
      </div>
      <div class="home-mid-four">
        <div class="home-mid-four-btn green-gra" @click="changeShowOpen(true, 'green')">看涨 看多</div>
        <div class="home-mid-four-btn red-gra" @click="changeShowOpen(true, 'red')">看跌 开空</div>
        <div class="home-mid-four-btn yellow-gra" @click="changeShowOpen(true, 'yellow')">双向对冲</div>
      </div>
    </div>
    <div class="home-last">
      <van-tabs v-model="active">
        <van-tab v-for="(value, key) in tabs" :key="key" :name="key" :title="value">
          <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="loadMore"
          >
            <div class="exchange-block" v-for="i in datalist" :key="i">
              <div class="exchange-block-title">
                <div class="left">
                  <div class="mr-4" :class="i % 2 === 0 ? 'text-icon-green' : 'text-icon-red'">多</div>
                  <div class="fz-16 mr-4">ETH/USDT</div>
                  <div class="number-icon-green mr-4">5x</div>
                  <img @click="changeShowHint(true, active)" class="left-help-icon" src="@/assets/icons/icon-help.png" alt="">
                </div>
                <div class="right" v-if="active === 'key1'" @click="changeShowUnwind(true)">
                  <div class="fz-12">平仓</div>
                  <van-icon size="1.2rem" color="rgba(255, 255, 255, .85)" name="arrow"></van-icon>
                </div>
                <div class="right" v-if="active === 'key2'">
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
                    <div :class="i % 2 === 0 ? 'fc-green' : 'fc-red'">+34.56</div>
                    <div>USDT</div>
                  </div>
                  <div class="exchange-item-right">
                    <div class="fc-45">持仓量：</div>
                    <div>1.2321332 ETH</div>
                  </div>
                </div>
                <div class="exchange-item">
                  <div class="exchange-item-left">
                    <div class="fc-45">当前价格：</div>
                    <div>1245.67 USDT</div>
                  </div>
                  <div class="exchange-item-right">
                    <div class="fc-45">开仓均价：</div>
                    <div>1.2321332 ETH</div>
                  </div>
                </div>
                <div class="exchange-item">
                  <div class="exchange-item-left">
                    <div class="fc-45">止损设置：</div>
                    <div>-</div>
                  </div>
                  <div class="exchange-item-right">
                    <div class="fc-45">止盈设置：</div>
                    <div>-</div>
                  </div>
                </div>
                <div class="exchange-item">
                  <div class="exchange-item-left">
                    <div class="fc-45">持仓保证金：</div>
                    <div>1234.5 USDT</div>
                  </div>
                  <div class="exchange-item-right">
                    <div class="fc-45">保证金率：</div>
                    <div>123%</div>
                  </div>
                </div>
                <div class="exchange-item">
                  <div class="exchange-item-left">
                    <div class="fc-45">强平金额：</div>
                    <div>12323.44 USDT</div>
                  </div>
                  <div class="exchange-item-right" @click="changeShowSet(true)">
                    <div>设置止盈/止损</div>
                    <van-icon size="1.2rem" color="rgba(255, 255, 255, .85)" name="arrow"></van-icon>
                  </div>
                </div>
              </template>
              <template v-if="active ==='key2'">
                <div class="exchange-item">
                  <div class="exchange-item-left">
                    <div class="fc-45">委托价格：</div>
                    <div>1234.59 USDT</div>
                  </div>
                  <div class="exchange-item-right">
                    <div class="fc-45">委托类型：</div>
                    <div :class="i % 2 === 0 ? 'fc-green' : 'fc-red'">开仓 / 限价委托</div>
                  </div>
                </div>
                <div class="exchange-item">
                  <div class="exchange-item-left">
                    <div class="fc-45">委托数量：</div>
                    <div>1234.59 ETH</div>
                  </div>
                  <div class="exchange-item-right">
                    <div class="fc-45">委托时间：</div>
                    <div>2021-03-20 10:00:50</div>
                  </div>
                </div>
                <div class="exchange-item">
                  <div class="exchange-item-left">
                    <div class="fc-45">止损设置：</div>
                    <div>-</div>
                  </div>
                  <div class="exchange-item-right">
                    <div class="fc-45">止盈设置：</div>
                    <div>-</div>
                  </div>
                </div>
              </template>
              <template v-if="active ==='key3'">
                <div class="exchange-item">
                  <div class="exchange-item-left">
                    <div class="fc-45">盈亏：</div>
                    <div>-</div>
                  </div>
                  <div class="exchange-item-right">
                    <div class="fc-45">委托类型：</div>
                    <div :class="i % 2 === 0 ? 'fc-green' : 'fc-red'">平仓 / 限价委托</div>
                  </div>
                </div>
                <div class="exchange-item">
                  <div class="exchange-item-left">
                    <div class="fc-45">成交价格：</div>
                    <div>1234.59 USDT</div>
                  </div>
                  <div class="exchange-item-right">
                    <div class="fc-45">成交数量：</div>
                    <div>1342.95 ETH</div>
                  </div>
                </div>
                <div class="exchange-item">
                  <div class="exchange-item-left">
                    <div class="fc-45">成交金额：</div>
                    <div>1234.52 USDT</div>
                  </div>
                  <div class="exchange-item-right">
                    <div class="fc-45">手续费：</div>
                    <div>2312.2 USDT</div>
                  </div>
                </div>
                <div class="exchange-item">
                  <div class="exchange-item-left">
                    <div class="fc-45">动仓费：</div>
                    <div>1234.52 USDT</div>
                  </div>
                  <div class="exchange-item-right">
                    <div class="fc-45">分辨补偿：</div>
                    <div>23.42 bDRf</div>
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
    <set-popup :show="showSet" @closeSetPopup="changeShowSet" />
    <unwind :show="showUwind" @closeUnwindPopup="changeShowUnwind" />
    <one-key-unwind :show="showOneKeyUnwind" @closeOneKeyUnwindPopup="changeShowOneKeyUnwind" />
    <open :show="showOpen" :type="openType" @closeOpenPopup="changeShowOpen" />
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
  data () {
    return {
      value1: 0,
      value2: 0,
      value3: '以市价成交',
      value4: 99213120.12,
      value5: 20,
      value6: 0,
      option1: [
        { text: '市价委托', value: 0 },
        { text: '限价委托', value: 1 }
      ],
      option2: [
        { text: '10x', value: 0 },
        { text: '5x', value: 1 },
        { text: '3x', value: 2 }
      ],
      option3: [
        { text: 'USDT', value: 0 },
        { text: 'ETH', value: 1 },
        { text: '%', value: 2 }
      ],
      active: 'key1',
      tabs: {
        key1: '我的持仓',
        key2: '当前委托',
        key3: '成交记录'
      },
      datalist: [1, 2, 4, 5, 6, 7, 8, 9, 10],
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
      openStatus: 'fail' // 开仓状态
    }
  },
  methods: {
    ClickBox () {
      this.show = true
    },
    loadMore () {
      setTimeout(() => {
        const lastCount = this.datalist[this.datalist.length - 1]
        for (let i = 0; i < 10; i++) {
          this.datalist.push(lastCount + i + 1)
        }
        console.log(this.datalist)
        this.loading = false
        if (this.datalist.length >= 40) {
          this.finished = true
        }
      }, 1000)
    },
    changeShowMarket (bool) {
      this.showMarket = bool
    },
    changeShowHint (bool, type) {
      this.hintType = type
      this.showHint = bool
    },
    changeShowSet (bool) {
      this.showSet = bool
    },
    changeShowUnwind (bool) {
      this.showUwind = bool
    },
    changeShowOneKeyUnwind (bool) {
      this.showOneKeyUnwind = bool
    },
    changeShowOpen (bool, type) {
      this.openType = type
      this.showOpen = bool
    },
    changeShowOpenStatus (bool, status) {
      this.openStatus = status
      this.showOpenStatus = bool
    }
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
