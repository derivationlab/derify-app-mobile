<template>
  <van-popup class="derify-popup" v-model="showPopup" round :closeable="false" @close="close">
    <div class="unwind-popup system-popup">
      <div class="system-popup-title">{{$t(langKey.title)}}</div>
      <DerifyErrorNotice @close="errorNotice" :show="showError">
        {{errorMsg}}
      </DerifyErrorNotice>
      <div>
        <div class="derify-dropmenu-wrap">
          <van-dropdown-menu :overlay="false" class="derify-dropmenus">
            <van-dropdown-item v-model="accountType" :options="accountOptions" @change="updateTokenBalance"  @open="onDropDowOpen()" class="derify-dropmenu-item-wrap derify-dropmenu-item">
                <div class="derify-dropmenu-title" slot="title">
                  <span>{{selectedAccountText}}</span>
                  <van-icon name="arrow-down" size="1.8rem" color="rgba(255, 255, 255, .85)" />
                </div>
            </van-dropdown-item>
          </van-dropdown-menu>
        </div>
        <div class="popup-text">{{$t(langKey.amount)}}</div>
        <div class="system-popup-input">
          <van-field class="derify-input no-padding-hor fz-17" placeholder="" type="number"
                     :formatter="(value) => value.replace(/-/g, '')" v-model="amount"  @input="checkAmount"/>
          <div class="unit">{{pledgeName}}</div>
        </div>
        <div class="system-popup-num">
          <span class="popup-span1">{{$t(langKey.max)}}：{{maxPledgeAmout|fck(-8,4)}} {{pledgeName}}</span>
          <span class="popup-span2" @click="exchangeAll">{{$t(langKey.all)}}</span>
        </div>
      </div>
      <div class="system-popup-buttons">
        <div class="system-popup-button cancel" @click="close">{{$t(langKey.cancel)}}</div>
        <div class="system-popup-button confirm" @click="submitThenClose">{{$t(langKey.confirm)}}</div>
      </div>
    </div>
  </van-popup>
</template>

<script>
import {BondAccountType, fromContractUnit, toContractUnit} from '../../../utils/contractUtil'
import {UserProcessStatus} from '../../../store/modules/user'
import {fck} from '../../../utils/utils'
import {EarningType} from '../../../store/modules/earnings'
import DerifyErrorNotice from '../../../components/DerifyErrorNotice/DerifyErrorNotice'

export default {
  components: {DerifyErrorNotice},
  props: ['show', 'pledgeId'],
  data () {

    let accoutOptions = this.getAccountOptions()

    return {
      errorMsg: '',
      showError: false,
      showPopup: this.show,
      accountType: accoutOptions[0].value,
      amount: null,
      curPercent: 25,
      pledgeName: null,
      accountOptions:  accoutOptions
    }
  },
  watch: {
    show () {
      this.showPopup = this.show
      if(this.showPopup) {
        this.updateTokenBalance()
      }

    },
    pledgeId () {
      if (this.pledgeId === EarningType.EDRF) {
        this.pledgeName = 'DRF'
      } else if(this.pledgeId === EarningType.BDRF) {
        this.pledgeName = 'bDRF'
      }

      this.updateAccountOptions()
    },
    "$i18n": {
      handler() {
        this.updateAccountOptions()
      }
    }
  },
  computed: {
    maxPledgeAmout () {
      if(this.pledgeId === EarningType.EDRF) {
        if(this.accountType === BondAccountType.DerifyAccount){
          //TODO
          //return this.$store.state.earnings.bondInfo.bondBalance
          return 0
        }else{
          return this.$store.state.earnings.wallet.drfBalance
        }
      }else if(this.pledgeId === EarningType.BDRF) {
        if(this.accountType === BondAccountType.DerifyAccount){
          return this.$store.state.earnings.bondInfo.bondBalance
        }else{
          return this.$store.state.earnings.wallet.bdrfBalance
        }

      }
      return 0
    },
    langKey () {
      if(this.pledgeId === EarningType.EDRF) {
        return {
          title: 'Rewards.Staking.PledgePopup.title',
          max: 'Rewards.Staking.PledgePopup.Max',
          amount: 'Rewards.Staking.PledgePopup.Amount',
          all: 'Rewards.Staking.PledgePopup.All',
          cancel: 'Rewards.Staking.PledgePopup.Cancel',
          confirm: 'Rewards.Staking.PledgePopup.Staking'
        }
      }else if(this.pledgeId === EarningType.BDRF) {
        return {
          title: 'Rewards.Bond.PledgePopup.title',
          max: 'Rewards.Bond.PledgePopup.Max',
          amount: 'Rewards.Bond.PledgePopup.Amount',
          all: 'Rewards.Bond.PledgePopup.All',
          cancel: 'Rewards.Bond.PledgePopup.Cancel',
          confirm: 'Rewards.Bond.PledgePopup.Staking'
        }
      }

      return {title: '', max: '', amount: '', all: '', cancel: '', confirm: ''}
    },
    selectedAccountText() {
      let findItem = this.accountOptions.find(item => item.value === this.accountType)
      if(!findItem){
        findItem = this.accountOptions[0]
      }

      return findItem.text
    },
  },
  methods: {
    close () {
      this.$emit('closePledge', false)
    },
    errorNotice(msg){
      if(msg){
        this.errorMsg = msg
        this.showError = true
      }else{
        this.showError = false
      }
    },
    checkAmount () {

      if(this.amount === null || this.amount === '') {
        return false
      }

      if(this.amount <= 0) {
        this.errorNotice(this.$t('global.NumberError'))
        return false
      }

      if(this.amount > fromContractUnit(this.maxPledgeAmout)) {
        this.amount = fromContractUnit(this.maxPledgeAmout)
      }
      this.errorNotice(null)
      return true
    },
    submitThenClose(){

      if(!this.checkAmount()) {
        return
      }

      if (this.pledgeId === EarningType.EDRF) {
        //eDRF
        this.close()
        this.$userProcessBox({status: UserProcessStatus.waiting, msg: this.$t('global.TradePendingMsg')})
        this.$store.dispatch("earnings/stakingDrf", {bondAccountType: this.accountType, amount: toContractUnit(this.amount)})
          .then(() => {
            this.$userProcessBox({status: UserProcessStatus.success, msg: this.$t('global.TradeSuccessMsg')})
          }).catch(() => {
          this.$userProcessBox({status: UserProcessStatus.failed, msg: this.$t('global.TradeFailedMsg')})
        }).finally(() => {
          this.$store.dispatch('earnings/loadEarningData')
        })
      } else if(this.pledgeId === EarningType.BDRF) {
        this.close()
        this.$userProcessBox({status: UserProcessStatus.waiting, msg: this.$t('global.TradePendingMsg')})
        this.$store.dispatch("earnings/depositBondToBank", {bondAccountType: this.accountType, amount: toContractUnit(this.amount)})
          .then(() => {
            this.$userProcessBox({status: UserProcessStatus.success, msg: this.$t('global.TradeSuccessMsg')})
          }).catch(() => {
          this.$userProcessBox({status: UserProcessStatus.failed, msg: this.$t('global.TradeFailedMsg')})
        }).finally(() => {
          this.$store.dispatch('earnings/loadEarningData')
        })
      }
    },
    exchangeAll () {
      this.amount = fck(this.maxPledgeAmout, -8, 4)
    },
    onDropDowOpen () {
    },
    updateTokenBalance() {
      const earningTokenMap = {}
      earningTokenMap[EarningType.EDRF] = 'DRF'
      earningTokenMap[EarningType.BDRF] = 'bDRF'

      if(this.accountType === BondAccountType.WalletAccount) {
        this.$store.dispatch('earnings/getWalletBalance', {tokenName: earningTokenMap[this.pledgeId]})
      }

    },

    getAccountOptions() {
      let accoutOptions = [
        {text: this.$t('Rewards.Staking.PledgePopup.MyWallet'), value: 1}
      ]

      if(this.pledgeId === EarningType.EDRF) {
        accoutOptions = [
          //{ text: this.$t('Rewards.Staking.PledgePopup.DRFAccount'), value: 0 },
          {text: this.$t('Rewards.Staking.PledgePopup.MyWallet'), value: 1}]
      }else if(this.pledgeId === EarningType.BDRF){
        accoutOptions = [
          {text: this.$t('Rewards.Bond.PledgePopup.bDRFAccount'), value: 0},
          {text: this.$t('Rewards.Bond.PledgePopup.MyWallet'), value: 1}]
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
