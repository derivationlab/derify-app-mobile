<template>
<div>
  <van-popup class="derify-popup" v-model="showPopup" round :closeable="false" @close="close">
    <div class="unwind-popup system-popup">
      <div class="system-popup-title">{{$t(langKey.title)}}</div>
      <DerifyErrorNotice @close="errorNotice" :show="showError">
        {{errorMsg}}
      </DerifyErrorNotice>
      <div>
        <div class="derify-dropmenu-wrap">
          <van-dropdown-menu :overlay="false" class="derify-dropmenus">
            <van-dropdown-item v-model="accountType" :options="accountOptions" @open="onDropDowOpen()" class="derify-dropmenu-item derify-dropmenu-item-wrap">
              <div class="derify-dropmenu-title" slot="title">
                <span>{{selectedAccountText}}</span>
                <van-icon name="arrow-down" size="1.8rem" color="rgba(255, 255, 255, .85)" />
              </div>
            </van-dropdown-item>
          </van-dropdown-menu>
        </div>
        <div class="popup-text">{{$t(langKey.amount)}}</div>
        <div class="system-popup-input">
          <van-field class="derify-input no-padding-hor fz-17" placeholder=""
                     :formatter="(value) => value.replace(/-/g, '')"
                     type="number" v-model="amount"  @input="checkAmount"/>
          <div class="unit">{{redeemName}}</div>
        </div>
        <div class="system-popup-num">
          <span class="popup-span1">{{$t(langKey.max)}}：{{maxRedeemAmount | fck(-8,4)}} {{redeemName}}</span>
          <span class="popup-span2" @click="redeemAll">{{$t(langKey.all)}}</span>
        </div>
      </div>
      <div class="system-popup-buttons">
        <div class="system-popup-button cancel" @click="close">{{$t(langKey.cancel)}}</div>
        <div class="system-popup-button confirm" @click="submitThenClose">{{$t(langKey.confirm)}}</div>
      </div>
    </div>
  </van-popup>
  </div>
</template>

<script>
import { BondAccountType, fromContractUnit, toContractUnit } from '../../../utils/contractUtil'
import { UserProcessStatus } from '../../../store/modules/user'
import { fck } from '../../../utils/utils'
import { EarningType } from '../../../store/modules/earnings'
import DerifyErrorNotice from '../../../components/DerifyErrorNotice/DerifyErrorNotice'
export default {
  components: { DerifyErrorNotice },
  props: ['show', 'redeemId'],
  data () {

    let accoutOptions = this.getAccountOptions()

    return {
      errorMsg: '',
      showError: false,
      showPopup: this.show,
      value1: null,
      amount: null,
      curPercent: 25,
      redeemName: null,
      accountType: accoutOptions[0].value,
      accountOptions: accoutOptions
    }
  },
  computed: {

    selectedAccountText() {
      let findItem = this.accountOptions.find(item => item.value === this.accountType)
      if(!findItem){
        findItem = this.accountOptions[0]
      }

      return findItem.text
    },

    maxRedeemAmount () {
      if(this.redeemId === EarningType.EDRF) {
        return this.$store.state.earnings.edrfInfo.drfBalance
      }else if(this.redeemId === EarningType.BDRF){
        return this.$store.state.earnings.bondInfo.bondReturnBalance
      }

      return 0
    },
    langKey () {
      if (this.redeemId === EarningType.MIN) {
        return {}
      } else if (this.redeemId === EarningType.EDRF) {
        return {
          title: 'Rewards.Staking.RedeemPopup.title',
          max: 'Rewards.Staking.RedeemPopup.Max',
          amount: 'Rewards.Staking.RedeemPopup.Amount',
          all: 'Rewards.Staking.RedeemPopup.All',
          cancel: 'Rewards.Staking.RedeemPopup.Cancel',
          confirm: 'Rewards.Staking.RedeemPopup.Redeem'
        }
      } else {
        //BDRF
        return {
          title: 'Rewards.Bond.RedeemPopup.title',
          max: 'Rewards.Bond.RedeemPopup.Max',
          amount: 'Rewards.Bond.RedeemPopup.Amount',
          all: 'Rewards.Bond.RedeemPopup.All',
          cancel: 'Rewards.Bond.RedeemPopup.Cancel',
          confirm: 'Rewards.Bond.RedeemPopup.Redeem'
        }
      }
    }
  },
  watch: {
    show () {
      this.showPopup = this.show
      if(this.showPopup) {

      }
    },
    redeemId () {
      if (this.redeemId === EarningType.EDRF) {
        this.redeemName = 'DRF'
      } else if(this.redeemId === EarningType.BDRF){
        this.redeemName = 'bDRF'
      }
      this.updateAccountOptions()
    },
    "$i18n.locale": {
      handler() {
        this.updateAccountOptions()
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    close () {
      this.$emit('closeRedeem', false)
    },
    getStakingInfo() {

    },
    errorNotice(msg){
      if(msg){
        this.errorMsg = msg
        this.showError = true
      }else{
        this.showError = false
      }
    },
    onSelect (item) {
      // drop down items will not auto fold by default
      // please use close-on-click-action open auto fold
      this.show = false
    },
    redeemAll(){
      this.amount = fck(this.maxRedeemAmount, -8, 4)
    },
    checkAmount () {
      if(this.amount === null || this.amount === '') {
        return false
      }

      if(this.amount <= 0) {
        this.errorNotice(this.$t('global.NumberError'))
        return false
      }

      if(this.amount > fromContractUnit(this.maxRedeemAmount)) {
        this.amount = fromContractUnit(this.maxRedeemAmount)
      }
      this.errorNotice(null)
      return true
    },
    submitThenClose () {

      if(!this.checkAmount()) {
        return
      }

      if (this.redeemId === EarningType.EDRF) {
        this.close()
        this.$userProcessBox({status: UserProcessStatus.waiting, msg: this.$t('global.TradePendingMsg')})
        this.$store.dispatch("earnings/redeemDrf", {amount: toContractUnit(this.amount), bondAccountType: this.accountType}).then( r => {
          this.$userProcessBox({status: UserProcessStatus.success, msg: this.$t('global.TradeSuccessMsg')})
        }).catch(e => {
          this.$userProcessBox({status: UserProcessStatus.failed, msg: this.$t('global.TradeFailedMsg')})
        }).finally( p => {
          this.$store.dispatch('earnings/loadEarningData')
        })
      } else if(this.redeemId === EarningType.BDRF) {
        this.close()
        this.$userProcessBox({status: UserProcessStatus.waiting, msg: this.$t('global.TradePendingMsg')})
        this.$store.dispatch("earnings/redeemBondFromBank", {amount: toContractUnit(this.amount), bondAccountType: this.accountType}).then( r => {
          this.$userProcessBox({status: UserProcessStatus.success, msg: this.$t('global.TradeSuccessMsg')})
        }).catch(e => {
          this.$userProcessBox({status: UserProcessStatus.failed, msg: this.$t('global.TradeFailedMsg')})
        }).finally( p => {
          this.$store.dispatch('earnings/loadEarningData')
        })
      }

    },
    onDropDowOpen () {
    },
    getAccountOptions() {
      let accoutOptions = [{ text: this.$t('Rewards.Staking.RedeemPopup.DRFAccount'), value: 1 }]

      if(this.redeemId === EarningType.EDRF) {
        accoutOptions = [
          // { text: this.$t('Rewards.Staking.RedeemPopup.DRFAccount'), value: 0 },
          { text: this.$t('Rewards.Staking.RedeemPopup.MyWallet'), value: 1 }]
      }else if(this.redeemId === EarningType.BDRF){
        accoutOptions = [      { text: this.$t('Rewards.Bond.RedeemPopup.bDRFAccount'), value: 0 },
          { text: this.$t('Rewards.Bond.RedeemPopup.MyWallet'), value: 1 }]
      }

      return accoutOptions
    },
    updateAccountOptions() {
      this.accountOptions = this.getAccountOptions()
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
