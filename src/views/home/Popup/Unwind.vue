<template>
  <van-popup class="derify-popup" v-model="showPopup" round :closeable="false" @close="close">
    <div class="unwind-popup system-popup">
      <div class="system-popup-title">平仓</div>
      <div style="margin-top: 2rem">
          <div class="system-popup-price">
            <div class="fc-45">开仓量</div>
            <div>
              <span class="fc-85">{{position.size | fck(-8)}}</span>
              <span class="fc-45">{{getPairByAddress(position.token).key}}</span>
            </div>
          </div>
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
        <div class="system-popup-input-title">平仓量</div>
        <div class="system-popup-input">
          <van-field class="derify-input no-padding-hor" placeholder="0.00" type="number" v-model="value1" />
          <div class="unit">{{getPairByAddress(position.token).key}}</div>
        </div>
        <div class="unwind-popup-set">
          <div class="unwind-popup-set-item" :class="curPercent === percent.value ? 'active' : ''"
               @click="changePercentage(percent.value)" v-for="percent in percents" :key="percent.value">{{percent.name}}</div>
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
  import { fromContractUnit, toContractUnit } from '../../../utils/contractUtil'
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
    console.log('unwind popup', this.extraData)

    const defaultPercent = 100
    const size = this.extraData == null ? 0 : this.extraData.size

    const value1 = Math.ceil(size * defaultPercent / 100)
    return {
      showPopup: this.show,
      value1: fromContractUnit(this.closeUpperBound),
      position: Object.assign({size : 0}, this.extraData),
      percents: [
        {name: '25%', value: 25},
        {name: '50%', value: 50},
        {name: '75%', value: 75},
        {name: '100%', value: 100}
      ],
      curPercent: defaultPercent
    }
  },
  computed: {
    closeUpperBound () {
      return this.$store.state.contract.contractData.closeUpperBound.size
    }
  },
  watch: {
    show () {
      this.showPopup = this.show
      this.$store.dispatch("contract/getCloseUpperBound", {token: this.extraData.token, side: this.extraData.side}).then((closeUpperBound) => {

        if(!closeUpperBound) {
          return
        }

        this.value1 = fromContractUnit(closeUpperBound.size)
      })
    },
    extraData: {
      deep: true,
      immediate: true,
      handler () {
        this.position = this.extraData
        this.value1 = fromContractUnit(Math.ceil(this.closeUpperBound * this.curPercent / 100))
      }
    }
  },
  methods: {
    close () {
      this.$emit('closeUnwindPopup', false)
    },
    changePercentage (percent) {
      this.curPercent = percent
      this.value1 = fromContractUnit(Math.ceil(this.closeUpperBound * this.curPercent / 100))
    },
    submitThenClose (){
      const size = this.value1
      const side = this.position.side
      const token = this.position.token

      if(size > fromContractUnit(this.closeUpperBound)) {
        this.$toast('超出最大可平量，请重新设置')
        return
      }

      if(size <= 0) {
        this.$toast('输入数量有误，请重新输入')
        return
      }

      this.$userProcessBox({status: UserProcessStatus.waiting, msg: '交易执行中,请等待'})
      this.$store.dispatch('contract/closePosition', {
        token,
        side,
        size: toContractUnit(size)
      }).then(() => {
        this.$userProcessBox({status: UserProcessStatus.success, msg: '交易执行成功'})
      }).catch((msg) => {
        this.$userProcessBox({status: UserProcessStatus.failed, msg: '交易执行失败:' + msg})
      })

      this.close()
    },
    getPairByAddress (token) {
      const pair = this.$store.state.contract.pairs.find((pair) => pair.address === token)
      if(!pair){
        return {name: 'unknown', key: 'unknown'}
      }

      return pair
    },

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
</style>
