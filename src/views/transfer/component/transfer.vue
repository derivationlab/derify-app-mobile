<template>
  <div class="home-container page-container">
    <van-nav-bar
      :title="$t('Trade.Account.Transfers')"
      left-arrow
      :border="false"
      :fixed="true"
      @click-left="onClickLeft"
    >
      <template #left>
        <van-icon name="arrow-left" color="rgba(255, 255, 255, .85)" size="2.4rem"></van-icon>
      </template>
    </van-nav-bar>
    <div class="from-div">From</div>
    <van-cell-group>
      <van-field class="derify-input no-padding-hor" :placeholder="type === 'deposit' ? 'Metamask Wallet' : 'Derify Account'" :border='false' />
    </van-cell-group>
    <div class="to-div" @click="changeType"><span class="span1">to</span><van-icon class="span2" name="exchange" size="2rem"/></div>
    <van-cell-group>
      <van-field class="derify-input no-padding-hor" :placeholder="type === 'deposit' ? 'Derify Account' : 'Metamask Wallet'" />
    </van-cell-group>
    <div class="num-div">{{$t('Trade.Account.Size')}}</div>
    <van-cell-group>
      <van-field
        v-model="amount"
        class="derify-input no-padding-hor"
        type="number"
      >
      </van-field>
      <span class="unit">DUSD</span>
    </van-cell-group>
    <div class="transfer-div"><span class="span1">{{$t('Trade.Account.Amount')}}
      <template v-if="type === 'deposit'">{{balanceOfWallet | fck(-8)}}</template>
      <template v-if="type === 'withdraw'">{{balanceOfDerify | fck(-8)}}</template>DUSD</span><span class="span2" @click="transferAll">{{$t('Trade.Account.All')}}</span></div>
    <div :class="amount > 0 ? 'pay-div' : 'pay-div disabled'" v-if="type === 'deposit'" @click="deposit">{{$t('Trade.Account.Deposit')}}</div>
    <div :class="amount > 0 ? 'pay-div' : 'pay-div disabled'" v-if="type === 'withdraw'" @click="withdraw">{{$t('Trade.Account.Withdraw')}}</div>
  </div>
</template>
<script>
  import { fromContractUnit, toContractUnit } from '../../../utils/contractUtil'
import { UserProcessStatus } from '../../../store/modules/user'
import {toContractNum} from "@/utils/contractUtil";

export default {
  name: 'transfer',
  data () {
    return {
      amount: '',
      type: 'deposit'
    }
  },
  computed: {
    account () {
      return this.$store.state.contract.accountData
    },
    balanceOfWallet () {
      return this.$store.state.user.balanceOfDUSD
    },
    balanceOfDerify () {
      return this.$store.state.contract.accountData.availableMargin
    },
  },
  mounted () {
    this.type = (this.$route.query && this.$route.query.type) || 'deposit'
  },
  watch: {
    '$store.state.user.selectedAddress':{
      handler () {
        if(this.$store.state.user.selectedAddress) {
          this.$store.dispatch('user/getBalanceOfDUSD')
        }
      },
      immediate: true
    }
  },
  methods: {
    onClickLeft () {
      this.$router.go(-1)
    },
    changeType () {
      this.type = this.type === 'deposit' ? 'withdraw' : 'deposit'
    },

    transferAll () {
      if(this.type === 'deposit') {
        this.amount = fromContractUnit(this.balanceOfWallet)
      }

      if(this.type === 'withdraw') {
        this.amount = this.amount = fromContractUnit(this.balanceOfDerify)
      }
    },
    deposit () {
      if (!this.amount) {
        this.$toast(this.$t('Trade.Account.AmountExceedsError'))
        return false
      }


      const a = parseFloat(this.amount)
      const amount = toContractUnit(a)

      if(toContractNum(this.amount) > this.balanceOfWallet) {
        this.$toast(this.$t('Trade.Account.AmountExceedsError'))
        return  false
      }

      const self = this
      this.$userProcessBox({status: UserProcessStatus.waiting, msg: self.$t('Trade.Account.TradePendingMsg')});
      this.$store.dispatch('contract/depositAccount', amount).then(_ => {
        self.$userProcessBox({status: UserProcessStatus.success, msg: self.$t('Trade.Account.TradeSuccessMsg')});
      }).catch(e => {
        self.$userProcessBox({status: UserProcessStatus.failed, msg: self.$t('Trade.Account.TradeFailedMsg')})
      }).finally(_ => {
        self.$router.go(-1)
      })
    },
    withdraw () {
      if (!this.amount) {
        this.$toast(this.$t('global.NumberError'))
        return false
      }

      if(toContractNum(this.amount) > this.account.marginBalance) {
        this.$toast(this.$t('global.NumberError'))
        return  false
      }

      const a = parseFloat(this.amount)
      const amount = toContractUnit(a)
      this.$userProcessBox({status: UserProcessStatus.waiting, msg: this.$t('Trade.Account.TradePendingMsg')});

      const self = this
      this.$store.dispatch('contract/withdrawAccount', amount).then(_ => {
        self.$userProcessBox({status: UserProcessStatus.success, msg: self.$t('Trade.Account.TradeSuccessMsg')})
      }).catch(err => {
        self.$userProcessBox({status: UserProcessStatus.failed, msg:  self.$t('Trade.Account.TradeFailedMsg')})
      }).finally(() => {
        self.$router.go(-1)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.from-div{
  font-size: 1.2rem;
  font-weight: 400;
  color: rgba(255,255,255,0.45);
  margin-top: 4rem;
  margin-bottom: 1.8rem;
}
.to-div{
  margin: 1.9rem 0;
  display: flex;
  justify-content: space-between;
  .span1{
    font-size: 1.2rem;
    font-weight: 400;
    color: rgba(255,255,255,0.45);
  }
  .span2{
    color: #FAE55E;
    margin-right: 1rem;
  }
}
.num-div{
  font-size: 1.2rem;
  font-weight: 400;
  color: rgba(255,255,255,0.65);
  margin-top: 1.9rem;
  margin-bottom: 1rem;
}
.transfer-div{
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  .span1{
    font-size: 1.2rem;
    font-weight: 400;
    color: rgba(255,255,255,0.65);
  }
  .span2{
    font-size: 1.2rem;
    font-weight: 400;
    color: #fae247;
  }
}
.pay-div{
  height: 4.8rem;
  line-height: 4.8rem;
  text-align: center;
  opacity: 1;
  background: linear-gradient(180deg,#fae55e, #f7d042 100%);
  border-radius: 2.4rem;
  color: #140b32;
  font-size: 1.7rem;
  font-weight: 500;
  margin-top: 9rem;
  &.disabled {
    color: #e0e0e0;
    background: #ccc;
  }
}

.van-cell-group {
  background-color: #140b32;
}
.unit{
  position: absolute;
  right: 1rem;
  top: 2rem;
  font-size: 1.4rem;
  font-weight: 400;
  color: rgba(255,255,255,0.65);
}
.van-cell-group::after{
  border: 0;
  border-bottom: .1rem solid #eeeeee;
}
.van-cell::after{
  border: 0;
}
/deep/.van-field__control{
  font-size: 1.7rem;
  color: rgba(255,255,255,0.85);
}
</style>
