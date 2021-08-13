<template>
  <div class="home-container page-container">
    <navbar :title="$t('Rewards.title')" />
      <div class="mining-earnings">
        <div class="earnings-title">
          <span class="span1">{{ $t('Rewards.Mining.PositionMiningReward') }}</span>
          <span class="span2 fz-12" @click="goDetail(EarningType.MIN)">{{ $t('Rewards.Mining.TransactionHistory') }} ></span>
        </div>
        <div class="earnings-num">
          <span class="span1">{{pmrReward | fck(-8, 2)}}</span>
          <span class="span2">USDT</span>
        </div>
        <div class="earnings-info">
          <div class="div1">
            <span class="span1">{{accountData.totalPositionAmount | fck(-8)}}</span>
            <span class="span2 fz-11">{{ $t('Rewards.Mining.PositionHeld') }}（USDT）</span>
          </div>
          <div class="div1">
            <span class="span1">24891.34</span>
            <span class="span2 fz-11">{{ $t('Rewards.Mining.AccumulatedReward') }}（USDT）</span>
          </div>
        </div>
        <div class="earnings-item">
          <div class="item-div">
            <van-icon class="van-icon" name="refund-o" size="18"/>
            <template v-if="isLogin">
              <span class="fz-13" @click="withdraw(true, EarningType.MIN)">{{ $t('Rewards.Mining.Withdraw') }}</span>
            </template>
            <template v-else>
              <span class="fz-13" @click="$loginWallet()">{{$t('global.ClickConnectWallet')}}</span>
            </template>
          </div>
        </div>
      </div>
      <div class="mining-earnings">
        <div class="earnings-title">
          <span class="span1">{{ $t('Rewards.Staking.StakEquity') }}</span>
          <span class="span2 fz-12" @click="goDetail(EarningType.EDRF)">{{ $t('Rewards.Staking.TransactionHistory') }}></span>
        </div>
        <div class="earnings-num">
          <span class="span1">2345.4</span>
          <span class="span2">eDRF</span>
        </div>
        <div class="earnings-info">
          <div class="div1">
            <span class="span1">24891.34</span>
            <span class="span2 fz-11">{{ $t('Rewards.Staking.StakAmount') }}（EDRF）</span>
          </div>
          <div class="div1">
            <span class="span1">24891.34</span>
            <span class="span2 fz-11">{{ $t('Rewards.Staking.AccumulatedReward') }}（eDRF）</span>
          </div>
        </div>
        <div class="earnings-item">
          <template v-if="isLogin">
            <div class="item-div flex1">
              <van-icon class="van-icon" name="refund-o" size="18"/>
              <span class="fz-13" @click="withdraw(true,EarningType.EDRF)">{{$t('Rewards.Staking.Withdraw')}}</span>
            </div>
            <div class="item-div flex1">
              <van-icon class="van-icon" name="peer-pay" size="18"/>
              <span class="fz-13" @click="redeem(true,EarningType.EDRF)">{{$t('Rewards.Staking.Redeem')}}</span>
            </div>
            <div class="item-div flex1">
              <van-icon class="van-icon" name="cash-on-deliver" size="18"/>
              <span class="fz-13" @click="pledge(true,EarningType.EDRF)">{{$t('Rewards.Staking.Staking')}}</span>
            </div>
          </template>
          <template v-else>
            <div class="item-div flex1">
              <van-icon class="van-icon" name="refund-o" size="18"/>
              <span class="fz-13" @click="$loginWallet()">{{$t('global.ClickConnectWallet')}}</span>
            </div>
          </template>
        </div>
      </div>
      <div class="mining-earnings">
        <div class="earnings-title">
          <span class="span1">{{$t('Rewards.Bond.Bond')}}</span>
          <span class="span2 fz-12" @click="goDetail(EarningType.BDRF)">{{$t('Rewards.Bond.TransactionHistory')}} ></span>
        </div>
        <div class="earnings-num">
          <span class="span1">{{bondInfo.bondBalance | fck(-8)}}</span>
          <span class="span2">USDT</span>
        </div>
        <div class="earnings-info">
          <div class="div1">
            <span class="span1">{{bondInfo.bondReturnBalance | fck(-8)}}</span>
            <span class="span2 fz-11">{{$t('Rewards.Bond.DepoAmount')}} ( bDRF )</span>
          </div>
          <div class="div1">
            <span class="span1">{{bondInfo.bondAnnualInterestRate | fck(-8,2)}}%</span>
            <span class="span2 fz-11">APY</span>
          </div>
        </div>
        <div class="earnings-item">
          <template v-if="isLogin">
            <div class="item-div flex1">
              <van-icon class="van-icon" name="refund-o" size="18"/>
              <span class="fz-13" @click="withdraw(true,EarningType.BDRF)">{{$t('Rewards.Bond.Withdraw')}}</span>
            </div>
            <div class="item-div flex1">
              <van-icon class="van-icon" name="balance-o" size="18"/>
              <span class="fz-13" @click="deposit(true, EarningType.BDRF)">{{$t('Rewards.Bond.Exchange')}}</span>
            </div>
            <div class="item-div flex1">
              <van-icon class="van-icon" name="peer-pay" size="18"/>
              <span class="fz-13" @click="redeem(true,EarningType.BDRF)">{{$t('Rewards.Bond.Redeem')}}</span>
            </div>
            <div class="item-div flex1">
              <van-icon class="van-icon" name="cash-on-deliver" size="18"/>
              <span class="fz-13" @click="pledge(true,EarningType.BDRF)">{{$t('Rewards.Bond.Staking')}}</span>
            </div>
          </template>
          <template v-else>
            <div class="item-div flex1">
              <van-icon class="van-icon" name="refund-o" size="18"/>
              <span class="fz-13" @click="$loginWallet()">{{$t('global.ClickConnectWallet')}}</span>
            </div>
          </template>
        </div>
      </div>
      <div style="margin-bottom:2rem">&nbsp;</div>
      <withdraw :show='showWithdraw' :withdrawId='withdrawId' @closeWithdraw="closeWithdraw"></withdraw>
      <redeem   :show='showRedeem' :redeemId='redeemId' @closeRedeem="closeRedeem"></redeem>
      <pledge   :show='showPledge' :pledgeId='pledgeId' @closePledge="closePledge"></pledge>
      <deposit  :show='showDeposit' :depositId='depositId'  @closeDeposit="closeDeposit"></deposit>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar'
import withdraw from './Popup/withdraw.vue'
import redeem from './Popup/redeem.vue'
import pledge from './Popup/pledge.vue'
import deposit from './Popup/deposit.vue'
import { EarningType } from '../../store/modules/earnings'
import { EVENT_WALLET_CHANGE } from '../../utils/web3Utils'

export default {
  name: 'earnings',
  components: {
    Navbar,
    withdraw,
    redeem,
    pledge,
    deposit
  },
  data () {
    return {
      EarningType,
      showWithdraw: false,
      showRedeem: false,
      showPledge: false,
      showDeposit: false,
      withdrawId: '',
      redeemId: '',
      pledgeId: '',
      depositId: ''
    }
  },
  computed: {
    accountData () {
      const accountData = this.$store.state.earnings.accountData
      if (accountData) {
        return accountData
      }

      return {}
    },
    pmrReward () {
      return this.$store.state.earnings.pmrReward;
    },
    bondInfo () {
      const bondInfo = this.$store.state.earnings.bondInfo
      if(bondInfo) {
        return bondInfo
      }
      return {}
    },
    isLogin () {
      return this.$store.state.user.isLogin
    }
  },
  methods: {
    closeWithdraw (bool) {
      this.showWithdraw = bool
    },
    closeRedeem (bool) {
      this.showRedeem = bool
    },
    closePledge (bool) {
      this.showPledge = bool
    },
    closeDeposit (bool) {
      this.showDeposit = bool
    },
    withdraw (bool, id) {
      this.showWithdraw = bool
      this.withdrawId = id
    },
    redeem (bool, id) {
      this.showRedeem = bool
      this.redeemId = id
    },
    pledge (bool, id) {
      this.showPledge = bool
      this.pledgeId = id
    },
    deposit (bool, id) {
      this.showDeposit = bool
      this.depositId = id
    },
    ClickBox () {
      this.show = true
    },
    goDetail (id) {
      this.$router.push({ name: 'detail', query: { id } })
    },
    loadEarningData() {
      this.$store.dispatch('earnings/loadEarningData')
    }
  },
  created () {
    this.loadEarningData()

    this.$eventBus.$on(EVENT_WALLET_CHANGE, () => {
      this.loadEarningData()
    })
  }
}
</script>

<style lang="less" scoped>
  .mining-earnings{
    background: #201b48;
    border-radius: 1.6rem;
    padding: 2rem;
    margin: 1.8rem 0;
    .earnings-title{
      display: flex;
      justify-content: space-between;
      .span1{
        color: rgba(255,255,255,0.85);
        font-weight: 400;
      }
      .span2{
        color: rgba(255,255,255,0.65);
        font-weight: 400;
      }
    }
    .earnings-num{
      margin: 1.6rem 0;
      .span1{
        font-weight: 700;
        font-size: 3rem;
        color: #F7D042;
      }
      .span2{
        margin-left: .5rem;
        color: rgba(255,255,255,0.45);
        font-weight: 400;
      }
    }
    .earnings-info{
      display: flex;
      margin-bottom: 2.8rem;
      .div1{
        flex: 1 auto;
        display: flex;
        flex-direction: column;
        .span1{
          font-weight: 400;
          color: rgba(255,255,255,0.85);
        }
        .span2{
          font-weight: 400;
          color: rgba(255,255,255,0.45);
        }
      }
    }
    .earnings-item{
      display: flex;
      justify-content: center;
      color: rgba(255,255,255,0.85);
      .item-div{
       .van-icon{
          vertical-align: text-top;
       }
        span{
          /*margin-left: .5rem;*/
        }
      }
      .flex1{
        flex: 1;
        text-align: center;
      }
    }
  }
</style>
