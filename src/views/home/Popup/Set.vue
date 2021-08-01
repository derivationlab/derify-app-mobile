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
        <div class="system-popup-input-hint">当指数价格达到 <span class="fc-85">{{position.stopProfitPrice | fck(-8)}}</span> USDT时，将会触发市价平仓当前仓位，预计盈利 <span class="fc-green">{{ position.profitAmount  | fck(-8)}}</span> USDT</div>
      </div>
      <div class="system-popup-input-block">
        <div class="system-popup-input-title">止损设置</div>
        <div class="system-popup-input">
          <van-field class="derify-input no-padding-hor" @input="changeLossPrice" placeholder="0.00" type="number" v-model="position.stopLossPriceInput" />
          <div class="unit">USDT</div>
        </div>
        <div class="system-popup-input-hint">当指数价格达到 {{position.stopLossPrice | fck(-8)}} USDT时，将会触发市价平仓当前仓位，预计亏损 {{ position.lostAmount  | fck(-8)}} USDT</div>
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
import { fromContractUnit, SideEnum, toContractNum, toHexString } from '../../../utils/contractUtil'

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
      //止盈价格：如果是多仓，则止盈价格应大于开仓均价，如果是空仓，止盈价格应小于开仓均价，否则提示错误
      if(position.side === SideEnum.LONG && toContractNum(price) <= position.averagePrice){
        this.$toast('多仓止盈价格应大于开仓均价')
      }

      if(position.side === SideEnum.SHORT && toContractNum(price) >= position.averagePrice){
        this.$toast('空仓止盈价格应小于开仓均价')
      }

      this.position.stopProfitPriceInput = price;

      this.position.stopProfitPrice = toContractNum(price)
      this.calLossAndProfit();
    },
    changeLossPrice (price, oldPrice) {
      const {position} = this;

      //止损价格：如果是多仓，则止损价格应小于开仓均价，如果是空仓，止损价格应大于开仓均价，否则提示错误；
      if(position.side === SideEnum.LONG && toContractNum(price) > position.averagePrice){
        this.$toast('多仓止损价格应小于开仓均价')
      }

      if(position.side === SideEnum.SHORT && toContractNum(price) < position.averagePrice){
        this.$toast('空仓止损价格应大于开仓均价')
      }
      this.position.stopLossPriceInput = price;
      this.position.stopLossPrice = toContractNum(price)
      this.calLossAndProfit();
    },
    calLossAndProfit(){
      this.position.profitAmount = (fromContractUnit(this.position.stopProfitPrice) - fromContractUnit(this.position.averagePrice)) * this.position.size
      this.position.lostAmount = (fromContractUnit(this.position.stopLossPrice) - fromContractUnit(this.position.averagePrice)) * this.position.size
    },
    submitThenClose (){
      const side = this.position.side
      const token = this.position.token

      //设置止盈
      this.$store.dispatch('contract/orderStopPosition', {
        token, side, stopType: 0, stopPrice: toHexString(this.position.stopProfitPrice)
      });

      //设置止损
      this.$store.dispatch('contract/orderStopPosition', {
        token, side, stopType: 1, stopPrice: toHexString(this.position.stopLossPrice)
      });
      this.close()
    }
  }
}
</script>

<style lang="less" scoped>
</style>
