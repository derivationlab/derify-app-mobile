<template>
  <div class="home-container page-container">
    <navbar title="经济商" />
    <div class="home-top">
      <div class="account-div">账户余额</div>
      <div class="num-div">
        <span class="num"> 23,456.78</span>
        <span class="unit">USDT</span>
      </div>
      <div class="income-div">
        <div class="taday-div">
          <span class="span1">24,691.34</span>
          <span class="span2 fz-11">今日收入 ( USDT )</span>
        </div>
        <div class="taday-div">
          <span class="span1">24,691.34</span>
          <span class="span2 fz-11">累计收入 ( USDT )</span>
        </div>
      </div>
      <div class="cbtn-div fz-17 mrb-17">充值</div>
      <div class="tbtm-div fz-17">提现</div>
      <div class="dealer-div">经销商权益有效期<span>365</span>天，至 2048 年 12月 31日</div>
      <div class="explain-div">
        <div>说明：</div>
        <ul>
          <li>*&nbsp;&nbsp;平台采取经纪商制度。所有的交易者只能通过访问经纪商的交易页面进行交易，Derify protocol并不直接面向交易者提供服务。</li>
          <li>*&nbsp;&nbsp;经纪商可以持续获得手续费奖励（未来还将获得额外的DRF奖励）。</li>
          <li>*&nbsp;&nbsp;经纪商需要燃烧eDRF才能保持享有该权益（当前，每600个eDRF可以维持一天的经纪商收益）。 </li>
          <li>*&nbsp;&nbsp;权益有效期到期后将无法获得经纪商奖励，但仍会保持经纪商身份， 您可以随时燃烧eDRF恢复经纪商奖励权益。</li>
        </ul>
      </div>
      <van-tabs v-model="active">
        <van-tab title="账户流水">
          <trader></trader>
        </van-tab>
        <van-tab title="交易者信息">
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
        <div class="hintTitle">您尚未开通经纪商身份</div>
        <div class="btnDiv" @click="closeshowPopup">申请成为经纪商</div>
      </div>
  </van-popup>
  <!-- 申请条件 -->
  <van-popup class="derify-popup" v-model="termPopup" round :closeable="false" @close="closetermPopup">
      <div class="unwind-popup system-popup">
        <div class="hint-div">您需要燃烧</div>
        <div class="hint-num">
          <span class="num">60,000</span>
          <span class="unit">eDRF</span>
        </div>
        <div class="hint-title">以成为经纪商</div>
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
        <div class="balance-div">可用余额：1234567.00000000 eDRF</div>
        <div class="system-popup-buttons">
          <div class="system-popup-button cancel" @click="closetermPopup">取消</div>
          <div class="system-popup-button confirm" @click="closetermPopup">确认</div>
      </div>
      </div>
  </van-popup>
  <!-- 申请成功弹框 -->
  <van-popup class="derify-popup" v-model="succPopup" round :closeable="false" @close="closesuccPopup">
      <div class="unwind-popup system-popup">
        <div class="hintImg">
          <img src="@/assets/images/succFrame.png" alt="" srcset="">
        </div>
        <div class="hintTitle">您已成功开通经纪商身份</div>
        <div class="btnDiv succPopup" @click="closesuccPopup">关闭</div>
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
