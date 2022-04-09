<template>
  <van-popup class="derify-popup" v-model="showPopup" round :closeable="false" @close="close">
    <div class="unwind-popup system-popup">
      <div class="system-popup-title">{{ $t('Trade.MyPosition.ClosePositionPopup.Close') }}</div>
      <DerifyErrorNotice @close="errorNotice" :show="showError">
        {{errorMsg}}
      </DerifyErrorNotice>
      <div style="margin-top: 2rem">
          <div class="system-popup-price">
            <div class="fc-45">{{ $t('Trade.MyPosition.ClosePositionPopup.PositionHeld') }}</div>
            <div>
              <span class="fc-85">{{position.size | fck(-8, 8)}}</span>
              <span class="fc-45">{{getPairByAddress(position.token).key}}</span>
            </div>
          </div>
          <div class="system-popup-price">
            <div class="fc-45">{{ $t('Trade.MyPosition.ClosePositionPopup.AveragePrice') }}</div>
            <div>
              <span class="fc-85">{{position.averagePrice | fck(-8)}}</span>
              <span class="fc-45">{{usdTokenName }}</span>
            </div>
          </div>
          <div class="system-popup-price">
            <div class="fc-45">{{ $t('Trade.MyPosition.ClosePositionPopup.CurrentPrice') }}</div>
            <div>
              <span class="fc-green">{{position.spotPrice | fck(-8)}}</span>
              <span class="fc-45">{{usdTokenName }}</span>
            </div>
          </div>
      </div>
      <div class="system-popup-input-block">
        <div class="system-popup-input-title">{{ $t('Trade.MyPosition.ClosePositionPopup.Amount') }}</div>
        <div class="system-popup-input">
          <van-field class="derify-input no-padding-hor" placeholder="" :formatter="(value) => value.replace(/-/g, '')" type="number" @input="onPositionSizeChange" v-model="value1" />
          <div class="unit">{{getPairByAddress(position.token).key}}</div>
        </div>
        <div class="unwind-popup-set">
          <div class="unwind-popup-set-item" :class="curPercent === percent.value ? 'active' : ''"
               @click="changePercentage(percent.value)" v-for="percent in percents" :key="percent.value">{{percent.name}}</div>
        </div>
      </div>
      <div class="system-popup-buttons">
        <div class="system-popup-button cancel" @click="close">{{ $t('Trade.MyPosition.ClosePositionPopup.Cancel') }}</div>
        <div :class="closeUpperBound > 0 ? 'system-popup-button confirm' : 'system-popup-button disabled-btn'" @click="submitThenClose">{{ $t('Trade.MyPosition.ClosePositionPopup.Confirm') }}</div>
      </div>
    </div>
  </van-popup>
</template>

<script>
  import {fromContractUnit, toContractUnit} from '@/utils/contractUtil'
  import {UserProcessStatus} from '@/store/modules/user'
  import DerifyErrorNotice from '../../../components/DerifyErrorNotice/DerifyErrorNotice'
  import {getUSDTokenName} from '@/config'

export default {
  components: {DerifyErrorNotice},
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
    const defaultPercent = 100
    const size = this.extraData == null ? 0 : this.extraData.size

    const value1 = size * defaultPercent / 100
    return {
      showPopup: this.show,
      errorMsg: '',
      showError: false,
      value1: value1 > 0 ? value1 : '',
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
      return this.$store.state.contract.contractData.closeUpperBound
    },
    usdTokenName(){
      return getUSDTokenName();
    }
  },
  watch: {
    show () {
      this.showPopup = this.show
      this.$store.dispatch("contract/getCloseUpperBound", {token: this.extraData.token, side: this.extraData.side}).then((closeUpperBound) => {

        if(!closeUpperBound) {
          return
        }

        this.value1 = fromContractUnit(closeUpperBound)
      })
    },
    extraData: {
      deep: true,
      immediate: true,
      handler () {
        this.position = this.extraData
        this.value1 = fromContractUnit(this.closeUpperBound * this.curPercent / 100)
      }
    }
  },
  methods: {
    close () {
      this.$emit('closeUnwindPopup', false)
    },
    changePercentage (percent) {
      this.curPercent = percent
      this.value1 = fromContractUnit(this.closeUpperBound * this.curPercent / 100)
    },
    onPositionSizeChange (size) {

      if(size === '') {
        return
      }

      this.curPercent = Math.round(this.value1 * 100 / fromContractUnit(this.closeUpperBound))


      if(size <= 0){
        this.errorNotice(this.$t('global.NumberError'))
        return
      }

      if(size > fromContractUnit(this.closeUpperBound)) {
        this.value1 = fromContractUnit(this.closeUpperBound)
        this.curPercent = 100
        this.errorNotice(this.$t('global.NumberError'))
        return
      }
      this.errorNotice(null)
    },
    submitThenClose (){
      const size = this.value1
      const side = this.position.side
      const token = this.position.token

      if(size > fromContractUnit(this.closeUpperBound)) {
        this.errorNotice(this.$t('global.NumberError'))
        return
      }

      if(size <= 0) {
        this.errorNotice(this.$t('global.NumberError'))
        return
      }

      this.$userProcessBox({status: UserProcessStatus.waiting, msg: this.$t('global.TradePendingMsg')})
      const brokerId = this.$store.state.user.brokerId
      this.$store.dispatch('contract/closePosition', {
        token,
        side,
        size: toContractUnit(size),
        brokerId
      }).then(() => {
        this.$userProcessBox({status: UserProcessStatus.success, msg: this.$t('global.TradeSuccessMsg')})
        this.$store.dispatch('contract/loadPositionData').then(r => {})
      }).catch((msg) => {
        this.$userProcessBox({status: UserProcessStatus.failed, msg: this.$t('global.TradeFailedMsg')})
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
