<template>
  <div class="home-container page-container">
    <navbar :title="$t('Trade.Account.MarginAccount.MarginAccount')" :showGoback="true" :logo="false"/>

    <div class="account-num">
      <span class="num">{{$t('Trade.Account.MarginAccount.AccountBalance')}}</span>
      <span class="info fc-yellow" @click="lookFinDetail">{{$t('Trade.Account.MarginAccount.BalanceHistory')}} ></span>
    </div>
    <div class="account-info">
      <div class="div-unmUnit">
        <DecimalView :value="fck(accountData.balance, -8)" digit-split="," last-style="font-size: 2rem;font-weight: lighter"/>
      </div>
    </div>
    <div class="title-div">
      <span>{{$t('Trade.Account.MarginAccount.MarginBalance')}}</span>
      <span>{{$t('Trade.Account.MarginAccount.Margin')}}</span>
    </div>
    <div class="unit-tr">
      <div>
        <DecimalView wrapStyle="color: rgba(255,255,255,1)" digit-split="," :value="accountData.marginBalance | fck(-8,2)"/>
        <span> {{ usdTokenName }}</span>
      </div>
      <div>
        <DecimalView wrapStyle="color: rgba(255,255,255,1)" digit-split="," :value="accountData.totalMargin | fck(-8)"/>
        <span> {{ usdTokenName }}</span>
      </div>
    </div>
    <template v-if="isLogin">
      <div class="recharge" @click="goTransfer('deposit')">{{$t('Trade.Account.MarginAccount.Deposit')}}</div>
      <div class="withdraw" @click="goTransfer('withdraw')">{{$t('Trade.Account.MarginAccount.Withdraw')}}</div>
    </template>
    <template v-if="!isLogin">
      <div class="recharge" @click="$loginWallet()">{{$t('Trade.Wallet.ConnectWallet')}}</div>
    </template>
  </div>
</template>
<script>
import Navbar from '@/components/Navbar'
import { EVENT_WALLET_CHANGE } from '../../utils/web3Utils'
import DecimalView from '../../components/DecimalView/DecimalView'
import {fck} from '../../utils/utils'
import { getUSDTokenName } from '@/config'

const state = {
  marginBalance: 0,
  totalMargin: 0,
  balance: 0,
  fck: fck
}
export default {
  name: 'account',
  components: {
    DecimalView,
    Navbar
  },
  data () {
    return state
  },
  computed: {
    accountData () {
      return this.$store.state.contract.accountData
    },
    isLogin () {
      return this.$store.state.user.isLogin
    },
    usdTokenName(){
      return getUSDTokenName();
    }
  },
  watch: {
    '$store.state.user.isLogin': function(newVal, oldVal) {
      console.log('$store.state.user.isLogin change, new=' + newVal + ',old=' + oldVal)
      this.loadAccountData()
    }
  },
  created () {
    this.$store.dispatch('contract/onDeposit');
    this.$store.dispatch('contract/onWithDraw');

    this.$eventBus.$on(EVENT_WALLET_CHANGE, () => {
      console.log('account wallet change')
      this.loadAccountData()
    })
  },
  beforeMount () {
    this.loadAccountData()
  },
  methods: {
    lookFinDetail () {
      this.$router.push({ path: '/financialDetails' })
    },
    goTransfer (type) {
      this.$router.push({ path: '/transfer', query: { type } })
    },
    loadAccountData () {
      this.$store.dispatch('contract/loadAccountData').then(r => {
        Object.assign(state, r)
      })
    },
    onClickLeft() {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="less" scoped>
.account-num{
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1.3rem 0;
  .num{
    font-size: 15px;
    font-weight: 400;
    text-align: left;
    color: rgba(255,255,255,0.65);
  }
  .info{
    font-size: 12px;
    font-weight: 400;
    text-align: RIGHT;
  }
}
.account-info{
  display: flex;
  justify-content: space-between;
  align-items: center;
  .div-unmUnit{
    font-size: 3rem;
    font-weight: 700;
    color: #fae247;
    margin: 1.2rem 0 2.4rem 0;
    .unit{
      font-size: 13px;
      font-weight: 400;
      color: rgba(255,255,255,0.65);
    }
  }
  .unm{
    font-size: 1.3rem;
    font-weight: 400;
    color: #00c49a;
  }
}
.title-div{
  display: flex;
  // text-align: center;
  span{
    flex: 1;
    font-size: 12px;
    font-weight: 400;
    color: rgba(255,255,255,0.45);
  }
}
.unit-tr{
  display: flex;
  margin: .8rem 0;
  // text-align: center;
  div{
    flex: 1;
    span{
      font-size: 11px;
      font-weight: 400;
      color: rgba(255,255,255,0.45);
    }
  }
}
.recharge{
  height: 4.8rem;
  background: linear-gradient(180deg,#fae55e, #f7d042 100%);
  border-radius: 2.4rem;
  line-height: 4.8rem;
  text-align: center;
  margin: 4rem 0;
  color: #140B32;
}
.withdraw{
  height: 4.8rem;
  border: .1rem solid #f7d042;
  border-radius: 2.4rem;
  line-height: 4.8rem;
  text-align: center;
  margin: 4rem 0;
  color: #f7d042;
}
</style>
