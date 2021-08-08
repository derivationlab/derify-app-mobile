<template>
<div>
  <van-popup class="derify-popup" v-model="showPopup" round :closeable="false" @close="close">
    <div class="unwind-popup system-popup">
      <div class="system-popup-title">赎回{{redeemName}}</div>
      <div>
        <div class="derify-dropmenu-wrap">
          <van-dropdown-menu :overlay="false" class="derify-dropmenus">
            <van-dropdown-item v-model="accountType" :options="accountOptions" @open="onDropDowOpen()" class="derify-dropmenu-item">
              <div class="derify-dropmenu-title" slot="title">
                <span>{{accountOptions[accountType].text}}</span>
                <van-icon name="arrow-down" size="1.8rem" color="rgba(255, 255, 255, .85)" />
              </div>
            </van-dropdown-item>
          </van-dropdown-menu>
        </div>
        <div class="popup-text">赎回数量</div>
        <div class="system-popup-input">
          <van-field class="derify-input no-padding-hor fz-17" placeholder="0.8" type="number" v-model="amount" />
          <div class="unit">{{redeemName}}</div>
        </div>
        <div class="system-popup-num">
          <span class="popup-span1">可赎回：{{maxRedeemAmount | fck(-8,4)}} {{redeemName}}</span>
          <span class="popup-span2" @click="redeemAll">全部赎回</span>
        </div>
      </div>
      <div class="system-popup-buttons">
        <div class="system-popup-button cancel" @click="close">取消</div>
        <template v-if="amount > 0">
          <div class="system-popup-button confirm" @click="submitThenClose">赎回</div>
        </template>
        <template v-else>
          <div class="system-popup-button disabled-btn" @click="submitThenClose">赎回</div>
        </template>
      </div>
    </div>
  </van-popup>
  </div>
</template>

<script>
import { Toast } from 'vant'
import { BondAccountType, fromContractUnit, toContractUnit } from '../../../utils/contractUtil'
import { UserProcessStatus } from '../../../store/modules/user'
import { fck } from '../../../utils/utils'
import { EarningType } from '../../../store/modules/earnings'
export default {
  props: ['show', 'redeemId'],
  data () {
    return {
      showPopup: this.show,
      value1: null,
      amount: 0,
      curPercent: 25,
      redeemName: null,
      accountType: BondAccountType.DerifyAccount,
      accountOptions: [
        { text: 'Derify账户', value: 0 },
        { text: '钱包账户', value: 1 }
      ]
    }
  },
  computed: {
    maxRedeemAmount () {
      if(this.redeemId === EarningType.EDRF) {
        return 0
      }else if(this.redeemId === EarningType.BDRF){
        return this.$store.state.earnings.bondInfo.bondReturnBalance
      }

      return 0
    }
  },
  watch: {
    show () {
      this.showPopup = this.show
    },
    redeemId () {
      if (this.redeemId === EarningType.EDRF) {
        this.redeemName = 'eDRF'
      } else if(this.redeemId === EarningType.BDRF){
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
    redeemAll(){
      this.amount = fck(this.maxRedeemAmount, -8, 4)
    },
    submitThenClose () {

      if(this.amount <= 0) {
        return
      }

      if(this.amount > fromContractUnit(this.maxRedeemAmount)) {
        this.$toast('超出限额，请重新输入')
        return
      }

      if (this.redeemId === EarningType.EDRF) {

      } else if(this.redeemId === EarningType.BDRF) {
        this.close()
        this.$userProcessBox({status: UserProcessStatus.waiting, msg: '正在执行交易,请稍后'})
        this.$store.dispatch("earnings/redeemBondFromBank", {amount: toContractUnit(this.amount), bondAccountType: this.accountType}).then( r => {
          this.$userProcessBox({status: UserProcessStatus.success, msg: '交易执行成功'})
        }).catch(e => {
          this.$userProcessBox({status: UserProcessStatus.failed, msg: '交易执行失败'})
        }).finally( p => {
          this.$store.dispatch('earnings/loadEarningData')
        })
      }

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
