<template>
<div>
  <van-popup class="derify-popup" v-model="showPopup" round :closeable="false" @close="close">
    <div class="unwind-popup system-popup">
      <div class="system-popup-title">赎回{{redeemName}}</div>
      <div>
        <!-- <div>
          <van-dropdown-menu :overlay="false" class="derify-dropmenus">
            <van-dropdown-item v-model="value1" :options="option1">
                <div class="derify-dropmenu-title" slot="title">
                  <span>{{option1[value1]}}</span>
                  <van-icon name="arrow-down" size="1.8rem" color="rgba(255, 255, 255, .85)" />
                </div>
            </van-dropdown-item>
          </van-dropdown-menu>
        </div> -->
        <div class="popup-text">赎回数量</div>
        <div class="system-popup-input">
          <van-field class="derify-input no-padding-hor fz-17" placeholder="0.8" type="number" v-model="value1" />
          <div class="unit">{{redeemName}}</div>
        </div>
        <div class="system-popup-num">
          <span class="popup-span1">可赎回：1234567.00000000 {{redeemName}}</span>
          <span class="popup-span2">全部赎回</span>
        </div>
      </div>
      <div class="system-popup-buttons">
        <div class="system-popup-button cancel" @click="close">取消</div>
        <div class="system-popup-button confirm" @click="submitThenClose">赎回</div>
      </div>
    </div>
  </van-popup>
  <van-action-sheet v-model="sss" :actions="actions" @select="onSelect" />
  </div>
</template>

<script>
import { Toast } from 'vant'
import { toContractUnit } from '../../../utils/contractUtil'
export default {
  props: ['show', 'redeemId'],
  data () {
    return {
      showPopup: this.show,
      value1: null,
      curPercent: 25,
      redeemName: null,
      option1: [
        { text: '市价委托', value: 0 },
        { text: '限价委托', value: 1 }
      ],
      sss: false,
      actions: [
        { name: '选项一' },
        { name: '选项二' },
        { name: '选项三' }
      ]
    }
  },
  watch: {
    show () {
      this.showPopup = this.show
    },
    redeemId () {
      if (this.redeemId === 1) {
        this.redeemName = 'eDRF'
      } else {
        this.redeemName = 'bDRF'
      }
    }
  },
  methods: {
    close () {
      this.$emit('closeRedeem', false)
    },
    onSelect (item) {
      // 默认情况下点击选项时不会自动收起
      // 可以通过 close-on-click-action 属性开启自动收起
      this.show = false
      Toast(item.name)
    },
    submitThenClose () {
      if (this.redeemId === 1) {
        this.redeemName = 'eDRF'
      } else {
        this.$store.dispatch("earnings/redeemBondFromBank", {amount: toContractUnit(this.amount)}).then( r => {
          this.close()
        }).catch(e => {
          this.close()
        }).finally( p => {
          this.close()
        })
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
