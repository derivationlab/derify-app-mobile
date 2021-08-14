<template>
  <van-popup class="derify-popup" v-model="showPopup" round :closeable="false" @close="close">
    <div class="hint-popup system-popup">
      <template v-if="hintType === 'key1'">
        <div class="hint-item">
          <div class="hint-item-title">{{ $t('Trade.Hint.UnrealizedPnL') }}</div>
          <div class="hint-item-info">{{ $t('Trade.Hint.UnrealizedPnLOfLong') }}</div>
          <div class="hint-item-info">{{ $t('Trade.Hint.UnrealizedPnLOfShort') }}</div>
        </div>
        <div class="hint-item">
          <div class="hint-item-title">{{ $t('Trade.Hint.PositionHeld') }}</div>
          <div class="hint-item-info">{{ $t('Trade.Hint.PositionHeldDetail') }}</div>
        </div>
        <div class="hint-item">
          <div class="hint-item-title">{{ $t('Trade.Hint.CurrentPrice') }}</div>
          <div class="hint-item-info">{{ $t('Trade.Hint.CurrentPriceDetail') }}</div>
        </div>
        <div class="hint-item">
          <div class="hint-item-title">{{ $t('Trade.Hint.AveragePrice') }}</div>
          <div class="hint-item-info">{{ $t('Trade.Hint.AveragePriceDetail') }}</div>
        </div>
        <div class="hint-item">
          <div class="hint-item-title">{{ $t('Trade.Hint.PositionMargin') }}</div>
          <div class="hint-item-info">{{ $t('Trade.Hint.PositionMarginDetail') }}</div>
        </div>
        <div class="hint-item">
          <div class="hint-item-title">{{ $t('Trade.Hint.Risk') }}</div>
          <div class="hint-item-info">{{ $t('Trade.Hint.RiskDetail') }}</div>
        </div>
        <div class="hint-item">
          <div class="hint-item-title">{{ $t('Trade.Hint.LiquidationPrice') }}</div>
          <div class="hint-item-info">{{ $t('Trade.Hint.LiquidationPriceDetail') }}</div>
        </div>
        <div class="hint-item">
          <div class="hint-item-title">{{ $t('Trade.Hint.StopLossSetting') }}</div>
          <div class="hint-item-info">{{ $t('Trade.Hint.StopLossSettingDetail') }}</div>
        </div>
        <div class="hint-item">
          <div class="hint-item-title">{{ $t('Trade.Hint.TakeProfitSetting') }}</div>
          <div class="hint-item-info">{{ $t('Trade.Hint.TakeProfitSettingDetail') }}</div>
        </div>
      </template>
      <template v-if="hintType === 'key2'">
        <div class="hint-item">
          <div class="hint-item-title">{{ $t('Trade.Hint.OrderPrice') }}</div>
          <div class="hint-item-info">{{ $t('Trade.Hint.OrderPriceDetail') }}</div>
        </div>
        <div class="hint-item">
          <div class="hint-item-title">{{ $t('Trade.Hint.OrderVolume') }}</div>
          <div class="hint-item-info">{{ $t('Trade.Hint.OrderVolumeDetail') }}</div>
        </div>
        <div class="hint-item">
          <div class="hint-item-title">{{ $t('Trade.Hint.OrderTime') }}</div>
          <div class="hint-item-info">{{ $t('Trade.Hint.OrderTimeDetail') }}</div>
        </div>
      </template>
      <template v-if="hintType === 'key3'">
        <div class="hint-item">
          <div class="hint-item-title">{{ $t('Trade.Hint.PnL') }}</div>
          <div class="hint-item-info">{{ $t('Trade.Hint.PnLDetail1') }}</div>
          <div class="hint-item-info">{{ $t('Trade.Hint.PnLDetail2') }}</div>
          <div class="hint-item-info">{{ $t('Trade.Hint.PnLDetail3') }}</div>
        </div>
        <div class="hint-item">
          <div class="hint-item-title">{{ $t('Trade.Hint.ClosePrice') }}</div>
          <div class="hint-item-info">{{ $t('Trade.Hint.ClosePriceDetail') }}</div>
        </div>
        <div class="hint-item">
          <div class="hint-item-title">{{ $t('Trade.Hint.CloseVolume') }}</div>
          <div class="hint-item-info">{{ $t('Trade.Hint.CloseVolumeDetail') }}</div>
        </div>
        <div class="hint-item">
          <div class="hint-item-title">{{ $t('Trade.Hint.CloseAmount') }}</div>
          <div class="hint-item-info">{{ $t('Trade.Hint.CloseAmountDetail') }}</div>
        </div>
        <div class="hint-item">
          <div class="hint-item-title">{{ $t('Trade.Hint.TradingFee') }}</div>
          <div class="hint-item-info">{{ $t('Trade.Hint.TradingFeeDetail') }}</div>
        </div>
        <div class="hint-item">
          <div class="hint-item-title">{{ $t('Trade.Hint.PCF') }}</div>
          <div class="hint-item-info">{{ $t('Trade.Hint.PCFDetail') }}</div>
        </div>
        <div class="hint-item">
          <div class="hint-item-title">{{ $t('Trade.Hint.Compensation') }}</div>
          <div class="hint-item-info">{{ $t('Trade.Hint.CompensationDetail') }}</div>
        </div>
      </template>
      <template v-if="hintType === 'key4'">
        <div class="hint-item">
          <div class="hint-item-title">{{ $t('Trade.Hint.PCFRate') }}</div>
          <div class="hint-item-info">{{ $t('Trade.Hint.PCFRateDetail') }}</div>
        </div>
        <div class="hint-item">
          <div class="hint-item-title">{{ $t('Trade.Hint.PositionMiningAPY') }}</div>
          <div class="hint-item-info">{{ $t('Trade.Hint.PositionMiningAPYDetail') }}</div>
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
