<template>
<div>
  <van-popup class="derify-popup" v-model="showPopup" round :closeable="false" @close="close">
    <div class="unwind-popup system-popup">
      <div class="system-popup-title">{{$t('Rewards.Staking.Redeem')}}{{redeemName}}</div>
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
        <div class="popup-text">{{$t('Rewards.Staking.RedeemAmount')}}</div>
        <div class="system-popup-input">
          <van-field class="derify-input no-padding-hor fz-17" placeholder="0.8" type="number" v-model="amount" />
          <div class="unit">{{redeemName}}</div>
        </div>
        <div class="system-popup-num">
          <span class="popup-span1">{{$t('Rewards.Staking.RedeemMax')}}：{{maxRedeemAmount | fck(-8,4)}} {{redeemName}}</span>
          <span class="popup-span2" @click="redeemAll">{{$t('Rewards.Staking.RedeemAll')}}</span>
        </div>
      </div>
      <div class="system-popup-buttons">
        <div class="system-popup-button cancel" @click="close">{{$t('Rewards.Staking.RedeemCancel')}}</div>
        <template v-if="amount > 0">
          <div class="system-popup-button confirm" @click="submitThenClose">{{$t('Rewards.Staking.Redeem')}}</div>
        </template>
        <template v-else>
          <div class="system-popup-button disabled-btn" @click="submitThenClose">{{$t('Rewards.Staking.Redeem')}}</div>
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

    let accoutOptions = [
      { text: this.$t('Rewards.Staking.RedeemMyWallet'), value: 1 }
    ]

    if(this.redeemId === EarningType.EDRF) {
      accoutOptions = [      { text: this.$t('Rewards.Staking.DRFAccount'), value: 0 },
        { text: this.$t('Rewards.Staking.StakMyWallet'), value: 1 }]
    }else if(this.redeemId === EarningType.BDRF){
      accoutOptions = [      { text: this.$t('Rewards.Bond.bDRFRedeemAccount'), value: 0 },
        { text: this.$t('Rewards.Staking.RedeemMyWallet'), value: 1 }]
    }

    return {
      showPopup: this.show,
      value1: null,
      amount: 0,
      curPercent: 25,
      redeemName: null,
      accountType: BondAccountType.DerifyAccount,
      accountOptions: accoutOptions
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
    },
    "$i18n.locale": {
      handler() {
        let accoutOptions = [{ text: this.$t('Rewards.Staking.RedeemMyWallet'), value: 1 }]

        if(this.redeemId === EarningType.EDRF) {
          accoutOptions = [      { text: this.$t('Rewards.Staking.DRFAccount'), value: 0 },
            { text: this.$t('Rewards.Staking.StakMyWallet'), value: 1 }]
        }else if(this.redeemId === EarningType.BDRF){
          accoutOptions = [      { text: this.$t('Rewards.Bond.bDRFRedeemAccount'), value: 0 },
            { text: this.$t('Rewards.Staking.RedeemMyWallet'), value: 1 }]
        }

        this.accountOptions = accoutOptions
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    close () {
      this.$emit('closeRedeem', false)
    },
    onSelect (item) {
      // drop down items will not auto fold by default
      // please use close-on-click-action open auto fold
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
        this.$toast(this.$t('Rewards.Mining.NumberError'))
        return
      }

      if (this.redeemId === EarningType.EDRF) {

      } else if(this.redeemId === EarningType.BDRF) {
        this.close()
        this.$userProcessBox({status: UserProcessStatus.waiting, msg: this.$t('Rewards.TradePendingMsg')})
        this.$store.dispatch("earnings/redeemBondFromBank", {amount: toContractUnit(this.amount), bondAccountType: this.accountType}).then( r => {
          this.$userProcessBox({status: UserProcessStatus.success, msg: this.$t('Rewards.TradeSuccessMsg')})
        }).catch(e => {
          this.$userProcessBox({status: UserProcessStatus.failed, msg: this.$t('Rewards.TradeFailedMsg')})
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
