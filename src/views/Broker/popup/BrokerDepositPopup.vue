<template>
  <van-popup class="derify-popup" v-model="showPopup" round @close="close">
    <div class="unwind-popup system-popup">
      <div class="system-popup-title">{{ $t('Broker.Broker.DepositPopup.Burn') }}</div>
      <DerifyErrorNotice :show="showError">
        {{errorMsg}}
      </DerifyErrorNotice>
      <div class="system-popup-info">
        <div class="system-popup-line">
          <div class="system-popup-label fz-15">
            <div class="fc-45">{{ $t('Broker.Broker.DepositPopup.Balance') }}</div>
            <div>
              <span class="fc-85">{{maxAmount}}</span>
              <span class="fc-45">eDRF</span>
            </div>
          </div>
        </div>
        <div class="system-popup-line">
          <div class="system-popup-label">
            <div class="fc-45">{{ $t('Broker.Broker.DepositPopup.UnitPrice') }}</div>
            <div>
              <span class="fc-85">{{unitAmount|fck(0,2)}}</span>
              <span class="fc-45">eDRF</span>
            </div>
          </div>
        </div>
      </div>

      <div class="system-popup-form">
        <div class="system-popup-line">
          <van-dropdown-menu :overlay="false" class="derify-dropmenus">
            <van-dropdown-item class="derify-dropmenu-item-wrap" v-model="accountType" :options="accountOptions" @change="accountTypeChange">
              <div class="derify-dropmenu-title" slot="title">
                <span>{{accountOptions[accountType].text}}</span>
                <van-icon name="arrow-down" size="1.8rem" color="rgba(255, 255, 255, .85)" />
              </div>
            </van-dropdown-item>
          </van-dropdown-menu>
        </div>

        <div class="system-popup-line">
          <div class="system-popup-label  fz-12"><span class="fc-45">{{ $t('Broker.Broker.DepositPopup.BurnAmount') }}</span>
            <span class="fc-80">
              <i18n path="Broker.Broker.DepositPopup.ValidPeriod">
                <template #0>
                  <span class="fc-yellow">{{validatePeriod}}</span>
                </template>
              </i18n>
            </span>
          </div>
          <div class="system-popup-input">
            <van-field class="derify-input no-padding-hor fz-17" placeholder=""
                       :formatter="(value) => value.replace(/-/g, '')"
                       type="number" v-model="amount" @input="checkAmount"/>
            <div class="unit">eDRF</div>
          </div>
        </div>
      </div>
      <div class="system-popup-buttons">
        <div class="system-popup-button cancel" @click="close">{{$t('Broker.Broker.DepositPopup.Cancel')}}</div>
        <div class="system-popup-button confirm" @click="close">{{$t('Broker.Broker.DepositPopup.Burn')}}</div>
      </div>
    </div>
  </van-popup>
</template>

<script>
import {
  fromContractUnit,
  toContractUnit,
  toHexString,
  SideEnum,
  OpenType,
  convertAmount2TokenSize, toContractNum, BondAccountType
} from '../../../utils/contractUtil'
import { fck } from '../../../utils/utils'
import { UnitTypeEnum } from '../../../store/modules/contract'
import { UserProcessStatus } from '../../../store/modules/user'
import ErrorNotice from '../../../components/DerifyErrorNotice/DerifyErrorNotice'
import DerifyErrorNotice from "@/components/DerifyErrorNotice/DerifyErrorNotice";

export default {
  components: {DerifyErrorNotice},
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data () {

    return {
      showError: false,
      errorMsg: '',
      accountType: 0,
      unitAmount: 600,
      amount: null,
      accountOptions: this.getAccountOptions(),
      showPopup: this.show
    }
  },
  watch: {
    show() {
      this.showPopup = this.show
    },
    '$i18n.locale':{
      handler(){
        this.accountOptions = this.getAccountOptions()
      }
    }
  },
  computed: {
    broker () {
      return this.$store.state.broker.broker
    },
    trader() {
      return this.$store.state.user.selectedAddress
    },
    maxAmount() {
      if(this.accountType === BondAccountType.DerifyAccount) {
        return this.$store.state.broker.broker.rewardBalance
      }else{
        return this.$store.state.broker.broker.edrfBalance
      }
    },
    validatePeriod () {

      if(this.amount < 1){
        return 0
      }

      return this.amount / this.unitAmount
    }
  },
  methods: {
    close () {
      this.$emit('close')
    },

    checkAmount() {
      if(this.amount > fromContractUnit(this.maxAmount)) {
        this.amount = fromContractUnit(this.maxAmount)
        return true
      }

      if(this.amount <= 0){
        this.errorNotice(this.$t('global.NumberError'))
        return false
      }
    },

    submitThenClose () {

      if(!this.checkAmount()) {
        return
      }

      this.$userProcessBox({show: true, status: UserProcessStatus.waiting
        ,msg: this.$t('global.TradePendingMsg')})
      this.$store.dispatch('broker/burnEdrfExtendValidPeriod',
        {trader: this.trader, accountType: this.accountType, amount: this.amount})
        .then(() => {
          this.$userProcessBox({show: true, status: UserProcessStatus.success
            ,msg: this.$t('global.TradeSuccessMsg')})
        })
        .catch(() => {
          this.$userProcessBox({show: true, status: UserProcessStatus.failed
            ,msg: this.$t('global.TradeFailedMsg')})
        })
    },
    getAccountOptions() {
      return [
        { text: this.$t('Broker.Broker.DepositPopup.eDRFAccount'), value: 0 },
        { text: this.$t('Broker.Broker.DepositPopup.MyWallet'), value: 1 }
      ]
    },
    accountTypeChange() {
      this.$store.dispatch('broker/getBrokerBalance', {trader: this.trader, accountType: this.accountType})
        .then(() => {
          this.checkAmount()
        })
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
.derify-popup{
  .system-popup-line{
    .system-popup-label{
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

  .system-popup-info{
    background: #343166;
    border-radius: 0.9rem;
    .system-popup-line {
      line-height: 3rem;
      padding: 1rem;
    }
    span{
      padding-right: 1rem;
    }
  }

  .system-popup-form{
    .system-popup-line{
      margin-top: 3rem;
    }
    .system-popup-label{
      margin: 1rem 0;
    }
  }
}
.van-dropdown-menu__title{
  padding: 0;
}
.derify-dropmenus .van-dropdown-menu__bar{
  padding-bottom: 0;
}
</style>
