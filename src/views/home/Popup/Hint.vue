<template>
  <van-popup class="derify-popup" v-model="showPopup" round :closeable="false" @close="close">
    <div class="hint-popup system-popup">
      <template v-if="hintType === 'key1'">
        <div class="hint-item">
          <div class="hint-item-title">{{ $t('Trade.MyPosition.Hint.UnrealizedPnL') }}</div>
          <div class="hint-item-info">{{ $t('Trade.MyPosition.Hint.UnrealizedPnLDetail1') }}</div>
          <div class="hint-item-info">{{ $t('Trade.MyPosition.Hint.UnrealizedPnLDetail2') }}</div>
        </div>
        <div class="hint-item">
          <div class="hint-item-title">{{ $t('Trade.MyPosition.Hint.PositionHeld') }}</div>
          <div class="hint-item-info">{{ $t('Trade.MyPosition.Hint.PositionHeldDetail') }}</div>
        </div>
        <div class="hint-item">
          <div class="hint-item-title">{{ $t('Trade.MyPosition.Hint.CurrentPrice') }}</div>
          <div class="hint-item-info">{{ $t('Trade.MyPosition.Hint.CurrentPriceDetail') }}</div>
        </div>
        <div class="hint-item">
          <div class="hint-item-title">{{ $t('Trade.MyPosition.Hint.AveragePrice') }}</div>
          <div class="hint-item-info">{{ $t('Trade.MyPosition.Hint.AveragePriceDetail') }}</div>
        </div>
        <div class="hint-item">
          <div class="hint-item-title">{{ $t('Trade.MyPosition.Hint.PositionMargin') }}</div>
          <div class="hint-item-info">{{ $t('Trade.MyPosition.Hint.PositionMarginDetail') }}</div>
        </div>
        <div class="hint-item">
          <div class="hint-item-title">{{ $t('Trade.MyPosition.Hint.Risk') }}</div>
          <div class="hint-item-info">{{ $t('Trade.MyPosition.Hint.RiskDetail') }}</div>
        </div>
        <div class="hint-item">
          <div class="hint-item-title">{{ $t('Trade.MyPosition.Hint.LiquidationPrice') }}</div>
          <div class="hint-item-info">{{ $t('Trade.MyPosition.Hint.LiquidationPriceDetail') }}</div>
        </div>
        <div class="hint-item">
          <div class="hint-item-title">{{ $t('Trade.MyPosition.Hint.StopLossSetting') }}</div>
          <div class="hint-item-info">{{ $t('Trade.MyPosition.Hint.StopLossSettingDetail') }}</div>
        </div>
        <div class="hint-item">
          <div class="hint-item-title">{{ $t('Trade.MyPosition.Hint.TakeProfitSetting') }}</div>
          <div class="hint-item-info">{{ $t('Trade.MyPosition.Hint.TakeProfitSettingDetail') }}</div>
        </div>
      </template>
      <template v-if="hintType === 'key2'">
        <div class="hint-item">
          <div class="hint-item-title">{{ $t('Trade.CurrentOrder.Hint.OrderPrice') }}</div>
          <div class="hint-item-info">{{ $t('Trade.CurrentOrder.Hint.OrderPriceDetail') }}</div>
        </div>
        <div class="hint-item">
          <div class="hint-item-title">{{ $t('Trade.CurrentOrder.Hint.OrderVolume') }}</div>
          <div class="hint-item-info">{{ $t('Trade.CurrentOrder.Hint.OrderVolumeDetail') }}</div>
        </div>
        <div class="hint-item">
          <div class="hint-item-title">{{ $t('Trade.CurrentOrder.Hint.OrderTime') }}</div>
          <div class="hint-item-info">{{ $t('Trade.CurrentOrder.Hint.OrderTimeDetail') }}</div>
        </div>
      </template>
      <template v-if="hintType === 'key3'">
        <div class="hint-item">
          <div class="hint-item-title">{{ $t('Trade.TradeHistory.Hint.PnL') }}</div>
          <div class="hint-item-info">{{ $t('Trade.TradeHistory.Hint.PnLDetail1') }}</div>
          <div class="hint-item-info">{{ $t('Trade.TradeHistory.Hint.PnLDetail2') }}</div>
        </div>
        <div class="hint-item">
          <div class="hint-item-title">{{ $t('Trade.TradeHistory.Hint.OrderVolume') }}</div>
          <div class="hint-item-info">{{ $t('Trade.TradeHistory.Hint.OrderVolumeDetail') }}</div>
        </div>
        <div class="hint-item">
          <div class="hint-item-title">{{ $t('Trade.TradeHistory.Hint.OrderPrice') }}</div>
          <div class="hint-item-info">{{ $t('Trade.TradeHistory.Hint.OrderPriceDetail') }}</div>
        </div>
        <div class="hint-item">
          <div class="hint-item-title">{{ $t('Trade.TradeHistory.Hint.OrderVolume') }}</div>
          <div class="hint-item-info">{{ $t('Trade.TradeHistory.Hint.OrderVolumeDetail') }}</div>
        </div>
        <div class="hint-item">
          <div class="hint-item-title">{{ $t('Trade.TradeHistory.Hint.TradingFee') }}</div>
          <div class="hint-item-info">{{ $t('Trade.TradeHistory.Hint.TradingFeeDetail') }}</div>
        </div>
        <div class="hint-item">
          <div class="hint-item-title">{{ $t('Trade.TradeHistory.Hint.PCF') }}</div>
          <div class="hint-item-info">{{ $t('Trade.TradeHistory.Hint.PCFDetail') }}</div>
        </div>
        <div class="hint-item">
          <div class="hint-item-title">{{ $t('Trade.TradeHistory.Hint.Compensation') }}</div>
          <div class="hint-item-info">{{ $t('Trade.TradeHistory.Hint.CompensationDetail') }}</div>
        </div>
      </template>
      <template v-if="hintType === 'key4'">
        <div class="hint-item">
          <div class="hint-item-title">{{ $t('Trade.OpenPosition.Hint.PCFRate') }}</div>
          <div class="hint-item-info">{{ $t('Trade.OpenPosition.Hint.PCFRateDetail') }}</div>
        </div>
        <div class="hint-item">
          <div class="hint-item-title">{{ $t('Trade.OpenPosition.Hint.PositionMiningAPY') }}</div>
          <div class="hint-item-info">{{ $t('Trade.OpenPosition.Hint.PositionMiningAPYDetail') }}</div>
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
