<template>
  <van-popup class="derify-popup" v-model="showPopup" round :closeable="false" @close="close">
    <div class="unwind-popup system-popup">
      <div class="system-popup-title">{{ $t(langKey.title) }}</div>
      <DerifyErrorNotice @close="errorNotice" :show="showError">
        {{errorMsg}}
      </DerifyErrorNotice>
      <div>
        <div>
          <van-dropdown-menu :overlay="false" class="derify-dropmenus">
            <van-dropdown-item v-model="accountType" :options="accountOptions"
                               class="derify-dropmenu-item derify-dropmenu-item-wrap" @open="onDropDowOpen" @change="updateExchangeBondSizeUpperBound">
                <div class="derify-dropmenu-title" slot="title">
                  <span>{{accountOptions[accountType].text}}</span>
                  <van-icon name="arrow-down" size="1.8rem" color="rgba(255, 255, 255, .85)" />
                </div>
            </van-dropdown-item>
          </van-dropdown-menu>
        </div>
        <div class="popup-text">{{ $t(langKey.amount) }}</div>
        <div class="system-popup-input">
          <van-field class="derify-input no-padding-hor fz-17" placeholder=""
                     :formatter="(value) => value.replace(/-/g, '')"
                     type="number" v-model="amount" @change="checkAmount"/>
          <div class="unit">{{ tokenName }}</div>
        </div>
        <div class="system-popup-num">
          <span class="popup-span1">{{ $t(langKey.max) }}：{{exchangeBondSizeUpperBound | fck(-8, 4)}} bDRF</span>
          <span class="popup-span2" @click="exchangeAll">{{ $t(langKey.all) }}</span>
        </div>
      </div>
      <div class="system-popup-buttons">
        <div class="system-popup-button cancel" @click="close">{{ $t(langKey.cancel) }}</div>
        <div class="system-popup-button confirm" @click="submitThenClose">{{ $t(langKey.confirm) }}</div>
      </div>
    </div>
  </van-popup>
</template>

<script>
import { toContractUnit,fromContractUnit } from '@/utils/contractUtil'
import {UserProcessStatus} from "@/store/modules/user"
import {fck} from '@/utils/utils';
import { BondAccountType } from '../../../utils/contractUtil'
import {EarningType} from "@/store/modules/earnings";
import DerifyErrorNotice from '../../../components/DerifyErrorNotice/DerifyErrorNotice'

export default {
  components: { DerifyErrorNotice },
  props: ['show', 'depositId'],
  data () {

    let accoutOptions = this.getAccountOptions()

    return {
      errorMsg: '',
      showError: false,
      showPopup: this.show,
      accountType: BondAccountType.DerifyAccount,
      amount: 0,
      curPercent: 25,
      tokenName: null,
      accountOptions: accoutOptions
    }
  },
  computed: {
    exchangeBondSizeUpperBound () {
      return this.$store.state.earnings.exchangeBondSizeUpperBound
    },
    langKey () {
      if (this.depositId === EarningType.MIN) {
        return {}
      } else if (this.depositId === EarningType.EDRF) {
        return {
          title: 'Rewards.Staking.PledgePopup.StakingDRF',
          max: 'Rewards.Staking.PledgePopup.Max',
          amount: 'Rewards.Staking.PledgePopup.Amount',
          all: 'Rewards.Staking.PledgePopup.All',
          cancel: 'Rewards.Staking.PledgePopup.Cancel',
          confirm: 'Rewards.Staking.PledgePopup.Staking'
        }
      } else {
        //BDRF
        return {
          title: 'Rewards.Bond.ExchangePopup.ExchangebDRF',
          max: 'Rewards.Bond.ExchangePopup.Max',
          amount: 'Rewards.Bond.ExchangePopup.Amount',
          all: 'Rewards.Bond.ExchangePopup.All',
          cancel: 'Rewards.Bond.ExchangePopup.Cancel',
          confirm: 'Rewards.Bond.ExchangePopup.Exchange'
        }
      }
    }
  },
  watch: {
    show () {
      this.showPopup = this.show
      this.updateExchangeBondSizeUpperBound()
    },
    depositId () {
      if (this.depositId === EarningType.MIN) {
        this.tokenName = 'USDT'
      } else if (this.depositId === EarningType.EDRF) {
        this.tokenName = 'DRF'
      } else {
        this.tokenName = 'bDRF'
      }

      this.updateAccountOptions()
    },
    '$store.state.earnings.exchangeBondSizeUpperBound': {
      handler() {
        this.resetAmount()
      },
      immediate: true,
      deep: true
    },
    "$i18n.locale": {
      handler () {
        this.updateAccountOptions()
      }
    }
  },
  methods: {
    close () {
      this.$emit('closeDeposit', false)
    },
    submitThenClose () {

      if(!this.checkAmount()) {
        return
      }

      this.close()
      this.$userProcessBox({status: UserProcessStatus.waiting, msg: this.$t('global.TradePendingMsg')})
      this.$store.dispatch("earnings/exchangeBond", {bondAccountType: this.accountType ,amount: toContractUnit(this.amount)}).then( r => {
        this.$userProcessBox({status: UserProcessStatus.success, msg: this.$t('global.TradeSuccessMsg')})
      }).catch(e => {
        this.$userProcessBox({status: UserProcessStatus.failed, msg: this.$t('global.TradeFailedMsg')})
      }).finally( p => {
        this.$store.dispatch('earnings/loadEarningData')
      })
    },
    onDropDowOpen () {
    },
    updateExchangeBondSizeUpperBound() {
      this.$store.dispatch("earnings/getExchangeBondSizeUpperBound", {bondAccountType: this.accountType})
    },
    resetAmount () {
      this.amount = Math.min(this.amount, fromContractUnit(this.exchangeBondSizeUpperBound))
    },
    exchangeAll () {
      this.amount = fck(this.exchangeBondSizeUpperBound, -8, 4)
    },
    checkAmount () {
      if(this.amount > fromContractUnit(this.exchangeBondSizeUpperBound)) {
        this.amount = fromContractUnit(this.exchangeBondSizeUpperBound)
        return true
      }

      if(this.amount <= 0) {
        this.errorNotice(this.$t('global.NumberError'))
        return false
      }

      return true
    },

    getAccountOptions() {
      let accoutOptions = [{ text: this.$t('Rewards.Bond.ExchangePopup.bDRFAccount'), value: 0 },
        { text: this.$t('Rewards.Bond.ExchangePopup.MyWallet'), value: 1 }]

      if (this.depositId === EarningType.MIN) {
        accoutOptions = []
      } else if (this.depositId === EarningType.EDRF) {
        accoutOptions = []
      } else {
        accoutOptions = [      { text: this.$t('Rewards.Bond.ExchangePopup.bDRFAccount'), value: 0 },
          { text: this.$t('Rewards.Bond.ExchangePopup.MyWallet'), value: 1 }]
      }

      return accoutOptions
    },

    updateAccountOptions() {
      this.accountOptions = this.getAccountOptions()
    },
    errorNotice(msg){
      if(msg){
        this.errorMsg = msg
        this.showError = true
      }else{
        this.showError = false
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
