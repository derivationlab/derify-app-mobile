<template>
  <van-popup class="derify-popup" v-model="showPopup" round :closeable="false" @close="close">
    <div class="system-popup">
      <div class="system-popup-title">平仓</div>
      <div class="fz-15" style="margin-top: 1rem">
        <span class="fc-65">点击确定，我们将按</span>
        <span class="fc-yellow">市价</span>
        <span class="fc-65">立即平仓</span>
        <span class="fc-yellow">全部仓位</span>
      </div>
      <div class="system-popup-buttons">
        <div class="system-popup-button cancel" @click="close">取消</div>
        <div class="system-popup-button confirm" @click="submitThenClose">确认</div>
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
      showPopup: this.show
    }
  },
  watch: {
    show () {
      this.showPopup = this.show
    }
  },
  methods: {
    close () {
      this.$emit('closeOneKeyUnwindPopup', false)
    },
    submitThenClose () {
      const size = this.openData.size
      const leverage = this.leverageConfig[this.openData.leverage]
      let price = null
      if (this.openData.entrustType === 0) {
        price = this.curSpotPrice
      } else {
        const a = parseFloat(this.openData.amount)
        price = parseInt(a) * 1e8
      }

      this.$store.dispatch('contract/closeAllPositions').then((r) => {

      });

      this.close();
    }
  }
}
</script>

<style lang="less" scoped>
</style>
