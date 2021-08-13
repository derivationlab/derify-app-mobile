<template>
  <div class="home-container page-container">
    <navbar :title="$t('Brokers.Brokers')" />
    <div class="home-top">
      <div class="account-div">{{$t('Brokers.AccBalance')}}</div>
      <div class="num-div">
        <span class="num"> 23,456.78</span>
        <span class="unit">USDT</span>
      </div>
      <div class="income-div">
        <div class="taday-div">
          <span class="span1">24,691.34</span>
          <span class="span2 fz-11">{{$t('Brokers.DailyEarning')}} ( USDT )</span>
        </div>
        <div class="taday-div">
          <span class="span1">24,691.34</span>
          <span class="span2 fz-11">{{$t('Brokers.AccumulatedEarning')}} ( USDT )</span>
        </div>
      </div>
      <div class="cbtn-div fz-17 mrb-17">{{$t('Brokers.Burn')}}</div>
      <div class="tbtm-div fz-17">{{$t('Brokers.Withdraw')}}</div>
      <div class="dealer-div">{{$t('Brokers.PrivilegeValiduntil')}}<span>365</span>{{$t('Brokers.Days')}}，{{$t('Brokers.Until')}} 2048.12.31</div>
      <div class="explain-div">
        <div>{{$t('Brokers.Note')}}：</div>
        <ul>
          <li>*&nbsp;&nbsp;{{$t('Brokers.NoteDerify1')}}</li>
          <li>*&nbsp;&nbsp;{{$t('Brokers.NoteDerify2')}}</li>
          <li>*&nbsp;&nbsp;{{$t('Brokers.NoteDerify3')}}</li>
          <li>*&nbsp;&nbsp;{{$t('Brokers.NoteDerify4')}}</li>
        </ul>
      </div>
      <van-tabs v-model="active">
        <van-tab :title="$t('Brokers.AccountHistory')">
          <trader></trader>
        </van-tab>
        <van-tab :title="$t('Brokers.TraderInfo')">
          <account></account>
        </van-tab>
      </van-tabs>
    </div>
    <!-- 提示申请弹框 -->
    <van-popup class="derify-popup" v-model="showPopup" round :closeable="false" @close="closeshowPopup">
      <div class="unwind-popup system-popup">
        <div class="hintImg">
          <img src="@/assets/images/Frame.png" alt="" srcset="">
        </div>
        <div class="hintTitle">{{$t('Brokers.YouPartner')}}</div>
        <div v-if="isLogin" class="btnDiv" @click="closeshowPopup">{{$t('Brokers.ApplyPartner')}}</div>
        <div v-else class="btnDiv" @click="$loginWallet()">{{$t('global.ClickConnectWallet')}}</div>
      </div>
  </van-popup>
  <!-- 申请条件 -->
  <van-popup class="derify-popup" v-model="termPopup" round :closeable="false" @close="closetermPopup">
      <div class="unwind-popup system-popup">
        <div class="hint-div">{{$t('Brokers.BurnEDRF')}}</div>
        <!-- <div class="hint-num">
          <span class="num">60,000</span>
          <span class="unit">eDRF</span>
        </div> -->
        <!-- <div class="hint-title">{{$t('Brokers.YouPrivilege')}}</div> -->
          <div>
          <van-dropdown-menu :overlay="false" class="derify-dropmenus">
            <van-dropdown-item v-model="value1" :options="option1">
                <div class="derify-dropmenu-title" slot="title">
                  <span>{{option1[value1]}}</span>
                  <van-icon name="arrow-down" size="1.8rem" color="rgba(255, 255, 255, .85)" />
                </div>
            </van-dropdown-item>
          </van-dropdown-menu>
          <!-- <van-dropdown-menu active-color="#1989fa">
            <van-dropdown-item v-model="value1" :options="option1" />
          </van-dropdown-menu> -->
          </div>
        <div class="balance-div">{{$t('Brokers.Balances')}}：1234567.00000000 eDRF</div>
        <div class="system-popup-buttons">
          <div class="system-popup-button cancel" @click="closetermPopup">{{$t('Brokers.cancel')}}</div>
          <div class="system-popup-button confirm" @click="closetermPopup">{{$t('Brokers.affirm')}}</div>
      </div>
      </div>
  </van-popup>
  <!-- 申请成功弹框 -->
  <van-popup class="derify-popup" v-model="succPopup" round :closeable="false" @close="closesuccPopup">
      <div class="unwind-popup system-popup">
        <div class="hintImg">
          <img src="@/assets/images/succFrame.png" alt="" srcset="">
        </div>
        <div class="hintTitle">{{$t('Brokers.YouPrivilege')}}</div>
        <div class="btnDiv succPopup" @click="closesuccPopup">{{$t('Brokers.Close')}}</div>
      </div>
  </van-popup>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar'
import trader from './trader/index.vue'
import account from './account/index.vue'
export default {
  name: 'Home',
  components: {
    Navbar,
    trader,
    account
  },
  data () {
    return {
      showPopup: true,
      termPopup: false,
      succPopup: false,
      active: '1',
      value1: '',
      option1: [
        { text: '市价委托', value: 0 },
        { text: '限价委托', value: 1 }
      ]
    }
  },
  created () {
  },
  computed: {
    isLogin () {
      return this.$store.state.user.isLogin
    }
  },
  methods: {
    // 关闭申请弹框
    closeshowPopup () {
      this.termPopup = true
      this.showPopup = false
    },
    // 申请条件弹框
    closetermPopup () {
      this.succPopup = true
      this.termPopup = false
    },
    // 关闭申请成功后弹框
    closesuccPopup () {
      this.succPopup = false
    }
  }
}
</script>

<style lang="less" scoped>
.home-top{
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
    margin-bottom: 4rem;
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
    span{
      color: #FAE247;
    }
  }
  .explain-div{
    margin-bottom: 2.4rem;
    div{
      color: rgba(255,255,255,0.85);
      margin-bottom: 1rem;
    }
    ul{
      font-size: 1.2rem;
      padding-bottom: 4rem;
      border-bottom: .1rem solid rgba(255,255,255,0.15);
      color: rgba(255,255,255,0.65);
      // list-style: initial
      li{
        line-height: 2rem;
      }
    }
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
