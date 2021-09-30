<template>
  <van-popup class="derify-popup" v-model="showPopup" round :closeable="false" @close="close">
    <div class="unwind-popup system-popup">
      <div class="system-popup-title">{{$t('Broker.Broker.WithdrawPopup.Title')}}</div>
      <DerifyErrorNotice @close="errorNotice" :show="showError">
        {{errorMsg}}
      </DerifyErrorNotice>
      <div>
        <div class="popup-text">{{$t('Broker.Broker.WithdrawPopup.Amount')}}</div>
        <div class="system-popup-input">
          <van-field class="derify-input no-padding-hor fz-17" :formatter="(value) => value.replace(/-/g, '')"
                     placeholder="" type="number" v-model="amount" @input="checkAmount"/>
          <div class="unit">{{withdrawName}}</div>
        </div>
        <div class="system-popup-num">
          <span class="popup-span1">{{$t('Broker.Broker.WithdrawPopup.Max')}}：{{maxAmout|fck(-8)}} {{withdrawName}}</span>
          <span class="popup-span2" @click="exchangeAll">{{$t('Broker.Broker.WithdrawPopup.All')}}</span>
        </div>
      </div>
      <div class="system-popup-buttons">
        <div class="system-popup-button cancel" @click="close">{{$t('Broker.Broker.WithdrawPopup.Cancel')}}</div>
        <div class="system-popup-button confirm" @click="submitThenClose">{{$t('Broker.Broker.WithdrawPopup.Withdraw')}}</div>
      </div>
    </div>
  </van-popup>
</template>

<script>
import { BondAccountType, fromContractUnit, toContractUnit } from '../../../utils/contractUtil'
import {fck} from '@/utils/utils'
import {UserProcessStatus} from "@/store/modules/user";
import { EarningType } from '../../../store/modules/earnings'
import DerifyErrorNotice from '../../../components/DerifyErrorNotice/DerifyErrorNotice'

export default {
  components: { DerifyErrorNotice },
  props: ['show', 'withdrawId'],
  data () {
    return {
      errorMsg: '',
      showError: false,
      showPopup: this.show,
      amount: null,
      curPercent: 25,
      withdrawName: 'USDT'
    }
  },
  computed: {
    trader() {
      return this.$store.state.user.selectedAddress
    },
    maxAmout () {
      return this.$store.state.broker.broker.rewardBalance
    }
  },
  watch: {
    show () {
      this.showPopup = this.show
      if(this.show) {
        this.$store.dispatch('broker/getTraderBrokerInfo', {trader: this.trader, accountType: BondAccountType.DerifyAccount})
          .then(() => {
            this.checkAmount()
          })
        this.amount = null
      }
    }
  },
  methods: {
    close () {
      this.$emit('close', false)
    },
    exchangeAll () {
      this.amount = fck(this.maxAmout, -8, 4)
    },
    errorNotice(msg){
      this.errorMsg = msg

      if(msg){
        this.showError = true
      }else{
        this.showError = false
      }
    },
    checkAmount () {

      if(this.amount === null || this.amount === ''){
        return false
      }

      if(this.amount <= 0) {
        this.errorNotice(this.$t('global.NumberError'))
        return false
      }

      if(this.amount > fromContractUnit(this.maxAmout)) {
        this.amount = fromContractUnit(this.maxAmout)
      }
      this.errorNotice(null)
      return true
    },
    submitThenClose () {
      if(!this.checkAmount()) {
        return
      }

      this.close()
      //bDRF
      this.$userProcessBox({status: UserProcessStatus.waiting, msg: this.$t('global.TradePendingMsg')})
      this.$store.dispatch("broker/withdrawBrokerReward", {trader: this.trader, amount: (this.amount)}).then( r => {
        this.$userProcessBox({status: UserProcessStatus.success, msg: this.$t('global.TradeSuccessMsg')})
      }).catch(e => {
        this.$userProcessBox({status: UserProcessStatus.failed, msg: this.$t('global.TradeFailedMsg')})
      }).finally( p => {
        this.$store.dispatch('broker/loadEarningData')
      })

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
