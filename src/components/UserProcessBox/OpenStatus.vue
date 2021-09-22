<template>
  <van-popup class="derify-popup small" v-model="show" round :closeable="false" @close="close">
    <div class="open-status-popup">
      <template v-if="status === UserProcessStatus.waiting">
        <img src="@/assets/images/home/open-pending.png" alt="" class="open-status-icon">
        <div class="open-status-text">{{msg}}</div>
      </template>
      <template v-if="status === UserProcessStatus.success">
        <img src="@/assets/images/home/open-success.png" alt="" class="open-status-icon">
        <div class="open-status-text">{{msg}}</div>
        <div class="system-popup-buttons padding">
          <div class="system-popup-button confirm" @click="close">{{$t('global.Confirm')}}</div>
        </div>
      </template>
      <template v-if="status === UserProcessStatus.failed">
        <img src="@/assets/images/home/open-fail.png" alt="" class="open-status-icon">
        <div class="open-status-text">{{msg}}</div>
        <div class="system-popup-buttons padding">
          <div class="system-popup-button confirm" @click="close">{{$t('global.Confirm')}}</div>
        </div>
      </template>
    </div>
  </van-popup>
</template>

<script>
import { UserProcessStatus } from '@/store/modules/user'

export default {
  data () {

    return {
      show: false,
      msg: '',
      status: UserProcessStatus.finished,
      UserProcessStatus: UserProcessStatus
    }
  },
  watch:{
    show(){
      if(this.show && this.status === UserProcessStatus.success){
        setTimeout(() => {
          this.status = UserProcessStatus.finished;
          this.msg = '';
          this.close();
        }, 3000);
      }
    }
  },
  methods: {
    close () {
      this.show = false
      this.$emit('closeOpenStatusPopup', false, this.status)
    },
    updateData(data) {
      this.show = data.show
      this.msg = data.msg
      this.status = data.status

      this.$forceUpdate()
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
