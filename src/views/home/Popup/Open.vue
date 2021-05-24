<template>
  <van-popup class="derify-popup" v-model="showPopup" round :closeable="false" @close="close">
    <div class="system-popup">
      <div class="system-popup-title">开仓确认</div>
      <div class="system-popup-price">
        <div class="fc-45">委托价格</div>
        <div>
          <span class="fc-85">2903.22</span>
          <span class="fc-45">USDT</span>
        </div>
      </div>
      <div class="system-popup-price">
        <div class="fc-45">开仓类型</div>
        <div v-if="openType === 'red'">
          <span class="fc-red">开空</span>
          <span class="fc-red">5x</span>
        </div>
        <div v-if="openType === 'green'">
          <span class="fc-green">开多</span>
          <span class="fc-green">5x</span>
        </div>
        <div v-if="openType === 'yellow'">
          <span class="fc-yellow">双向对冲</span>
          <span class="fc-yellow">5x</span>
        </div>
      </div>
      <div class="system-popup-price">
        <div class="fc-45">开仓量</div>
        <div>
          <span class="fc-85">1.23</span>
          <span class="fc-45">ETH</span>
        </div>
      </div>
      <div class="system-popup-price">
        <div class="fc-45">动仓费</div>
        <div>
          <span class="fc-85">0.00</span>
          <span class="fc-45">USDT</span>
        </div>
      </div>
      <div class="system-popup-price">
        <div class="fc-45">开仓量</div>
        <div>
          <span class="fc-85">2.34</span>
          <span class="fc-45">USDT</span>
        </div>
      </div>
      <div class="system-popup-buttons">
        <div class="system-popup-button cancel" @click="close">取消</div>
        <div class="system-popup-button confirm" @click="close">确认</div>
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
    },
    type: {
      type: String,
      default: 'red'
    }
  },
  data () {
    return {
      showPopup: this.show,
      openType: this.type
    }
  },
  watch: {
    show () {
      this.openType = this.type
      this.showPopup = this.show
    }
  },
  methods: {
    close () {
      this.$emit('closeOpenPopup', false, this.openType)
    }
  }
}
</script>

<style lang="less" scoped>
</style>
