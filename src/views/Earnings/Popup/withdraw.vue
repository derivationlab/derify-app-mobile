<template>
  <van-popup class="derify-popup" v-model="showPopup" round :closeable="false" @close="close">
    <div class="unwind-popup system-popup">
      <div class="system-popup-title">提现</div>
      <div>
        <div class="popup-text">提现数量</div>
        <div class="system-popup-input">
          <van-field class="derify-input no-padding-hor fz-17" placeholder="0.8" type="number" v-model="amount" />
          <div class="unit">{{withdrawName}}</div>
        </div>
        <div class="system-popup-num">
          <span class="popup-span1">可提现：1234567.00000000 {{withdrawName}}</span>
          <span class="popup-span2">全部提现</span>
        </div>
      </div>
      <div class="system-popup-buttons">
        <div class="system-popup-button cancel" @click="close">取消</div>
        <div class="system-popup-button confirm" @click="submitThenClose">提现</div>
      </div>
    </div>
  </van-popup>
</template>

<script>
import { toContractUnit } from '../../../utils/contractUtil'

export default {
  props: ['show', 'withdrawId'],
  data () {
    return {
      showPopup: this.show,
      amount: null,
      curPercent: 25,
      withdrawName: null
    }
  },
  watch: {
    show () {
      this.showPopup = this.show
    },
    withdrawId () {
      if (this.withdrawId === 1) {
        this.withdrawName = 'USDT'
      } else if (this.withdrawId === 2) {
        this.withdrawName = 'eDRF'
      } else {
        this.withdrawName = 'bDRF'
      }
    }
  },
  methods: {
    close () {
      this.$emit('closeWithdraw', false)
    },
    submitThenClose () {

      if(this.withdrawId === 1) {
        //挖矿持仓
        this.$store.dispatch("earnings/withdrawPMReward", {amount: toContractUnit(this.amount)}).then( r => {
          this.close()
        }).catch(e => {
          this.close()
        }).finally( p => {
          this.close()
        })

        return
      }

      if(this.withdrawId === 2) {
        //eDRF
        this.$store.dispatch("earnings/withdrawPMReward", {amount: toContractUnit(this.amount)}).then( r => {
          this.close()
        }).catch(e => {
          this.close()
        }).finally( p => {
          this.close()
        })

        return
      }

      if(this.withdrawId === 3) {
        //bDRF
        this.$store.dispatch("earnings/withdrawBond", {amount: toContractUnit(this.amount)}).then( r => {
          this.close()
        }).catch(e => {
          this.close()
        }).finally( p => {
          this.close()
        })

        return
      }

    }
  }
}
</script>

<style lang="less" scoped>
.unwind-popup-set {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  &-item {
    flex: .25;
    height: 2.8rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.10);
    border-radius: 2.8rem;
    color: rgba(255, 255, 255, 0.85);
    &.active {
      background: @orange;
      color: #140B32;
    }
  }
  &-item + &-item {
    margin-left: .8rem;
  }
}
.popup-text{
  margin: 1.8rem 0;
}
.popup-text{
  font-size: 12px;
  font-weight: 400;
  text-align: LEFT;
  color: rgba(255,255,255,0.45);
}
.system-popup-num{
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  font-size: 12px;
  font-weight: 400;
  .popup-span1{
    color: rgba(255,255,255,0.65);
  }
  .popup-span2{
    color: #fae247;
  }
}
</style>
