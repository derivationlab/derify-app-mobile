<template>
  <van-popup class="derify-popup" v-model="showPopup" round :closeable="false" @close="close">
    <div class="unwind-popup system-popup">
      <div class="system-popup-title">质押{{pledgeName}}</div>
      <div>
        <div class="derify-dropmenu-wrap">
          <van-dropdown-menu :overlay="false" class="derify-dropmenus">
            <van-dropdown-item v-model="accountType" :options="accountOptions" @change="updateTokenBalance"  @open="onDropDowOpen()" class="derify-dropmenu-item">
                <div class="derify-dropmenu-title" slot="title">
                  <span>{{accountOptions[accountType].text}}</span>
                  <van-icon name="arrow-down" size="1.8rem" color="rgba(255, 255, 255, .85)" />
                </div>
            </van-dropdown-item>
          </van-dropdown-menu>
        </div>
        <div class="popup-text">质押数量</div>
        <div class="system-popup-input">
          <van-field class="derify-input no-padding-hor fz-17" placeholder="0.8" type="number" v-model="amount" />
          <div class="unit">{{pledgeName}}</div>
        </div>
        <div class="system-popup-num">
          <span class="popup-span1">可质押：{{maxPledgeAmout|fck(-8,4)}} {{pledgeName}}</span>
          <span class="popup-span2" @click="exchangeAll">全部质押</span>
        </div>
      </div>
      <div class="system-popup-buttons">
        <div class="system-popup-button cancel" @click="close">取消</div>

        <template v-if="amount > 0">
          <div class="system-popup-button confirm" @click="submitThenClose">质押</div>
        </template>
        <template v-else>
          <div class="system-popup-button disabled-btn">质押</div>
        </template>
      </div>
    </div>
  </van-popup>
</template>

<script>
import { BondAccountType, fromContractUnit, toContractUnit } from '../../../utils/contractUtil'
import { UserProcessStatus } from '../../../store/modules/user'
import { fck } from '../../../utils/utils'
import { EarningType } from '../../../store/modules/earnings'

export default {
  props: ['show', 'pledgeId'],
  data () {
    return {
      showPopup: this.show,
      accountType: BondAccountType.DerifyAccount,
      amount: 0,
      curPercent: 25,
      pledgeName: null,
      accountOptions: [
        { text: 'Derify账户', value: 0 },
        { text: '钱包账户', value: 1 }
      ]
    }
  },
  watch: {
    show () {
      this.showPopup = this.show
      this.updateTokenBalance()
    },
    pledgeId () {
      if (this.pledgeId === EarningType.EDRF) {
        this.pledgeName = 'eDRF'
      } else if(this.pledgeId === EarningType.BDRF) {
        this.pledgeName = 'bDRF'
      }
    }
  },
  computed: {
    maxPledgeAmout () {
      if(this.pledgeId === EarningType.EDRF) {
        return 0
      }else if(this.pledgeId === EarningType.BDRF) {
        if(this.accountType === BondAccountType.DerifyAccount){
          return this.$store.state.earnings.bondInfo.bondBalance
        }else{
          return this.$store.state.earnings.wallet.bdrfBalance
        }

      }
      return 0
    }
  },
  methods: {
    close () {
      this.$emit('closePledge', false)
    },
    submitThenClose(){

      if(this.amount > fromContractUnit(this.maxPledgeAmout)) {
        this.$toast('超出限额，请重新输入')
        return
      }

      if (this.pledgeId === EarningType.EDRF) {
        //eDRF

      } else if(this.pledgeId === EarningType.BDRF) {
        this.close()
        this.$userProcessBox({status: UserProcessStatus.waiting, msg: '正在执行交易,请稍后'})
        this.$store.dispatch("earnings/depositBondToBank", {bondAccountType: this.accountType, amount: toContractUnit(this.amount)})
          .then(() => {
            this.$userProcessBox({status: UserProcessStatus.success, msg: '交易执行成功'})
          }).catch(() => {
          this.$userProcessBox({status: UserProcessStatus.failed, msg: '交易执行失败'})
        }).finally(() => {
          this.$store.dispatch('earnings/loadEarningData')
        })
      }
    },
    exchangeAll () {
      this.amount = fck(this.exchangeBondSizeUpperBound, -8, 4)
    },
    onDropDowOpen () {
      return document.querySelector(".derify-dropmenu-item .van-dropdown-item").style.top = "150px"
    },
    updateTokenBalance() {
      const earningTokenMap = {}
      earningTokenMap[EarningType.EDRF] = 'eDRF'
      earningTokenMap[EarningType.BDRF] = 'bDRF'

      if(this.accountType === BondAccountType.WalletAccount) {
        this.$store.dispatch('earnings/getWalletBalance', {tokenName: earningTokenMap[this.pledgeId]})
      }

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
