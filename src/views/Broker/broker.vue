<template>
  <div class="home-container page-container">
    <navbar :title="$t('Trade.navbar.Broker')" />
    <template v-if="!showLoading && !showApplyPopup">
      <div class="home-top">

        <div class="broker-info">
          <div class="broker-avatar">
            <van-image fit="cover" :round="true" lazy-load :src="broker.logo" width="4.4rem" height="4.4rem" alt=""/>
          </div>
          <div class="broker-contact">
            <div class="broker-name">{{broker.name}}</div>
            <div class="broker-addr">
              <p>@{{broker.id}}</p>
            </div>
            <div class="intr-wrapper">
              <template v-if="countLength(broker.introduction) > 74">
                {{
                  showAllIntrudct ? broker.introduction : (cutLength(broker.introduction,74)+"...")
                }}
                <span class="fc-yellow" @click='() => {this.showAllIntrudct = !showAllIntrudct}'>{{showAllIntrudct ? $t("Broker.Broker.InfoEdit.PackUp") : $t("Broker.Broker.InfoEdit.SeeMore")}}</span>
              </template>
              <template v-else>
                {{broker.introduction}}
              </template>
            </div>
          </div>
          <div class="go-right-wrap"  @click="goPath(`/broker-info`)">
            <i class="go-right-icon">
              <img src="@/assets/icons/go-right.png" style="height:2.6rem; width: 2.6rem;" alt=""/>
            </i>
          </div>
        </div>
        <div class="market-popup">
          <div class="account-div">{{$t('Broker.Broker.Account.AccBalance')}}</div>
          <div class="num-div">
            <DecimalView :value="broker.rewardBalance | fck(-8,2)" className="num"></DecimalView>
            <span class="unit">USDT</span>
          </div>

          <div class="tbtm-div fz-17" @click="setShowWidthdrawPopup(true)">{{$t('Broker.Broker.Account.Withdraw')}}</div>

          <div class="income-div">
            <div class="taday-div">
              <DecimalView :value="broker.todayReward | fck(0,2)" className="span1"></DecimalView>
              <span class="span2 fz-11">{{$t('Broker.Broker.Account.DailyEarning')}} ( USDT )</span>
            </div>
            <div class="taday-div">
              <DecimalView :value="broker.accumulatedReward | fck(-8,2)" className="span1"></DecimalView>
              <span class="span2 fz-11">{{$t('Broker.Broker.Account.AccumulatedEarning')}} ( USDT )</span>
            </div>
          </div>

          <div class="dealer-div">
            <div class="dealer-label">
              <span class="fz-15">{{$t('Broker.Broker.Account.PrivilegeValidDate')}}</span>
              <span class="fc-yellow fz-12">
                <a target="_blank" class="fc-yellow fz-12" :href="broker.reference">{{$t('Broker.Broker.Account.Myreferralpage')}}></a>
              </span>
            </div>
            <div class="dealer-ctn">
              <span class="dealer-day-num fc-yellow">{{broker.validPeriodInDay | fck(-8,0)}}</span>
              <span class="fz-12 fc-45">{{$t('Broker.Broker.Account.Days')}}</span>
              <span class="fz-11 fc-45">{{$t('Broker.Broker.Account.ExpireDate', [broker.expireDate.getFullYear(), broker.expireDate.getMonth()+1, broker.expireDate.getDate()])}}</span>
            </div>
          </div>

          <div class="cbtn-div fz-17 mrb-17" @click="setShowDepositPopup(true)">{{$t('Broker.Broker.Account.Burn')}}</div>

          <div class="explain-div">
            <div>{{$t('Broker.Broker.Account.BrokerHint')}}</div>
            <ul>
              <li>{{$t('Broker.Broker.Account.BrokerHintDetail1')}}</li>
              <li>{{$t('Broker.Broker.Account.BrokerHintDetail2')}}</li>
              <li>{{$t('Broker.Broker.Account.BrokerHintDetail3')}}</li>
              <li>{{$t('Broker.Broker.Account.BrokerHintDetail4')}}</li>
            </ul>
          </div>
        </div>
        <div class="broker-tab-wrap">
          <van-tabs v-model="active">
            <van-tab :title="$t('Broker.Broker.History.AccountHistory')">
              <trader  :broker="this.broker.broker" ></trader>
            </van-tab>
            <van-tab :title="$t('Broker.Broker.TraderInfo.TraderInfo')">
              <account  :broker="this.broker.broker" ></account>
            </van-tab>
          </van-tabs>

          <!--        <DerifyPageNation :total="10" :cur="1"></DerifyPageNation>-->
        </div>

      </div>
    </template>
    <template v-if="!showLoading && showApplyPopup">
      <div class="home-top">
        <div class="unwind-popup system-popup">
          <div class="hintImg">
            <img src="@/assets/images/Frame.png" alt="" srcset="">
          </div>
          <div class="hintTitle">{{$t('Broker.Apply.NotBrokerMessage')}}</div>
          <div v-if="isLogin" class="btnDiv" @click="closeApplyPopup">{{$t('Broker.Apply.ApplyBroker')}}</div>
          <div v-else class="btnDiv" @click="$loginWallet()">{{$t('Trade.Wallet.ConnectWallet')}}</div>
        </div>
      </div>
    </template>
    <!-- requirements -->
    <van-popup class="derify-popup" v-model="termPopup" round :closeable="false" @close="setTermPopup(false)">
        <div class="unwind-popup system-popup">
          <div class="system-popup-title">
            <div class="fz-15 fc-65">
              <i18n path="Broker.Apply.GetBrokersPrivilege">
                <DecimalView :value="applyBurnAmount+''" digit-split=",">
                  <template #first="{first}"><br/><span class="fz-33 fc-yellow">{{first}}</span><br/></template>
                  <template #last></template>
                </DecimalView>
              </i18n>
            </div>
          </div>
          <DerifyErrorNotice :show="errorMsg.length > 0" @close="errorNotice('')">{{errorMsg}}</DerifyErrorNotice>

          <div>
            <van-dropdown-menu :overlay="false" class="derify-dropmenus">
              <van-dropdown-item class="derify-dropmenu-item-wrap" v-model="accountType" :options="accountOptions" @change="accountTypeChange">
                  <div class="derify-dropmenu-title" slot="title">
                    <span>{{accountOptions[accountType].text}}</span>
                    <van-icon name="arrow-down" size="1.8rem" color="rgba(255, 255, 255, .85)" />
                  </div>
              </van-dropdown-item>
            </van-dropdown-menu>
          </div>
          <div class="balance-div">{{$t('Broker.Apply.AccountBalance')}}：{{this.maxAmount | fck(-8,4)}} eDRF</div>
          <div class="system-popup-buttons">
            <div class="system-popup-button cancel" @click="setTermPopup(false)">{{$t('Broker.Apply.Cancel')}}</div>
            <div class="system-popup-button confirm" @click="applyBroker">{{$t('Broker.Apply.Confirm')}}</div>
          </div>
        </div>
    </van-popup>
    <!-- apply popup -->
    <van-popup class="derify-popup" v-model="succPopup" round :closeable="false" @close="closesuccPopup">
        <div class="unwind-popup system-popup">
          <div class="hintImg">
            <img src="@/assets/images/succFrame.png" alt="" srcset="">
          </div>
          <div class="hintTitle" v-if="brokerApplied && showCompleteInfo">{{$t('global.TradeSuccessMsg')}}</div>
          <div class="hintTitle" v-else>{{$t('Broker.Apply.ApplySuccessMsg')}}</div>
          <div class="btnDiv succPopup" @click="closesuccPopup" v-if="!showCompleteInfo">{{$t('Broker.Apply.Confirm')}}</div>
          <div class="btnDiv succPopup" @click="closesuccPopup" v-else>{{$t('Broker.Apply.AddInfo')}}</div>
        </div>
    </van-popup>
    <BrokerDepositPopup :show="showDepositPopup" @close="setShowDepositPopup(false)"/>
    <BrokerWithdrawPopup :broker="this.broker.id" :show="showWithdrawPopup" @close="setShowWidthdrawPopup(false)"/>

    <van-overlay :show="false" @click="showLoading = false" class-name="derify-loading-wrap">
      <van-loading size="2.4rem" v-show="false" vertical>{{ $t('global.TradePendingMsg') }}</van-loading>
    </van-overlay>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar'
import trader from './trader/index.vue'
import account from './account/index.vue'
import DerifyPageNation from '@/components/DerifyPageNation/DerifyPageNation'
import DerifyErrorNotice from '@/components/DerifyErrorNotice/DerifyErrorNotice'
import BrokerDepositPopup from '@/views/Broker/popup/BrokerDepositPopup'
import BrokerWithdrawPopup from '@/views/Broker/popup/BrokerWithdrawPopup'
import DecimalView from "@/components/DecimalView/DecimalView";
import { EVENT_WALLET_CHANGE } from '@/utils/web3Utils'
import { BondAccountType, fromContractUnit } from '@/utils/contractUtil'
import { UserProcessStatus } from '@/store/modules/user'
import TextView from '@/components/TextView'
import {countLength,cutLength} from '@/utils/utils'

export default {
  name: 'Home',
  components: {
    DecimalView,
    BrokerWithdrawPopup,
    BrokerDepositPopup,
    DerifyErrorNotice,
    Navbar,
    trader,
    account
  },
  data () {
    return {
      showAllIntrudct: false,
      showLoading: true,
      showApplyPopup: false,
      termPopup: false,
      succPopup: false,
      showCompleteInfo: false,
      active: '1',
      accountType: BondAccountType.WalletAccount,
      showDepositPopup: false,
      showWithdrawPopup: false,
      applyBurnAmount: 60000,
      errorMsg: '',
      accountOptions: this.getAccountOptions(),

      rewardHistory: [],

      bindTraders: [],
    }
  },
  mounted () {

    this.loadTraderBrokerInfo()

    this.$eventBus.$on(EVENT_WALLET_CHANGE, () => {
      this.loadTraderBrokerInfo()
    })
  },
  watch: {
    '$i18n.locale': {
      handler(){
        this.accountOptions = this.getAccountOptions()
      }
    },
    broker:{
      handler(){

        this.showCompleteInfo = !this.broker.logo || !this.broker.broker
          || !this.broker.name || !this.broker.id

        this.succPopup = this.brokerApplied && this.showCompleteInfo
      },
      deep:true,
      immediate: true
    }
  },
  computed: {
    isLogin () {
      return this.$store.state.user.isLogin
    },
    brokerApplied(){
      return this.$store.state.broker.isBroker
    },
    broker () {
      return this.$store.state.broker.broker
    },
    trader() {
      return this.$store.state.user.selectedAddress
    },
    maxAmount() {
      if(this.accountType === BondAccountType.DerifyAccount) {
        return this.$store.state.broker.wallet.derifyEdrfBalance
      }else{
        return this.$store.state.broker.wallet.walletEdrfBalance
      }
    }
  },
  methods: {
    countLength,
    cutLength,
    getAccountOptions() {
      return [
        {
          text: this.$t('Broker.Broker.DepositPopup.eDRFAccount'),
          value: 0
        },
        {
          text: this.$t('Broker.Broker.DepositPopup.MyWallet'),
          value: 1
        }
      ]
    },
    loadTraderBrokerInfo(){

      if(!this.trader){
        this.showLoading = false;
        this.showApplyPopup = true;
        return;
      }

      this.showLoading = !this.brokerApplied

      this.$store.dispatch('broker/getTraderBrokerInfo', this.trader).then(() => {
        this.showApplyPopup = !this.brokerApplied
      }).finally(() => {
        this.showLoading = false
      });
    },
    // close popup
    closeApplyPopup () {
      this.setTermPopup(true)
    },
    // close apply popup
    setTermPopup (bool) {

      if(bool) {
        this.accountTypeChange()
      }

      this.termPopup = bool
    },

    checkAmount() {
      if(this.applyBurnAmount > fromContractUnit(this.maxAmount)) {
        this.errorNotice(this.$t('Broker.Apply.InsufficientAccountBalanceError'))
        return false
      }

      this.errorNotice('')

      return true
    },
    applyBroker() {
      if(!this.checkAmount()){
        return
      }

      this.$userProcessBox({show: true, status: UserProcessStatus.waiting, msg: this.$t('global.TradePendingMsg')});

      this.$store.dispatch('broker/applyBroker', {trader: this.trader, accountType: this.accountType, amount: this.applyBurnAmount})
        .then(() => {
          this.succPopup = true
          this.loadTraderBrokerInfo()
        })
        .catch(() => {
          this.$userProcessBox({show: true, status: UserProcessStatus.failed, msg: this.$t('global.TradeFailedMsg')});
        });
    },
    // close apply success popup
    closesuccPopup () {
      this.succPopup = false
      this.goPath(`/broker-info/${this.broker.id}`)
    },

    goBorkerInfo () {
      this.succPopup = false
      this.goPath(`/broker-info`)
    },
    setShowDepositPopup(bool) {
      this.showDepositPopup = bool
      if(bool) {
        this.loadTraderBrokerInfo()
      }
    },
    setShowWidthdrawPopup(bool) {
      this.showWithdrawPopup = bool
    },
    go(name, query = {}){
      this.$router.push({name, query})
    },
    goPath(path){
      this.$router.push({path})
    },
    errorNotice(msg){
      if(msg){
        this.errorMsg = msg
        this.showError = true
      }else{
        this.errorMsg = ''
      }
    },
    accountTypeChange() {
      this.$store.dispatch('broker/getBrokerBalance', {trader: this.trader, accountType: this.accountType})
    }
  }
}
</script>

<style lang="less" scoped>
.derify-loading-wrap{
  display: flex;
  align-items: center;
  justify-content: center;
  align-content: center;
}

.home-top{
  .intr-wrapper{
    margin-bottom: 10px;
  }
  .broker-info{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 2rem 0;
    .broker-avatar {
      img{
        width: 5.5rem;
        height: 5.5rem;
        border-radius: 2.5rem;
      }
    }

    .broker-contact {
      overflow: hidden;
      overflow-wrap: break-word;
      text-overflow: ellipsis;
      color: rgba(255,255,255,0.45);
      font-size: 1.3rem;
      line-height: 1.8rem;
      padding-left: 1rem;
      .broker-name{
        font-size: 1.7rem;
        text-align: LEFT;
        color: #ffffff;
      }
    }
  }
  .market-popup{
    background: #272354;
    border-radius: 1.8rem;
    padding: 1.8rem;
  }
  .account-div{
    margin: 1.6rem 0;
    color: rgba(255,255,255,0.85);
    font-weight: 400;
  }
  .num-div{
    margin-bottom: 2.4rem;
    .num{
      color: #fae247;
      font-weight: 700;
      font-size: 3rem;
    }
    .unit{
      color: rgba(255,255,255,0.45);
      font-weight: 400;
    }
  }
  .income-div{
    display: flex;
    margin: 4rem 0;
    .taday-div{
      flex: 1;
      display: flex;
      flex-direction: column;
      .span1{
        color: rgba(255,255,255,0.85);
        font-weight: 400;
      }
      .span2{
        color: rgba(255,255,255,0.45);
      }
    }
  }
  .cbtn-div{
    width: 100%;
    height: 4.8rem;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(180deg,#fae55e, #f7d042 100%);
    border-radius: 2.4rem;
    color: #140b32;
    font-weight: 500;
  }
  .tbtm-div{
    width: 100%;
    height: 4.8rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 2.4rem;
    color: #FAE247;
    border: .1rem solid #FAE247;
    font-weight: 500;
  }
  .dealer-div{
    margin: 4rem 0;
    color: rgba(255,255,255,0.85);
    .dealer-label{
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .dealer-ctn{
      margin: 1rem 0;
      .dealer-day-num{
        font-size: 2.2rem;
      }
      span{
        margin-right: 1rem;
      }
    }
  }
  .explain-div{
    div{
      color: rgba(255,255,255,0.85);
      margin-bottom: 1rem;
    }
    ul{
      font-size: 1.2rem;
      color: rgba(255,255,255,0.65);
      list-style: initial;
      padding-left: 2rem;
      li{
        line-height: 2rem;
      }
    }
  }
}

.broker-tab-wrap{
  margin-top: 4.4rem;
  padding-top: 1rem;
  padding-bottom: 2rem;
  border-top: 1px solid rgba(255,255,255,0.15);

  .page-btn-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
.hintImg{
  width: 12rem;
  height: 12rem;
  margin: 6rem auto 4rem;
  img{
    width: 100%;
    height: 100%;
  }
}
.hintTitle{
  text-align: center;
  margin-bottom: 2.4rem;
  font-size: 1.7rem;
  font-weight: 400;
  color: rgba(255,255,255,0.85);
}
.hint-div ,.hint-title{
  font-size: 1.4rem;
  font-weight: 400;
  text-align: center;
  color: rgba(255,255,255,0.65);
}
.balance-div{
  font-size: 1.2rem;
  font-weight: 400;
  text-align: LEFT;
  color: rgba(255,255,255,0.65);
  margin: 1rem 0;
}
.hint-num{
  text-align: center;
  margin: 1rem 0;
  .num{
    font-size: 3rem;
    font-weight: 500;
    color: #fae247;
  }
  .unit{
    font-size: 1.4rem;
    font-weight: 400;
    color: rgba(255,255,255,0.65);
  }
}
.btnDiv{
  width: 18rem;
  height: 4rem;
  line-height: 4rem;
  margin: 0 auto;
  background: linear-gradient(180deg,#fae55e, #f7d042 100%);
  border-radius: 3.4rem;
  text-align: center;
  color: #000;
  font-weight: 500;
  font-size: 1.6rem;
}
.succPopup{
  width: 12rem;
}
</style>

<style>
.derify-dropmenus .van-dropdown-menu__bar {
  margin-bottom: 0;
}
.derify-dropmenus .van-dropdown-item__content{
  margin-top: 0;
}
</style>
