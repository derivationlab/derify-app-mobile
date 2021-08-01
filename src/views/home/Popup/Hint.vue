<template>
  <van-popup class="derify-popup" v-model="showPopup" round :closeable="false" @close="close">
    <div class="hint-popup system-popup">
      <template v-if="hintType === 'key1'">
        <div class="hint-item">
          <div class="hint-item-title">浮动盈亏：</div>
          <div class="hint-item-info">您当前仓位的未实现盈亏金额。</div>
          <div class="hint-item-info">多仓浮动盈亏 = (当前价格 - 开仓均价) * 持仓量。</div>
          <div class="hint-item-info">空仓浮动盈亏 = (开仓均价 - 当前价格) * 持仓量。</div>
        </div>
        <div class="hint-item">
          <div class="hint-item-title">持仓量：</div>
          <div class="hint-item-info">持有此合约的数量。</div>
        </div>
        <div class="hint-item">
          <div class="hint-item-title">当前价格：</div>
          <div class="hint-item-info">当前平台的指数（交易）价格。</div>
        </div>
        <div class="hint-item">
          <div class="hint-item-title">开仓均价：</div>
          <div class="hint-item-info">此仓位的开仓平均价格。</div>
        </div>
        <div class="hint-item">
          <div class="hint-item-title">持仓保证金：</div>
          <div class="hint-item-info">此仓位的开仓平均价格。</div>
        </div>
        <div class="hint-item">
          <div class="hint-item-title">保证金率：</div>
          <div class="hint-item-info">保证金比例越小，仓位的风险越小。</div>
          <div class="hint-item-info">当保证金率为99%时仓位将被强平。</div>
        </div>
        <div class="hint-item">
          <div class="hint-item-title">强平价格：</div>
          <div class="hint-item-info">触发强平时的价格。</div>
        </div>
        <div class="hint-item">
          <div class="hint-item-title">止损设置：</div>
          <div class="hint-item-info">当价格达到止损设置的价格时，将自动平仓，此时仓位属于亏损状态，平仓防止继续亏损。</div>
        </div>
        <div class="hint-item">
          <div class="hint-item-title">止盈设置：</div>
          <div class="hint-item-info">当价格达到止盈设置的价格时，将自动平仓，此时仓位属于盈利状态，平仓防止盈利回撤。</div>
        </div>
      </template>
      <template v-if="hintType === 'key2'">
        <div class="hint-item">
          <div class="hint-item-title">委托价格：</div>
          <div class="hint-item-info">此委托的目标成交价格。</div>
        </div>
        <div class="hint-item">
          <div class="hint-item-title">委托数量：</div>
          <div class="hint-item-info">此委托将交易的合约的数量。</div>
        </div>
        <div class="hint-item">
          <div class="hint-item-title">委托时间：</div>
          <div class="hint-item-info">委托的下单时间。</div>
        </div>
        <div class="hint-item">
          <div class="hint-item-title">止损设置：</div>
          <div class="hint-item-info">当价格达到止损设置的价格时，将自动平仓，此时仓位属于亏损状态，平仓防止继续亏损。</div>
        </div>
        <div class="hint-item">
          <div class="hint-item-title">止盈设置：</div>
          <div class="hint-item-info">当价格达到止盈设置的价格时，将自动平仓，此时仓位属于盈利状态，平仓防止盈利回撤。</div>
        </div>
      </template>
      <template v-if="hintType === 'key3'">
        <div class="hint-item">
          <div class="hint-item-title">盈亏：</div>
          <div class="hint-item-info">此仓位的已实现盈亏金额。</div>
          <div class="hint-item-info">多仓盈亏 = (平仓价格 - 开仓均价) * 持仓量。</div>
          <div class="hint-item-info">空仓盈亏 = (开仓均价 - 平仓价格) * 持仓量。</div>
        </div>
        <div class="hint-item">
          <div class="hint-item-title">成交价格：</div>
          <div class="hint-item-info">平仓时成交的价格。</div>
        </div>
        <div class="hint-item">
          <div class="hint-item-title">成交数量：</div>
          <div class="hint-item-info">平仓时成交的仓位数量。</div>
        </div>
        <div class="hint-item">
          <div class="hint-item-title">成交金额：</div>
          <div class="hint-item-info">平仓成交金额 = 成交价格 * 成交数量。</div>
        </div>
        <div class="hint-item">
          <div class="hint-item-title">手续费：</div>
          <div class="hint-item-info">平仓时支付的手续费金额。</div>
        </div>
        <div class="hint-item">
          <div class="hint-item-title">动仓费：</div>
          <div class="hint-item-info">平仓时支付的动仓费金额，正为支出，负为收入。</div>
        </div>
        <div class="hint-item">
          <div class="hint-item-title">分摊补偿：</div>
          <div class="hint-item-info">以bDRF形式支付的金额。</div>
        </div>
      </template>
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
      default: ''
    }
  },
  data () {
    return {
      showPopup: this.show,
      hintType: this.type
    }
  },
  watch: {
    show () {
      this.showPopup = this.show
      this.hintType = this.type
    }
  },
  methods: {
    close () {
      this.$emit('closeHintPopup', false, this.hintType)
    }
  }
}
</script>

<style lang="less" scoped>
.hint-item + .hint-item {
  margin-top: 1.2rem;
}
.hint-item {
  &-title {
    font-size: 1.5rem;
    font-weight: 500;
  }
  &-info {
    margin-top: .4rem;
    font-size: 1.2rem;
    color: rgba(255, 255, 255, .65);
  }
}
</style>
