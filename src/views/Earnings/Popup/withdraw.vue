<template>
  <van-popup class="derify-popup" v-model="showPopup" round :closeable="false" @close="close">
    <div class="unwind-popup system-popup">
      <div class="system-popup-title">{{$t('Rewards.Mining.Withdraw')}}</div>
      <DerifyErrorNotice @close="errorNotice" :show="showError">
        {{errorMsg}}
      </DerifyErrorNotice>
      <div>
        <div class="popup-text">{{$t('Rewards.Mining.WithdrawAmount')}}</div>
        <div class="system-popup-input">
          <van-field class="derify-input no-padding-hor fz-17" :formatter="(value) => value.replace(/-/g, '')"
                     placeholder="0" type="number" v-model="amount" @change="checkAmount"/>
          <div class="unit">{{withdrawName}}</div>
        </div>
        <div class="system-popup-num">
          <span class="popup-span1">{{$t('Rewards.Mining.WithdrawMax')}}：{{maxAmout|fck(-8)}} {{withdrawName}}</span>
          <span class="popup-span2" @click="exchangeAll">{{$t('Rewards.Mining.WithdrawAll')}}</span>
        </div>
      </div>
      <div class="system-popup-buttons">
        <div class="system-popup-button cancel" @click="close">{{$t('Rewards.Mining.WithdrawCancel')}}</div>
        <div class="system-popup-button confirm" @click="submitThenClose">{{$t('Rewards.Mining.Withdraw')}}</div>
      </div>
    </div>
  </van-popup>
</template>

<script>
import { fromContractUnit, toContractUnit } from '../../../utils/contractUtil'
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
      amount: 0,
      //maxAmout: 10*1e8,
      curPercent: 25,
      withdrawName: null
    }
  },
  computed: {
    maxAmout () {
      if (this.withdrawId === EarningType.MIN) {
        return this.$store.state.earnings.pmrBalance
      } else if (this.withdrawId === EarningType.EDRF) {
        return 0
      } else if(this.withdrawId === EarningType.BDRF){
        return this.$store.state.earnings.bondInfo.bondBalance
      }
      return 0
    }
  },
  watch: {
    show () {
      this.showPopup = this.show
      if(this.show) {
        this.amount = 0
      }
    },
    withdrawId () {
      if (this.withdrawId === EarningType.MIN) {
        this.withdrawName = 'USDT'
      } else if (this.withdrawId === EarningType.EDRF) {
        this.withdrawName = 'DRF'
      } else if(this.withdrawId === EarningType.BDRF){
        this.withdrawName = 'bDRF'
      }
    }
  },
  methods: {
    close () {
      this.$emit('closeWithdraw', false)
    },
    exchangeAll () {
      this.amount = fck(this.maxAmout, -8, 4)
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
      if(this.amount <= 0 || this.amount > fromContractUnit(this.maxAmout)) {
        this.errorNotice(this.$t('Rewards.Mining.NumberError'))
        return false
      }
      return true
    },
    submitThenClose () {
      if(!this.checkAmount()) {
        this.errorNotice(this.$t('Rewards.Mining.NumberError'))
        return
      }

      if(this.withdrawId === EarningType.MIN) {

        this.close()
        this.$userProcessBox({status: UserProcessStatus.waiting, msg: this.$t('Rewards.TradePendingMsg')})
        //position mining
        this.$store.dispatch("earnings/withdrawPMReward", {amount: toContractUnit(this.amount)}).then( r => {
          this.$userProcessBox({status: UserProcessStatus.success, msg: this.$t('Rewards.TradeSuccessMsg')})
        }).catch(e => {
          this.$userProcessBox({status: UserProcessStatus.failed, msg: this.$t('Rewards.TradeFailedMsg')})
        }).finally( p => {
          this.$store.dispatch('earnings/loadEarningData')
        })

        return
      }

      if(this.withdrawId === EarningType.EDRF) {
        this.close()
        this.$userProcessBox({status: UserProcessStatus.waiting, msg: this.$t('Rewards.TradePendingMsg')})
        //eDRF
        this.$store.dispatch("earnings/withdrawPMReward", {amount: toContractUnit(this.amount)}).then( r => {
          this.$userProcessBox({status: UserProcessStatus.success, msg: this.$t('Rewards.TradeSuccessMsg')})
        }).catch(e => {
          this.$userProcessBox({status: UserProcessStatus.failed, msg: this.$t('Rewards.TradeFailedMsg')})
        }).finally( p => {
          this.$store.dispatch('earnings/loadEarningData')
        })

        return
      }

      if(this.withdrawId === EarningType.BDRF) {
        this.close()
        //bDRF
        this.$userProcessBox({status: UserProcessStatus.waiting, msg: this.$t('Rewards.TradePendingMsg')})
        this.$store.dispatch("earnings/withdrawBond", {amount: toContractUnit(this.amount)}).then( r => {
          this.$userProcessBox({status: UserProcessStatus.success, msg: this.$t('Rewards.TradeSuccessMsg')})
        }).catch(e => {
          this.$userProcessBox({status: UserProcessStatus.failed, msg: this.$t('Rewards.TradeFailedMsg')})
        }).finally( p => {
          this.$store.dispatch('earnings/loadEarningData')
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
