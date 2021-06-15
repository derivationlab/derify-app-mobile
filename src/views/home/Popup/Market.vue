<template>
  <van-popup class="derify-popup" v-model="showPopup" round :closeable="false" @close="close">
    <div class="market-popup system-popup">
      <div class="system-popup-title">市场</div>
      <div class="market-item"
           @click="changePair(pair)"
           :class="pair.enable ? curKey === pair.key ? 'active' : '' : 'disabled'"
           v-for="pair in pairs" :key="pair.key">
        <div class="market-item-left">{{pair.name}}</div>
        <div class="market-item-right">
          <div>{{parseFloat(pair.num).toFixed(2)}}</div>
          <div :class="pair.percent >= 0 ? 'fc-green' : 'fc-red'">{{pair.percent >= 0 ? '+' : '-'}}{{Math.abs(pair.percent)}}%</div>
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
      pairs: [
        { key: 'ETH', name: 'ETH / USDT', num: 2930.79, percent: -1.23, enable: true },
        { key: 'BTC', name: 'BTC / USDT', num: 2030.23, percent: 1.23, enable: true },
        { key: 'BNB', name: 'BNB / USDT', num: 0, percent: 0, enable: false },
        { key: 'UNI', name: 'UNI / USDT', num: 0, percent: 0, enable: false }
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
    changePair (pair) {
      if (!pair.enable) {
        this.$toast(`${pair.name} does not support`)
        return false
      }
      this.curKey = pair.key
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
  &.disabled {
    opacity: .2;
  }
}
.market-item + .market-item {
  margin-top: 1.2rem;
}
</style>
