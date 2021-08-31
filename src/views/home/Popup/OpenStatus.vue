<template>
  <van-popup class="derify-popup small" v-model="showPopup" round :closeable="false" @close="close">
    <div class="open-status-popup">
      <template v-if="status === 'pending'">
        <img src="@/assets/images/home/open-pending.png" alt="" class="open-status-icon">
        <div class="open-status-text">{{$t('global.TradePendingMsg')}}</div>
      </template>
      <template v-if="status === 'success'">
        <img src="@/assets/images/home/open-success.png" alt="" class="open-status-icon">
        <div class="open-status-text">{{$t('global.TradeSuccessMsg')}}</div>
      </template>
      <template v-if="status === 'fail'">
        <img src="@/assets/images/home/open-fail.png" alt="" class="open-status-icon">
        <div class="open-status-text">{{$t('global.TradeFailedMsg')}}</div>
        <div class="system-popup-buttons padding">
          <div class="system-popup-button confirm">{{$t('global.Confirm')}}</div>
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
      default: 'pending'
    }
  },
  data () {
    return {
      showPopup: this.show,
      status: this.type
    }
  },
  watch: {
    show () {
      this.showPopup = this.show
    },
    type () {
      this.status = this.type
    }
  },
  methods: {
    close () {
      this.$emit('closeOpenStatusPopup', false, this.status)
    }
  }
}
</script>

<style lang="less" scoped>
.open-status-popup {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 6rem 0 4rem 0;
  .open-status-icon {
    width: 12rem;
    height: 12rem;
  }
  .open-status-text {
    font-size: 1.7rem;
    font-weight: 500;
    margin-top: 4rem;
  }
  .system-popup-buttons.padding {
    padding: 0 6rem;
  }
}
</style>
