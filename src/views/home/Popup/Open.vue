<template>
  <van-popup class="derify-popup" v-model="showPopup" round :closeable="false" @close="close">
    <div class="system-popup" v-if="openData">
      <div class="system-popup-title">{{$t('Trade.OpenPosition.OpenPopup.OpenConfirm')}}</div>
      <ErrorNotice :show="showError" @close="() => {this.showError = false}">{{errorMsg}}</ErrorNotice>
      <div class="system-popup-price">
        <div class="fc-45">{{$t('Trade.OpenPosition.OpenPopup.Price')}}</div>
        <div v-if="openData.entrustType === OpenType.LimitOrder && sideType !== SideEnum.HEDGE">
          <span class="fc-85">{{openData.amount}}</span>
          <span class="fc-45">BUSD</span>
        </div>
        <div v-else>
          <span class="fc-85">{{$t('Trade.OpenPosition.OpenPopup.Market')}}</span>
        </div>
      </div>
      <div class="system-popup-price">
        <div class="fc-45">{{$t('Trade.OpenPosition.OpenPopup.Type')}}</div>
        <div v-if="sideType === SideEnum.SHORT">
          <span class="fc-red">{{$t('Trade.OpenPosition.OpenPopup.Short')}}</span>
          <span class="fc-red">{{openData.leverage}}x</span>
        </div>
        <div v-if="sideType === SideEnum.LONG">
          <span class="fc-green">{{$t('Trade.OpenPosition.OpenPopup.Long')}}</span>
          <span class="fc-green">{{openData.leverage}}x</span>
        </div>
        <div v-if="sideType === SideEnum.HEDGE">
          <span class="fc-yellow">{{$t('Trade.OpenPosition.OpenPopup.TwoWay')}}</span>
          <span class="fc-yellow">{{openData.leverage}}x</span>
        </div>
      </div>
      <div class="system-popup-price">
        <div class="fc-45">{{$t('Trade.OpenPosition.OpenPopup.Amount')}}</div>
        <div>
          <span class="fc-85">{{size | amountFormt(4, false, 0)}}</span>
          <span class="fc-45">{{unitConfig[openData.unit].text}}</span>
        </div>
      </div>
      <div class="system-popup-price">
        <div class="fc-45">{{$t('Trade.OpenPosition.OpenPopup.PCF')}}</div>
        <div>
          <span :class="'fc-85 ' + (-openData.positionChangeFee >= 0 ? 'fc-green' : 'fc-red')">{{-openData.positionChangeFee | amountFormt(4, true, 0)}}</span>
          <span class="fc-45">BUSD</span>
        </div>
      </div>
      <div class="system-popup-price">
        <div class="fc-45">{{$t('Trade.OpenPosition.OpenPopup.TradFee')}}</div>
        <div>
          <span class="fc-85">{{-openData.tradingFee | amountFormt(4, true, 0)}}</span>
          <span class="fc-45">BUSD</span>
        </div>
      </div>
      <div class="system-popup-buttons">
        <div class="system-popup-button cancel" @click="close">{{$t('Trade.OpenPosition.OpenPopup.Cancel')}}</div>
        <div :class="confirmDisabled ? 'system-popup-button disabled-btn' : 'system-popup-button confirm'" @click="submitThenClose">{{$t('Trade.OpenPosition.OpenPopup.Confirm')}}</div>
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
  convertAmount2TokenSize, toContractNum
} from '../../../utils/contractUtil'
  import { fck } from '../../../utils/utils'
  import { UnitTypeEnum } from '../../../utils/contractUtil'
  import { UserProcessStatus } from '../../../store/modules/user'
import ErrorNotice from '../../../components/DerifyErrorNotice/DerifyErrorNotice'

export default {
  components: { ErrorNotice },
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
      unitConfig: [
        {text: 'BUSD', value: 0},
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
      const {unit} = this.extraData

      this.$userProcessBox({status: UserProcessStatus.waiting, msg: this.$t('global.TradePendingMsg')})

      const brokerId = this.$store.state.user.brokerId
      this.$store.dispatch('contract/openPosition', {
        side: this.openData.side,
        quantityType: unit === UnitTypeEnum.USDT ? 0 : 1,
        size: toContractNum(size),
        openType: this.openData.entrustType,
        price: toContractNum(price),
        leverage: toContractNum(leverage),
        brokerId: brokerId,
      }).then(() => {
        this.$userProcessBox({status: UserProcessStatus.success, msg: this.$t('global.TradeSuccessMsg')})
        this.$store.dispatch('contract/loadPositionData').then(r => {})
      }).catch((msg) => {
        this.$userProcessBox({status: UserProcessStatus.failed, msg: this.$t('global.TradeFailedMsg')})
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
          self.errorMsg = `${this.$t('Trade.OpenPosition.OpenPopup.LiqLimitMsg')} ${fck(this.sysOpenUpperBound.size, -8)} BUSD`
          return fromContractUnit(this.sysOpenUpperBound.size)
        }
      } else {
        if (size > fromContractUnit(this.sysOpenUpperBound.amount)) {

          self.showError = true
          self.errorMsg = `${this.$t('Trade.OpenPosition.OpenPopup.LiqLimitMsg')} ${fck(this.sysOpenUpperBound.size, -8)}${self.unitConfig[self.openData.unit].text}`

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
