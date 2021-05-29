<template>
  <div class="home-container page-container">
    <navbar :logo="true" title="首页" />
    <div class="home-top">
      <div class="home-top-left">
        <div class="home-top-coin">
          <span class="home-top-coin-name">ETH/USDT</span>
          <van-icon color="#FFF" name="arrow" size="1.6rem"></van-icon>
        </div>
        <div class="home-top-num">
          <span>1234</span><span class="home-top-num-small">.50</span>
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
          <span class="fc-85">0.01%</span>
          <span class="fc-65 margin">/</span>
          <span class="fc-red">空</span>
          <span class="fc-85">0.12%</span>
        </div>
      </div>
    </div>
    <div class="home-mid">
      <div class="home-mid-1">
        <van-dropdown-menu class="derify-dropmenu">
          <van-dropdown-item v-model="value1" :options="option1">
              <div class="derify-dropmenu-title" slot="title">
                <span>{{option1[value1].text}}</span>
                <van-icon name="arrow-down" size="1.8rem" color="rgba(255, 255, 255, .85)" />
              </div>
          </van-dropdown-item>
        </van-dropdown-menu>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar'

export default {
  name: 'Home',
  components: {
    Navbar
  },
  data () {
    return {
      show: false,
      value1: 0,
      value2: 'a',
      option1: [
        { text: '全部商品', value: 0 },
        { text: '新款商品', value: 1 },
        { text: '活动商品', value: 2 }
      ],
      option2: [
        { text: '默认排序', value: 'a' },
        { text: '好评排序', value: 'b' },
        { text: '销量排序', value: 'c' }
      ]
    }
  },
  methods: {
    ClickBox () {
      this.show = true
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
</style>
