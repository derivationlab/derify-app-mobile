<template>
  <van-popup class="derify-popup" v-model="showPopup" round :closeable="false" @close="close">
    <div class="system-popup">
      <div class="system-popup-title">{{ $t('Trade.MyPosition.SetStopPricePopup.SetTPSL') }}</div>
      <DerifyErrorNotice :show="showError" @close="errorNotice">
        {{errorMsg}}
      </DerifyErrorNotice>
      <div style="margin-top: 2rem">
        <div class="system-popup-price">
          <div class="fc-45">{{ $t('Trade.MyPosition.SetStopPricePopup.AveragePrice') }}</div>
          <div>
            <span class="fc-85">{{position.averagePrice | fck(-8)}}</span>
            <span class="fc-45">{{ usdTokenName }}</span>
          </div>
        </div>
        <div class="system-popup-price">
          <div class="fc-45">{{ $t('Trade.MyPosition.SetStopPricePopup.CurrentPrice') }}</div>
          <div>
            <span class="fc-green">{{position.spotPrice | fck(-8)}}</span>
            <span class="fc-45">{{ usdTokenName }}</span>
          </div>
        </div>
      </div>
      <div class="system-popup-input-block">
        <div class="system-popup-input-title">{{ $t('Trade.MyPosition.SetStopPricePopup.TakeProfit') }}</div>
        <div class="system-popup-input">
          <van-field class="derify-input no-padding-hor" placeholder="" :formatter="(value) => value.replace(/-/g, '')" @change="checkPrice" @input="onInputProfitPrice" type="number" v-model="position.stopProfitPriceInput" />
          <div class="unit">{{ usdTokenName }}</div>
        </div>
        <div class="system-popup-input-hint">
          <i18n path="Trade.MyPosition.SetStopPricePopup.StopPriceProfitNotice">
            <template #0>
              <span class="fc-85">{{position.stopProfitPriceInput ? position.stopProfitPriceInput : '--'}}</span>
            </template>
            <template #1>
              <span :class="position.profitAmount > 0 ? 'fc-green' : 'fc-red'">{{ position.profitAmount  | amountFormt(2, true, '--', -8)}}</span>
            </template>
          </i18n>
        </div>
      </div>
      <div class="system-popup-input-block">
        <div class="system-popup-input-title">{{ $t('Trade.MyPosition.SetStopPricePopup.StopLoss') }}</div>
        <div class="system-popup-input">
          <van-field class="derify-input no-padding-hor" :formatter="(value) => value.replace(/-/g, '')" @change="checkPrice" @input="onInputLossPrice" placeholder="" type="number" v-model="position.stopLossPriceInput" />
          <div class="unit">{{ usdTokenName }}</div>
        </div>
        <div class="system-popup-input-hint">
          <i18n path="Trade.MyPosition.SetStopPricePopup.StopPriceLossNotice">
            <template #0>
              <span class="fc-85">{{position.stopLossPriceInput ? position.stopLossPriceInput : ''}}</span>
            </template>
            <template #1>
              <span :class="position.lostAmount > 0 ? 'fc-green' : 'fc-red'">{{ position.lostAmount  | amountFormt(2, true, '--', -8)}}</span>
            </template>
          </i18n>
        </div>
      </div>
      <div class="system-popup-buttons">
        <div class="system-popup-button cancel" @click="close">{{ $t('Trade.MyPosition.SetStopPricePopup.Cancel') }}</div>
        <div class="system-popup-button confirm" @click="submitThenClose">{{ $t('Trade.MyPosition.SetStopPricePopup.Confirm') }}</div>
      </div>
    </div>
  </van-popup>
</template>

<script>
import {amountFormt, fck} from '@/utils/utils'
import {
  fromContractUnit,
  OrderTypeEnum,
  SideEnum,
  toContractNum,
  toContractUnit,
  toHexString
} from '@/utils/contractUtil'
import {UserProcessStatus} from '@/store/modules/user'
import {CancelOrderedPositionTypeEnum} from '../../../store/modules/contract'
import DerifyErrorNotice from '../../../components/DerifyErrorNotice/DerifyErrorNotice'
import {getUSDTokenName} from '@/config'

export default {
  components: {DerifyErrorNotice},
  props: {
    show: {
      type: Boolean,
      default: false
    },
    extraData: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      showPopup: this.show,
      errorMsg: '',
      showError: false,
      position: {}
    }
  },
  computed: {
    usdTokenName(){
      return getUSDTokenName();
    }
  },
  watch: {
    show () {
      this.showPopup = this.show
    },
    extraData: {
      deep: true,
      immediate: true,
      handler () {
        const lostAmount = 0;
        const profitAmount = 0;

        if(this.extraData == null){
          return
        }

        this.position = Object.assign({}, {
          stopProfitPriceInput: this.extraData.stopProfitPrice > 0 ? fck(this.extraData.stopProfitPrice, -8) : null,
          stopLossPriceInput: this.extraData.stopLossPrice > 0 ? fck(this.extraData.stopLossPrice, -8) : null,
          lostAmount,
          profitAmount}, this.extraData);

        this.calLossAndProfit()
      }
    }
  },
  methods: {
    close () {
      this.$emit('closeSetPopup', false)
    },
    onInputProfitPrice (price) {

      this.position.stopProfitPriceInput = price;

      if(price < 0){
        price = 0
      }

      this.calLossAndProfit();
    },
    onInputLossPrice (price) {
      const {position} = this;
      this.position.stopLossPriceInput = price;

      if(price < 0){
        price = 0
      }

      this.calLossAndProfit();
    },
    checkPrice() {
      const {position} = this;
      if(!this.checkLossPrice(position, position.stopLossPriceInput)){
        this.errorNotice(this.$t('global.NumberError'))
      }else if(!this.checkProfitPrice(position, position.stopProfitPriceInput)){
        this.errorNotice(this.$t('global.NumberError'))
      }else{
        this.errorNotice(null)
      }
    },
    checkProfitPrice(position, profitPrice) {

      if(profitPrice === '') {
        return true
      }

      if(profitPrice <= 0){
        return false
      }

      if(position.profitAmount  <= 0){
        return false
      }

      return true
    },
    checkLossPrice(position, lossPrice) {

      if(lossPrice === '') {
        return true
      }

      if(lossPrice <= 0){
        return false
      }

      if(position.lostAmount  >0){
        return false
      }

      return true
    },
    calLossAndProfit(){
      if(this.position.stopProfitPriceInput) {
        this.position.profitAmount = toContractNum((this.position.stopProfitPriceInput - fromContractUnit(this.position.averagePrice))
          * fromContractUnit(this.position.size) * (this.position.side === SideEnum.LONG ? 1 : -1))

      }else{
        this.position.profitAmount = '--';
      }

      if(this.position.stopLossPriceInput) {
        this.position.lostAmount = toContractNum((this.position.stopLossPriceInput - fromContractUnit(this.position.averagePrice))
          * fromContractUnit(this.position.size) * (this.position.side === SideEnum.LONG ? 1 : -1))
      }else{
        this.position.lostAmount = '--';
      }

    },
    submitThenClose (){
      const side = this.position.side
      const token = this.position.token

      let profitPrice = null
      let lossPrice = null
      if(amountFormt(this.position.stopProfitPriceInput,-1,false,"") === amountFormt(this.position.stopProfitPrice,-1,false,"",-8)){
        profitPrice = 0;
      }else if(this.position.stopProfitPriceInput){
        if(!this.checkProfitPrice(this.position, this.position.stopProfitPriceInput)){
          this.errorNotice(this.$t('global.NumberError'))
          return
        }
        profitPrice = toContractUnit(this.position.stopProfitPriceInput)
      }else{
        profitPrice = -1
      }

      if(amountFormt(this.position.stopLossPriceInput,-1,false,"") === amountFormt(this.position.stopLossPrice,-1,false,"",-8)){
        lossPrice = 0;
      }else if(this.position.stopLossPriceInput !== ''){
        if(!this.checkLossPrice(this.position, this.position.stopLossPriceInput)){
          this.errorNotice(this.$t('global.NumberError'))
          return
        }
        lossPrice = toContractUnit(this.position.stopLossPriceInput)
      }else{
        lossPrice = -1
      }

      this.$userProcessBox({status: UserProcessStatus.waiting, msg: this.$t('global.TradePendingMsg')})
      this.$store.dispatch('contract/orderStopPosition', {
        token, side, takeProfitPrice: profitPrice, stopLossPrice: lossPrice
      }).then(_ => {
        this.$userProcessBox({status: UserProcessStatus.success, msg: this.$t('global.TradeSuccessMsg')})
      }).catch(msg => {
        this.$userProcessBox({status: UserProcessStatus.failed, msg: this.$t('global.TradeFailedMsg')})
      })

      this.close()
    },
    errorNotice(msg){
      if(msg){
        this.errorMsg = msg
        this.showError = true
      }else{
        this.showError = false
      }
    },
  }
}
</script>

<style lang="less" scoped>
</style>
