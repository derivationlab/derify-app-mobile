<template>
  <van-popup class="derify-popup" v-model="showPopup" round :closeable="false" @close="close">
    <div class="system-popup">
      <div class="system-popup-title">设置止盈止损</div>
      <div style="margin-top: 2rem">
        <div class="system-popup-price">
          <div class="fc-45">开仓价格</div>
          <div>
            <span class="fc-85">{{position.averagePrice | fck(-8)}}</span>
            <span class="fc-45">USDT</span>
          </div>
        </div>
        <div class="system-popup-price">
          <div class="fc-45">当前价格</div>
          <div>
            <span class="fc-green">{{position.spotPrice | fck(-8)}}</span>
            <span class="fc-45">USDT</span>
          </div>
        </div>
      </div>
      <div class="system-popup-input-block">
        <div class="system-popup-input-title">止盈设置</div>
        <div class="system-popup-input">
          <van-field class="derify-input no-padding-hor" placeholder="0.00" @input="changeProfitPrice" type="number" v-model="position.stopProfitPriceInput" />
          <div class="unit">USDT</div>
        </div>
        <div class="system-popup-input-hint" v-if="position.stopProfitPriceInput">当指数价格达到 <span class="fc-85">{{position.stopProfitPrice | fck(-8)}}</span> USDT时，将会触发市价平仓当前仓位，预计盈利 <span class="fc-green">{{ position.profitAmount  | amountFormt(2, true, '-', -8)}}</span> USDT</div>
      </div>
      <div class="system-popup-input-block">
        <div class="system-popup-input-title">止损设置</div>
        <div class="system-popup-input">
          <van-field class="derify-input no-padding-hor" @input="changeLossPrice" placeholder="0.00" type="number" v-model="position.stopLossPriceInput" />
          <div class="unit">USDT</div>
        </div>
        <div class="system-popup-input-hint" v-if="position.stopLossPriceInput">当指数价格达到 {{position.stopLossPrice | fck(-8)}} USDT时，将会触发市价平仓当前仓位，预计亏损 <span class="fc-red">{{ position.lostAmount  | amountFormt(2, true, '-', -8)}}</span> USDT</div>
      </div>
      <div class="system-popup-buttons">
        <div class="system-popup-button cancel" @click="close">取消</div>
        <div class="system-popup-button confirm" @click="submitThenClose">确认</div>
      </div>
    </div>
  </van-popup>
</template>

<script>
import {fck} from "@/utils/utils";
import { fromContractUnit, OrderTypeEnum, SideEnum, toContractNum, toHexString } from '../../../utils/contractUtil'
import { UserProcessStatus } from '../../../store/modules/user'

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
          stopProfitPriceInput: fck(this.extraData.stopProfitPrice, -8),
          stopLossPriceInput: fck(this.extraData.stopLossPrice, -8),
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

      const {position} = this;

      if(price <= 0) {
        this.$toast('输入价格有误，请重新输入')
      }

      if(position.side === SideEnum.LONG && toContractNum(price) <= position.averagePrice){
        this.$toast('您设置的价格有误，请重新设置')
      }

      if(position.side === SideEnum.SHORT && toContractNum(price) >= position.averagePrice){
        this.$toast('您设置的价格有误，请重新设置')
      }

      this.position.stopProfitPriceInput = price;

      this.position.stopProfitPrice = toContractNum(price)
      this.calLossAndProfit();
    },
    changeLossPrice (price, oldPrice) {
      const {position} = this;

      if(price <= 0) {
        this.$toast('输入价格有误，请重新输入')
      }

      if(position.side === SideEnum.LONG && toContractNum(price) > position.averagePrice){
        this.$toast('您设置的价格有误，请重新设置')
      }

      if(position.side === SideEnum.SHORT && toContractNum(price) < position.averagePrice){
        this.$toast('您设置的价格有误，请重新设置')
      }
      this.position.stopLossPriceInput = price;
      this.position.stopLossPrice = toContractNum(price)
      this.calLossAndProfit();
    },
    calLossAndProfit(){
      this.position.profitAmount = (fromContractUnit(this.position.stopProfitPrice) - fromContractUnit(this.position.averagePrice))
        * this.position.size * (this.position.side === SideEnum.LONG ? 1 : -1)
      this.position.lostAmount = (fromContractUnit(this.position.stopLossPrice) - fromContractUnit(this.position.averagePrice))
        * this.position.size * (this.position.side === SideEnum.LONG ? 1 : -1)
    },
    submitThenClose (){
      const side = this.position.side
      const token = this.position.token

      //set stop profit price
      let finishCount = 0;
      if(this.position.stopProfitPriceInput && this.position.stopProfitPrice > 0) {
        finishCount++
        this.$store.dispatch('contract/orderStopPosition', {
          token, side, stopType: 0, stopPrice: toHexString(this.position.stopProfitPrice)
        }).then(_ => {
          finishCount--
          if(finishCount < 1) {
            this.$userProcessBox({status: UserProcessStatus.success, msg: '设置成功'})
          }

        }).catch(msg => {
          finishCount--
          this.$userProcessBox({status: UserProcessStatus.failed, msg: '设置失败:' + msg})
        })
      }else{
        finishCount++
        this.$store.dispatch('contract/cancleOrderedPosition', {token, orderType: OrderTypeEnum.StopProfitOrder, side, timestamp: this.position.timestamp}).then(_ => {
          finishCount--
          if(finishCount < 1) {
            this.$userProcessBox({status: UserProcessStatus.success, msg: '设置成功'})
          }

        }).catch(msg => {
          finishCount--
          this.$userProcessBox({status: UserProcessStatus.failed, msg: '设置失败:' + msg})
        })
      }

      //set stop loss price
      if(this.position.stopLossPriceInput && this.position.stopLossPriceInput > 0){
        finishCount++
        this.$store.dispatch('contract/orderStopPosition', {
          token, side, stopType: 1, stopPrice: toHexString(this.position.stopLossPrice)
        }).then(_ => {
          finishCount--
          if(finishCount < 1) {
            this.$userProcessBox({status: UserProcessStatus.success, msg: '设置成功'})
          }
        }).catch(msg => {
          finishCount--
          this.$userProcessBox({status: UserProcessStatus.failed, msg: '设置失败:' + msg})
        });
      }else{
        finishCount++
        this.$store.dispatch('contract/cancleOrderedPosition', {token, orderType: OrderTypeEnum.StopLossOrder, side, timestamp: this.position.timestamp}).then(_ => {
          finishCount--
          if(finishCount < 1) {
            this.$userProcessBox({status: UserProcessStatus.success, msg: '设置成功'})
          }

        }).catch(msg => {
          finishCount--
          this.$userProcessBox({status: UserProcessStatus.failed, msg: '设置失败:' + msg})
        })
      }

      if(finishCount > 0){
        this.$userProcessBox({status: UserProcessStatus.waiting, msg: '正在执行设置,请稍后'})
      }

      this.close()
    }
  }
}
</script>

<style lang="less" scoped>
</style>
