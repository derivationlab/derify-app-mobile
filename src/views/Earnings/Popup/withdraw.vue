<template>
  <van-popup class="derify-popup" v-model="showPopup" round :closeable="false" @close="close">
    <div class="unwind-popup system-popup">
      <div class="system-popup-title">{{$t(langKey.title)}}</div>
      <DerifyErrorNotice @close="errorNotice" :show="showError">
        {{errorMsg}}
      </DerifyErrorNotice>
      <div>
        <div class="popup-text">{{$t(langKey.amount)}}</div>
        <div class="system-popup-input">
          <van-field class="derify-input no-padding-hor fz-17" :formatter="(value) => value.replace(/-/g, '')"
                     placeholder="" type="number" v-model="amount" @input="checkAmount"/>
          <div class="unit">{{withdrawName}}</div>
        </div>
        <div class="system-popup-num">
          <span class="popup-span1">{{$t(langKey.max)}}：{{maxAmout|fck(-8)}} {{withdrawName}}</span>
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
import {fromContractUnit, toContractUnit} from '../../../utils/contractUtil'
import {fck} from '@/utils/utils'
import {UserProcessStatus} from "@/store/modules/user";
import {EarningType} from '../../../store/modules/earnings'
import DerifyErrorNotice from '../../../components/DerifyErrorNotice/DerifyErrorNotice'
import {getUSDTokenName} from '@/config'

export default {
  components: {DerifyErrorNotice},
  props: ['show', 'withdrawId'],
  data () {
    return {
      errorMsg: '',
      showError: false,
      showPopup: this.show,
      amount: null,
      //maxAmout: 10*1e8,
      curPercent: 25
    }
  },
  computed: {
    maxAmout () {
      if (this.withdrawId === EarningType.MIN) {
        return this.$store.state.earnings.pmrBalance
      } else if (this.withdrawId === EarningType.EDRF) {
        return this.$store.state.earnings.edrfInfo.edrfBalance
      } else if(this.withdrawId === EarningType.BDRF){
        return this.$store.state.earnings.bondInfo.bondBalance
      }
      return 0
    },
    withdrawName () {
      if (this.withdrawId === EarningType.MIN) {
        return getUSDTokenName()
      } else if (this.withdrawId === EarningType.EDRF) {
        return 'eDRF'
      } else if(this.withdrawId === EarningType.BDRF){
        return 'bDRF'
      }

      return ''
    },
    langKey () {
      if (this.withdrawId === EarningType.MIN) {
        return {
          title: 'Rewards.Mining.WithdrawPopup.title',
          max: 'Rewards.Mining.WithdrawPopup.Max',
          amount: 'Rewards.Mining.WithdrawPopup.Amount',
          all: 'Rewards.Mining.WithdrawPopup.All',
          cancel: 'Rewards.Mining.WithdrawPopup.Cancel',
          confirm: 'Rewards.Mining.WithdrawPopup.Withdraw'
        }
      } else if (this.withdrawId === EarningType.EDRF) {
        return {
          title: 'Rewards.Staking.WithdrawPopup.title',
          max: 'Rewards.Staking.WithdrawPopup.Max',
          amount: 'Rewards.Staking.WithdrawPopup.Amount',
          all: 'Rewards.Staking.WithdrawPopup.All',
          cancel: 'Rewards.Staking.WithdrawPopup.Cancel',
          confirm: 'Rewards.Staking.WithdrawPopup.Withdraw'
        }
      } else {
        //BDRF
        return {
          title: 'Rewards.Bond.WithdrawPopup.title',
          max: 'Rewards.Bond.WithdrawPopup.Max',
          amount: 'Rewards.Bond.WithdrawPopup.Amount',
          all: 'Rewards.Bond.WithdrawPopup.All',
          cancel: 'Rewards.Bond.WithdrawPopup.Cancel',
          confirm: 'Rewards.Bond.WithdrawPopup.Withdraw'
        }
      }
    }
  },
  watch: {
    show () {
      this.showPopup = this.show
      if(this.show) {
        this.amount = null
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
      this.errorMsg = msg
      if(msg){
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

      if(this.withdrawId === EarningType.MIN) {

        this.close()
        this.$userProcessBox({status: UserProcessStatus.waiting, msg: this.$t('global.TradePendingMsg')})
        //position mining
        this.$store.dispatch("earnings/withdrawPMReward", {amount: toContractUnit(this.amount)}).then(r => {
          this.$userProcessBox({status: UserProcessStatus.success, msg: this.$t('global.TradeSuccessMsg')})
        }).catch(e => {
          this.$userProcessBox({status: UserProcessStatus.failed, msg: this.$t('global.TradeFailedMsg')})
        }).finally(p => {
          this.$store.dispatch('earnings/loadEarningData')
        })

        return
      }

      if(this.withdrawId === EarningType.EDRF) {
        this.close()
        this.$userProcessBox({status: UserProcessStatus.waiting, msg: this.$t('global.TradePendingMsg')})
        //eDRF
        this.$store.dispatch("earnings/withdrawEdrf", {amount: toContractUnit(this.amount)}).then(r => {
          this.$userProcessBox({status: UserProcessStatus.success, msg: this.$t('global.TradeSuccessMsg')})
        }).catch(e => {
          this.$userProcessBox({status: UserProcessStatus.failed, msg: this.$t('global.TradeFailedMsg')})
        }).finally(p => {
          this.$store.dispatch('earnings/loadEarningData')
        })

        return
      }

      if(this.withdrawId === EarningType.BDRF) {
        this.close()
        //bDRF
        this.$userProcessBox({status: UserProcessStatus.waiting, msg: this.$t('global.TradePendingMsg')})
        this.$store.dispatch("earnings/withdrawBond", {amount: toContractUnit(this.amount)}).then(r => {
          this.$userProcessBox({status: UserProcessStatus.success, msg: this.$t('global.TradeSuccessMsg')})
        }).catch(e => {
          this.$userProcessBox({status: UserProcessStatus.failed, msg: this.$t('global.TradeFailedMsg')})
        }).finally(p => {
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
