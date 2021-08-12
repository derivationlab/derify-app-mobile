<template>
  <van-popup class="derify-popup" v-model="showPopup" round :closeable="false" @close="close">
    <div class="system-popup">
      <div class="system-popup-title">{{ $t('Trade.SetStopPricePopup.SetStopPrice') }}</div>
      <div style="margin-top: 2rem">
        <div class="system-popup-price">
          <div class="fc-45">{{ $t('Trade.SetStopPricePopup.AveragePrice') }}</div>
          <div>
            <span class="fc-85">{{position.averagePrice | fck(-8)}}</span>
            <span class="fc-45">USDT</span>
          </div>
        </div>
        <div class="system-popup-price">
          <div class="fc-45">{{ $t('Trade.SetStopPricePopup.CurrentPrice') }}</div>
          <div>
            <span class="fc-green">{{position.spotPrice | fck(-8)}}</span>
            <span class="fc-45">USDT</span>
          </div>
        </div>
      </div>
      <div class="system-popup-input-block">
        <div class="system-popup-input-title">{{ $t('Trade.SetStopPricePopup.TakeProfit') }}</div>
        <div class="system-popup-input">
          <van-field class="derify-input no-padding-hor" placeholder="" @input="changeProfitPrice" type="number" v-model="position.stopProfitPriceInput" />
          <div class="unit">USDT</div>
        </div>
        <div class="system-popup-input-hint">
          <i18n path="Trade.SetStopPricePopup.StopPriceProfitNotice">
            <template #0>
              <span class="fc-85">{{position.stopProfitPrice | amountFormt(2, false, '--', -8)}}</span>
            </template>
            <template #1>
              <span class="fc-green">{{ position.profitAmount  | amountFormt(2, true, '--', -8)}}</span>
            </template>
          </i18n>
        </div>
      </div>
      <div class="system-popup-input-block">
        <div class="system-popup-input-title">{{ $t('Trade.SetStopPricePopup.StopLoss') }}</div>
        <div class="system-popup-input">
          <van-field class="derify-input no-padding-hor" @input="changeLossPrice" placeholder="" type="number" v-model="position.stopLossPriceInput" />
          <div class="unit">USDT</div>
        </div>
        <div class="system-popup-input-hint">
          <i18n path="Trade.SetStopPricePopup.StopPriceProfitNotice">
            <template #0>
              <span class="fc-85">{{position.stopLossPrice | amountFormt(2, false, '--', -8)}}</span>
            </template>
            <template #1>
              <span class="fc-red">{{ position.lostAmount  | amountFormt(2, true, '--', -8)}}</span>
            </template>
          </i18n>
        </div>
      </div>
      <div class="system-popup-buttons">
        <div class="system-popup-button cancel" @click="close">{{ $t('Trade.SetStopPricePopup.Cancel') }}</div>
        <div class="system-popup-button confirm" @click="submitThenClose">{{ $t('Trade.SetStopPricePopup.Confirm') }}</div>
      </div>
    </div>
  </van-popup>
</template>

<script>
import {fck} from "@/utils/utils";
import { fromContractUnit, OrderTypeEnum, SideEnum, toContractNum, toHexString } from '@/utils/contractUtil'
import { UserProcessStatus } from '@/store/modules/user'

export default {
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
      position: {}
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
    changeProfitPrice (price) {

      if(price === '') {
        return
      }

      this.position.stopProfitPrice = toContractNum(price)

      const {position} = this;

      if(price <= 0) {
        this.$toast(this.$t('global.NumberError'))
        return
      }

      if(!this.checkProfitPrice(position, price)){
        this.$toast(this.$t('global.NumberError'))
        return
      }


      this.calLossAndProfit();
    },
    changeLossPrice (price, oldPrice) {
      const {position} = this;

      this.position.stopLossPriceInput = price;

      if(price === '') {
        return
      }
      this.position.stopLossPrice = toContractNum(price)

      if(price <= 0) {
        this.$toast(this.$t('global.NumberError'))
        return
      }

      if(!this.checkLossPrice(position, price)){
        this.$toast(this.$t('global.NumberError'))
        return
      }


      this.calLossAndProfit();
    },

    checkProfitPrice(position, profitPrice) {
      if(position.side === SideEnum.LONG && toContractNum(profitPrice) <= position.averagePrice){
        return false
      }

      if(position.side === SideEnum.SHORT && toContractNum(profitPrice) >= position.averagePrice){
        return false
      }

      return true
    },
    checkLossPrice(position, lossPrice) {
      if(position.side === SideEnum.LONG && toContractNum(lossPrice) > position.averagePrice){
        return false
      }

      if(position.side === SideEnum.SHORT && toContractNum(lossPrice) < position.averagePrice){
        return false
      }

      return true
    },
    calLossAndProfit(){
      if(this.position.stopProfitPrice > 0) {
        this.position.profitAmount = (fromContractUnit(this.position.stopProfitPrice) - fromContractUnit(this.position.averagePrice))
          * this.position.size * (this.position.side === SideEnum.LONG ? 1 : -1)

      }

      if(this.position.stopLossPrice > 0) {
        this.position.lostAmount = (fromContractUnit(this.position.stopLossPrice) - fromContractUnit(this.position.averagePrice))
          * this.position.size * (this.position.side === SideEnum.LONG ? 1 : -1)
      }

    },
    submitThenClose (){
      const side = this.position.side
      const token = this.position.token


      if(this.position.stopProfitPriceInput !== ''){
        if(this.position.stopProfitPrice <= 0) {
          this.$toast(this.$t('global.NumberError'))
          return
        }

        if(!this.checkProfitPrice(this.position, this.position.stopProfitPrice)){
          this.$toast(this.$t('global.NumberError'))
          return
        }
      }

      if(this.position.stopLossPriceInput !== ''){
        if(this.position.stopLossPrice <= 0) {
          this.$toast(this.$t('global.NumberError'))
          return
        }

        if(!this.checkLossPrice(this.position, this.position.stopLossPrice)){
          this.$toast(this.$t('global.NumberError'))
          return
        }
      }


      //set stop profit price
      let finishCount = 0;
      if(this.position.stopProfitPriceInput !== '') {
        if(this.position.stopProfitPriceInput && this.position.stopProfitPrice > 0) {
          finishCount++
          this.$store.dispatch('contract/orderStopPosition', {
            token, side, stopType: 0, stopPrice: toHexString(this.position.stopProfitPrice)
          }).then(_ => {
            finishCount--
            if(finishCount < 1) {
              this.$userProcessBox({status: UserProcessStatus.success, msg: this.$t('Trade.SetStopPricePopup.TradeSuccessMsg')})
            }

          }).catch(msg => {
            finishCount--
            this.$userProcessBox({status: UserProcessStatus.failed, msg: this.$t('Trade.SetStopPricePopup.TradeFailedMsg')})
          })
        }else{
          finishCount++
          this.$store.dispatch('contract/cancleOrderedPosition', {token, orderType: OrderTypeEnum.StopProfitOrder, side, timestamp: this.position.timestamp}).then(_ => {
            finishCount--
            if(finishCount < 1) {
              this.$userProcessBox({status: UserProcessStatus.success, msg: this.$t('Trade.SetStopPricePopup.TradeSuccessMsg')})
            }

          }).catch(msg => {
            finishCount--
            this.$userProcessBox({status: UserProcessStatus.failed, msg: this.$t('Trade.SetStopPricePopup.TradeFailedMsg')})
          })
        }
      }


      //set stop loss price
      if(this.position.stopLossPriceInput !== '') {
        if(this.position.stopLossPriceInput && this.position.stopLossPriceInput > 0){
          finishCount++
          this.$store.dispatch('contract/orderStopPosition', {
            token, side, stopType: 1, stopPrice: toHexString(this.position.stopLossPrice)
          }).then(_ => {
            finishCount--
            if(finishCount < 1) {
              this.$userProcessBox({status: UserProcessStatus.success, msg: this.$t('Trade.SetStopPricePopup.TradeSuccessMsg')})
            }
          }).catch(msg => {
            finishCount--
            this.$userProcessBox({status: UserProcessStatus.failed, msg: this.$t('Trade.SetStopPricePopup.TradeFailedMsg')})
          });
        }else{
          finishCount++
          this.$store.dispatch('contract/cancleOrderedPosition', {token, orderType: OrderTypeEnum.StopLossOrder, side, timestamp: this.position.timestamp}).then(_ => {
            finishCount--
            if(finishCount < 1) {
              this.$userProcessBox({status: UserProcessStatus.success, msg: this.$t('Trade.SetStopPricePopup.TradeSuccessMsg')})
            }

          }).catch(msg => {
            finishCount--
            this.$userProcessBox({status: UserProcessStatus.failed, msg: this.$t('Trade.SetStopPricePopup.TradeFailedMsg')})
          })
        }
      }

      if(finishCount > 0){
        this.$userProcessBox({status: UserProcessStatus.waiting, msg: this.$t('Trade.SetStopPricePopup.TradePendingMsg')})
      }

      this.close()
    }
  }
}
</script>

<style lang="less" scoped>
</style>
