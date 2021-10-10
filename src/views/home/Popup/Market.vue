<template>
  <van-popup class="derify-popup" v-model="showPopup" round :closeable="false" @close="close">
    <div class="market-popup system-popup">
      <div class="system-popup-title">{{$t('Trade.OpenPosition.Market.Market')}}</div>
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
  computed: {
    pairs () {
      return this.$store.state.contract.pairs
    },
    curKey () {
      return this.$store.state.contract.curPairKey
    }
  },
  data () {
    return {
      showPopup: this.show
    }
  },
  watch: {
    show () {
      this.showPopup = this.show
      if(this.showPopup){
        this.$store.dispatch('contract/updateAllPairPrice',{})
      }
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

      this.$store.commit('contract/SET_CURPAIRKEY', pair.key)

      this.close()
    }
  },
  mounted () {

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
