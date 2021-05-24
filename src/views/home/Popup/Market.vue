<template>
  <van-popup class="derify-popup" v-model="showPopup" round :closeable="false" @close="close">
    <div class="market-popup system-popup">
      <div class="system-popup-title">市场</div>
      <div class="market-item" @click="changeCoin(coin.key)" :class="curKey === coin.key ? 'active' : ''" v-for="coin in coins" :key="coin.key">
        <div class="market-item-left">{{coin.name}}</div>
        <div class="market-item-right">
          <div>{{parseFloat(coin.num).toFixed(2)}}</div>
          <div :class="coin.percent >= 0 ? 'fc-green' : 'fc-red'">{{coin.percent >= 0 ? '+' : '-'}}{{Math.abs(coin.percent)}}%</div>
        </div>
      </div>
    </div>
  </van-popup>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      showPopup: this.show,
      curKey: 'ETH',
      coins: [
        { key: 'ETH', name: 'ETH / USDT', num: 2930.79, percent: -1.23 },
        { key: 'BTC', name: 'BTC / USDT', num: 2030.23, percent: 1.23 },
        { key: 'BNB', name: 'BNB / USDT', num: 2230.67, percent: 1.23 },
        { key: 'UNI', name: 'UNI / USDT', num: 3930.32, percent: -1.23 }
      ]
    }
  },
  watch: {
    show () {
      this.showPopup = this.show
    }
  },
  methods: {
    close () {
      this.$emit('closeMarketPopup', false)
    },
    changeCoin (key) {
      this.curKey = key
    }
  }
}
</script>

<style lang="less" scoped>
.market-item {
  padding: 1.6rem;
  border: .1rem solid rgba(255, 255, 255, .15);
  border-radius: .9rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  &-left {
    font-size: 1.5rem;
  }
  &-right {
    text-align: right;
    font-size: 1.4rem;
    .fc-green,.fc-red {
      margin-top: .4rem;
    }
  }
  &.active {
    border-color: @orange;
    .market-item-left {
      color: @orange;
    }
  }
}
.market-item + .market-item {
  margin-top: 1.2rem;
}
</style>
