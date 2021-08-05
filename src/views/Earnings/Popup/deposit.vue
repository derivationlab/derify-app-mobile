<template>
  <van-popup class="derify-popup" v-model="showPopup" round :closeable="false" @close="close">
    <div class="unwind-popup system-popup">
      <div class="system-popup-title">兑换bDRF</div>
      <div>
        <div>
          <van-dropdown-menu :overlay="false" class="derify-dropmenus">
            <van-dropdown-item v-model="accountType" :options="option1"
                               class="derify-dropmenu-item" @open="onDropDowOpen" @change="exchangeBondSizeUpperBound">
                <div class="derify-dropmenu-title" slot="title">
                  <span>{{accountOptions[accountType].text}}</span>
                  <van-icon name="arrow-down" size="1.8rem" color="rgba(255, 255, 255, .85)" />
                </div>
            </van-dropdown-item>
          </van-dropdown-menu>
        </div>
        <div class="popup-text">兑换数量</div>
        <div class="system-popup-input">
          <van-field class="derify-input no-padding-hor fz-17" placeholder="0.8" type="number" v-model="amount" @input="checkAmount"/>
          <div class="unit">bDRF</div>
        </div>
        <div class="system-popup-num">
          <span class="popup-span1">可兑换：{{exchangeBondSizeUpperBound | fck(-8, 4)}} bDRF</span>
          <span class="popup-span2" @click="
          () => {
            this.amount = fck(exchangeBondSizeUpperBound, -8, 4)
          }">全部兑换</span>
        </div>
      </div>
      <div class="system-popup-buttons">
        <div class="system-popup-button cancel" @click="close">取消</div>
        <template v-if="amount > 0">
          <div class="system-popup-button confirm" @click="submitThenClose">兑换</div>
        </template>
        <template v-else>
          <div class="system-popup-button disabled-btn" @click="submitThenClose">兑换</div>
        </template>
      </div>
    </div>
  </van-popup>
</template>

<script>
import { toContractUnit,fromContractUnit } from '@/utils/contractUtil'
import {UserProcessStatus} from "@/store/modules/user"
import {fck} from '@/utils/utils';

export default {
  props: ['show', 'withdrawId'],
  data () {
    return {
      showPopup: this.show,
      accountType: 0,
      amount: 0,
      curPercent: 25,
      withdrawName: null,
      accountOptions: [
        { text: 'Derify账户', value: 0 },
        { text: '钱包账户', value: 1 }
      ]
    }
  },
  computed: {
    exchangeBondSizeUpperBound () {
      return this.$store.state.earnings.exchangeBondSizeUpperBound
    }
  },
  watch: {
    show () {
      this.showPopup = this.show
      this.updateExchangeBondSizeUpperBound()
    },
    withdrawId () {
      if (this.withdrawId === 1) {
        this.withdrawName = 'USDT'
      } else if (this.withdrawId === 2) {
        this.withdrawName = 'eDRF'
      } else {
        this.withdrawName = 'bDRF'
      }
    },
    '$store.state.earnings.exchangeBondSizeUpperBound': function (){
      this.resetAmount()
    }
  },
  methods: {
    close () {
      this.$emit('closeDeposit', false)
    },
    submitThenClose () {

      if(!this.checkAmount()) {
        return
      }

      this.close()
      this.$userProcessBox({status: UserProcessStatus.waiting, msg: '正在执行交易,请稍后'})

      this.$store.dispatch("earnings/exchangeBond", {bondAccountType: this.accountType ,amount: toContractUnit(this.amount)}).then( r => {
        this.$userProcessBox({status: UserProcessStatus.waiting, msg: '交易执行成功'})
      }).catch(e => {
        this.close()
      }).finally( p => {
        this.$userProcessBox({status: UserProcessStatus.waiting, msg: '交易执行失败'})
      })
    },
    onDropDowOpen () {
      return document.querySelector(".derify-dropmenu-item .van-dropdown-item").style.top = "150px"
    },
    updateExchangeBondSizeUpperBound() {
      this.$store.dispatch("earnings/getExchangeBondSizeUpperBound", {bondAccountType: this.accountType})
    },
    resetAmount () {
      this.amount = Math.min(this.amount, fromContractUnit(this.exchangeBondSizeUpperBound))
    },
    checkAmount () {
      if(toContractUnit(this.amount) > this.exchangeBondSizeUpperBound) {
        this.$toast('超出限额，请重新输入')
        return false
      }

      return true
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
