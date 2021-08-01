<template>
  <van-popup class="derify-popup" v-model="showPopup" round :closeable="false" @close="close">
    <div class="system-popup" v-if="openData">
      <div class="system-popup-title">开仓确认</div>
      <div class="system-popup-price">
        <div class="fc-45">委托价格</div>
        <div v-if="openData.entrustType === 1">
          <span class="fc-85">{{openData.amount}}</span>
          <span class="fc-45">USDT</span>
        </div>
        <div v-else>
          <span class="fc-85">{{curSpotPrice | fck(-8,2)}}</span>
          <span class="fc-45">USDT</span>
        </div>
      </div>
      <div class="system-popup-price">
        <div class="fc-45">开仓类型</div>
        <div v-if="openType === 1">
          <span class="fc-red">开空</span>
          <span class="fc-red">{{openData.leverage}}x</span>
        </div>
        <div v-if="openType === 0">
          <span class="fc-green">开多</span>
          <span class="fc-green">{{openData.leverage}}x</span>
        </div>
        <div v-if="openType === 2">
          <span class="fc-yellow">双向对冲</span>
          <span class="fc-yellow">{{openData.leverage}}x</span>
        </div>
      </div>
      <div class="system-popup-price">
        <div class="fc-45">开仓量</div>
        <div>
          <span class="fc-85">{{openData.size}}</span>
          <span class="fc-45">{{unitConfig[openData.unit].text}}</span>
        </div>
      </div>
      <div class="system-popup-price">
        <div class="fc-45">动仓费</div>
        <div>
          <span class="fc-85">{{openData.positionChangeFee}}</span>
          <span class="fc-45">USDT</span>
        </div>
      </div>
      <div class="system-popup-price">
        <div class="fc-45">手续费</div>
        <div>
          <span class="fc-85">{{openData.tradingFee}}</span>
          <span class="fc-45">USDT</span>
        </div>
      </div>
      <div class="system-popup-buttons">
        <div class="system-popup-button cancel" @click="close">取消</div>
        <div class="system-popup-button confirm" @click="submitThenClose">确认</div>
      </div>
    </div>
  </van-popup>
</template>

<script>
  import { fromContractUnit, toContractUnit, toHexString } from '../../../utils/contractUtil'

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
      showPopup: this.show,
      openType: this.type, // 0 1
      openData: this.extraData,
      entrustTypeConfig: [
        { text: '市价委托', value: 0},
        { text: '限价委托', value: 1 }
      ],
      leverageConfig: [10, 5, 3],
      unitConfig: [
        {text: 'USDT', value: 0},
        {text: 'ETH', value: 1},
        {text: '%', value: 2}
      ]
    }
  },
  watch: {
    show () {
      this.openType = this.type
      this.showPopup = this.show

      this.$store.dispatch('contract/getSpotPrice')
    },
    extraData: {
      deep: true,
      immediate: true,
      handler () {
        Object.assign(this.openData, {...this.extraData})
      }
    },
    '$store.state.contract.curPairKey' : {
      handler (val) {
        this.unitConfig[1].text = this.curPair.key
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
    }
  },
  methods: {
    close () {
      this.$emit('closeOpenPopup', false, this.openType)
    },
    submitThenClose () {
      const size = this.openData.size
      const leverage = this.openData.leverage
      let price = null
      if (this.openData.entrustType === 0) {
        price = fromContractUnit(this.curSpotPrice)
      } else {
        price = this.openData.amount
      }

      this.$store.dispatch('contract/openPosition', {
        side: this.openData.side,
        size: toContractUnit(size),
        openType: this.openData.entrustType,
        price: toContractUnit(price),
        leverage: toContractUnit(leverage)
      })
      this.close()
    }
  }
}
</script>

<style lang="less" scoped>
</style>
