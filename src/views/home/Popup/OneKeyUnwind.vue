<template>
  <van-popup class="derify-popup" v-model="showPopup" round :closeable="false" @close="close">
    <div class="system-popup">
      <div class="system-popup-title">{{ $t('Trade.MyPosition.ClosePositionPopup.Close') }}</div>
      <div class="fz-15" style="margin-top: 1rem">
        {{$t('Trade.MyPosition.ClosePositionPopup.ClosePositionPopupInfo')}}
      </div>
      <div class="system-popup-buttons">
        <div class="system-popup-button cancel" @click="close">{{$t('Trade.MyPosition.ClosePositionPopup.Cancel')}}</div>
        <div class="system-popup-button confirm" @click="submitThenClose">{{$t('Trade.MyPosition.ClosePositionPopup.Confirm')}}</div>
      </div>
    </div>
  </van-popup>
</template>

<script>
import { toContractUnit } from '../../../utils/contractUtil'
import { UserProcessStatus } from '../../../store/modules/user'

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
      this.$userProcessBox({status: UserProcessStatus.waiting, msg: this.$t('global.TradePendingMsg')})

      this.$store.dispatch('contract/closeAllPositions').then((r) => {
        this.$userProcessBox({status: UserProcessStatus.success, msg: this.$t('global.TradeSuccessMsg')})
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
