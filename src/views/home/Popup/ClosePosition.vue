<template>
  <van-popup class="derify-popup" v-model="showPopup" round :closeable="false" @close="close">
    <div class="system-popup">
      <div class="system-popup-title">{{$t(popupInfos[popupInfoIndex].title)}}</div>
      <div class="fz-15" style="margin-top: 1rem">
        <span class="fc-65">{{$t(popupInfos[popupInfoIndex].content)}}</span>
      </div>
      <div class="system-popup-buttons">
        <div class="system-popup-button cancel" @click="close">{{$t('Trade.CurrentOrder.CancelOrderPopup.Cancel')}}</div>
        <div class="system-popup-button confirm" @click="submitThenClose">{{$t('Trade.CurrentOrder.CancelOrderPopup.Confirm')}}</div>
      </div>
    </div>
  </van-popup>
</template>

<script>
import { PositionView, toContractUnit } from '../../../utils/contractUtil'
import { UserProcessStatus } from '../../../store/modules/user'
import { CancelOrderedPositionTypeEnum } from '../../../store/modules/contract'

export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    closePositionOrderType: {
      type: Number,
      default: null
    },
    extraData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      showPopup: this.show,
      popupInfoIndex: 0,
      popupInfos: [
        {type: CancelOrderedPositionTypeEnum.StopLossOrder, title: 'Trade.CurrentOrder.CancelOrderPopup.CancelOneOrder', content: 'Trade.CurrentOrder.CancelOrderPopup.CancelOneOrderInfo', calfunc: 'cancleOrderedPosition'},
        {type: CancelOrderedPositionTypeEnum.StopProfitOrder, title: 'Trade.CurrentOrder.CancelOrderPopup.CancelOneOrder', content: 'Trade.CurrentOrder.CancelOrderPopup.CancelOneOrderInfo', calfunc: 'cancleOrderedPosition'},
        {type: CancelOrderedPositionTypeEnum.LimitedOrder, title: 'Trade.CurrentOrder.CancelOrderPopup.CancelOneOrder', content: 'Trade.CurrentOrder.CancelOrderPopup.CancelOneOrderInfo', calfunc: 'cancleOrderedPosition'},

        {type: CancelOrderedPositionTypeEnum.AllOrder, title: 'Trade.CurrentOrder.CancelOrderPopup.CancelAllOrder', content: 'Trade.CurrentOrder.CancelOrderPopup.CloseAllOrderInfo', calfunc: 'cancleAllOrderedPositions'},
      ]
    }
  },
  watch: {
    show () {
      this.showPopup = this.show
    },
    closePositionOrderType () {
      const opType = this.closePositionOrderType
      this.popupInfoIndex = this.popupInfos.findIndex(item => item.type === opType)
    },
    extraData: {
      immediate: true,
      deep: true,
      handler () {

      }
    }
  },
  methods: {
    close () {
      this.$emit('onClosePosition', false, this.extraData)
    },
    submitThenClose () {
      const closePositionOrderType = this.closePositionOrderType
      const closePositionOrderTypeMap = {}
      closePositionOrderTypeMap[CancelOrderedPositionTypeEnum.AllOrder] = 'closeAllPositions'
      closePositionOrderTypeMap[CancelOrderedPositionTypeEnum.LimitedOrder] = 'cancleOrderedPosition'
      closePositionOrderTypeMap[CancelOrderedPositionTypeEnum.StopLossOrder] = 'cancleOrderedPosition'
      closePositionOrderTypeMap[CancelOrderedPositionTypeEnum.StopProfitOrder] = 'cancleOrderedPosition'
      closePositionOrderTypeMap[CancelOrderedPositionTypeEnum.StopProfitAndLossOrder] = 'cancleOrderedPosition'

      const action = closePositionOrderTypeMap[closePositionOrderType]

      const param = {...this.extraData, closeType: closePositionOrderType}

      this.$userProcessBox({status: UserProcessStatus.waiting, msg: this.$t('global.TradePendingMsg')})

      this.$store.dispatch('contract/' + action, param).then((r) => {
        this.$userProcessBox({status: UserProcessStatus.success, msg: this.$t('global.TradeSuccessMsg')})
        this.$store.dispatch('contract/loadPositionData').then(r => {})
      }).catch((msg) => {
        this.$userProcessBox({status: UserProcessStatus.failed, msg: this.$t('global.TradeFailedMsg')})
      });

      this.close();
    }
  }
}
</script>

<style lang="less" scoped>
</style>
