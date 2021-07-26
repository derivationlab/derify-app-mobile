<template>
  <van-popup class="derify-popup" v-model="showPopup" round :closeable="false" @close="close">
    <div class="unwind-popup system-popup">
      <div class="system-popup-title">兑换bDRF</div>
      <div>
        <div>
          <van-dropdown-menu :overlay="false" class="derify-dropmenus">
            <van-dropdown-item v-model="value1" :options="option1" class="derify-dropmenu-item" @open="onDropDowOpen">
                <div class="derify-dropmenu-title" slot="title">
                  <span>{{option1[value1].text}}</span>
                  <van-icon name="arrow-down" size="1.8rem" color="rgba(255, 255, 255, .85)" />
                </div>
            </van-dropdown-item>
          </van-dropdown-menu>
        </div>
        <div class="popup-text">兑换数量</div>
        <div class="system-popup-input">
          <van-field class="derify-input no-padding-hor fz-17" placeholder="0.8" type="number" v-model="value1" />
          <div class="unit">bDRF</div>
        </div>
        <div class="system-popup-num">
          <span class="popup-span1">可兑换：1234567.00000000 bDRF</span>
          <span class="popup-span2">全部兑换</span>
        </div>
      </div>
      <div class="system-popup-buttons">
        <div class="system-popup-button cancel" @click="close">取消</div>
        <div class="system-popup-button confirm" @click="submitThenClose">兑换</div>
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
      value1: 0,
      curPercent: 25,
      withdrawName: null,
      option1: [
        { text: 'Derify账户', value: 0 },
        { text: '钱包账户', value: 1 }
      ]
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
      this.$emit('closeDeposit', false)
    },
    submitThenClose () {
      this.$store.dispatch("earnings/exchangeBond", {amount: toContractUnit(this.amount)}).then( r => {
        this.close()
      }).catch(e => {
        this.close()
      }).finally( p => {
        this.close()
      })
    },
    onDropDowOpen () {
      return document.querySelector(".derify-dropmenu-item .van-dropdown-item").style.top = "150px"
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
