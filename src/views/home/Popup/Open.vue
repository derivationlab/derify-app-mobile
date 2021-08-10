<template>
  <van-popup class="derify-popup" v-model="showPopup" round :closeable="false" @close="close">
    <div class="system-popup" v-if="openData">
      <div class="system-popup-title">开仓确认</div>
      <div class="error-notice" v-if="showError">
        <span>{{errorMsg}}</span>
        <div class="error-right">
          <van-icon name="cross" class="van-icon-close" color="#EA446B" @click="()=>{this.showError=false}"></van-icon>
        </div>
      </div>
      <div class="system-popup-price">
        <div class="fc-45">委托价格</div>
        <div v-if="openData.entrustType === OpenType.LimitOrder && sideType !== SideEnum.HEDGE">
          <span class="fc-85">{{openData.amount}}</span>
          <span class="fc-45">USDT</span>
        </div>
        <div v-else>
          <span class="fc-85">市价委托</span>
        </div>
      </div>
      <div class="system-popup-price">
        <div class="fc-45">开仓类型</div>
        <div v-if="sideType === SideEnum.SHORT">
          <span class="fc-red">开空</span>
          <span class="fc-red">{{openData.leverage}}x</span>
        </div>
        <div v-if="sideType === SideEnum.LONG">
          <span class="fc-green">开多</span>
          <span class="fc-green">{{openData.leverage}}x</span>
        </div>
        <div v-if="sideType === SideEnum.HEDGE">
          <span class="fc-yellow">双向对冲</span>
          <span class="fc-yellow">{{openData.leverage}}x</span>
        </div>
      </div>
      <div class="system-popup-price">
        <div class="fc-45">开仓量</div>
        <div>
          <span class="fc-85">{{size | amountFormt(4, false, 0)}}</span>
          <span class="fc-45">{{unitConfig[openData.unit].text}}</span>
        </div>
      </div>
      <div class="system-popup-price">
        <div class="fc-45">动仓费</div>
        <div>
          <span :class="'fc-85 ' + (-openData.positionChangeFee >= 0 ? 'fc-green' : 'fc-red')">{{-openData.positionChangeFee | amountFormt(4, true, 0)}}</span>
          <span class="fc-45">USDT</span>
        </div>
      </div>
      <div class="system-popup-price">
        <div class="fc-45">手续费</div>
        <div>
          <span class="fc-85">{{-openData.tradingFee | amountFormt(4, true, 0)}}</span>
          <span class="fc-45">USDT</span>
        </div>
      </div>
      <div class="system-popup-buttons">
        <div class="system-popup-button cancel" @click="close">取消</div>
        <div :class="confirmDisabled ? 'system-popup-button disabled-btn' : 'system-popup-button confirm'" @click="submitThenClose">确认</div>
      </div>
    </div>
  </van-popup>
</template>

<script>
  import { fromContractUnit, toContractUnit, toHexString,SideEnum,OpenType } from '../../../utils/contractUtil'
  import { fck } from '../../../utils/utils'
  import { UnitTypeEnum } from '../../../store/modules/contract'
  import { UserProcessStatus } from '../../../store/modules/user'

export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    type: {
      type: Number,
      default: 0
    },
    extraData: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      SideEnum,
      OpenType,
      showError: false,
      errorMsg: '',
      showPopup: this.show,
      sideType: this.type, // 0 1
      openData: Object.assign({}, this.extraData),
      entrustTypeConfig: [
        { text: '市价委托', value: 0},
        { text: '限价委托', value: 1 }
      ],
      unitConfig: [
        {text: 'USDT', value: 0},
        {text: 'BTC', value: 1}
      ]
    }
  },
  watch: {
    show () {

      this.showPopup = this.show
      if(this.showPopup){
        this.sideType = this.type
        this.showError = false
        this.errorMsg = ''
        this.le
        this.$store.dispatch('contract/getSpotPrice')
        this.$store.dispatch('contract/getSysOpenUpperBound', {side: this.extraData.side})
      }
    },
    extraData: {
      deep: true,
      immediate: true,
      handler () {
        this.openData = Object.assign({}, this.openData, {...this.extraData})
      }
    },
    '$store.state.contract.curPairKey' : {
      handler (val) {
        this.unitConfig[1].text = this.curPair.key
      },
      immediate: true,
      deep: true
    },
    '$store.state.contract.contractData.sysOpenUpperBound': {
      handler () {
        this.openData.size = this.checkAndGetMaxBound()
      },
      immediate: true,
      deep: true
    }
  },
  computed: {
    curSpotPrice () {
      return this.$store.state.contract.curSpotPrice
    },
    curPair () {
      const {curPairKey, pairs} = this.$store.state.contract
      return pairs.find(pair => pair.key === curPairKey)
    },
    sysOpenUpperBound () {
      return this.$store.state.contract.contractData.sysOpenUpperBound
    },
    confirmDisabled(){
      return this.checkAndGetMaxBound() <= 0
    },
    size () {
      return this.checkAndGetMaxBound()
    }
  },
  methods: {
    close () {
      this.$emit('closeOpenPopup', false, this.openType)
    },
    submitThenClose () {

      const size = this.checkAndGetMaxBound()

      if(size <= 0) {
        return
      }

      const leverage = this.openData.leverage
      let price = null
      if (this.openData.entrustType === OpenType.MarketOrder) {
        price = fromContractUnit(this.curSpotPrice)
      } else {
        price = this.openData.amount
      }

      this.close()

      this.$userProcessBox({status: UserProcessStatus.waiting, msg: '交易执行中,请等待'})

      this.$store.dispatch('contract/openPosition', {
        side: this.openData.side,
        size: toContractUnit(size),
        openType: this.openData.entrustType,
        price: toContractUnit(price),
        leverage: toContractUnit(leverage)
      }).then(() => {
        this.$userProcessBox({status: UserProcessStatus.success, msg: '开仓成功'})
      }).catch((msg) => {
        this.$userProcessBox({status: UserProcessStatus.failed, msg: '开仓失败'})
      })

    },
    checkAndGetMaxBound () {
      const {size, side, unit, entrustType} = this.extraData

      if(side === SideEnum.HEDGE) {
        return size
      }

      if(entrustType !== OpenType.MarketOrder) {
        return size
      }

      const self = this;
      if(!this.sysOpenUpperBound){
        return 0
      }

      if(unit === UnitTypeEnum.USDT){
        if (size > fromContractUnit(this.sysOpenUpperBound.size)) {

          self.showError = true
          self.errorMsg = `当前流动性处于限仓状态，您最多可以开仓 ${fck(this.sysOpenUpperBound.size, -8)} USDT`
          return fromContractUnit(this.sysOpenUpperBound.size)
        }
      } else {
        if (size > fromContractUnit(this.sysOpenUpperBound.amount)) {

          self.showError = true
          self.errorMsg = `当前流动性处于限仓状态，您最多可以开仓 ${fck(this.sysOpenUpperBound.size, -8)}${self.unitConfig[self.openData.unit].text}`

          return fromContractUnit(this.sysOpenUpperBound.amount)
        }
      }

      this.showError = false
      this.errorMsg = ''

      return size
    }
  }
}
</script>

<style lang="less" scoped>
  .derify-popup .error-notice {
    line-height: 2rem;
    border-radius: 1rem;
    margin: 0 0 2rem 0;
    border: 0.1rem solid #EA446B;
    position: relative;
    color: #EA446B;
    padding: 4px 2.5rem 4px 0.5rem;
    font-size: 0.1rem;
    .error-right{
      position: absolute;
      right: 0;
      top: 0.4rem;
      display: inline-block;
      padding-right: 1rem;
    }
  }
</style>
