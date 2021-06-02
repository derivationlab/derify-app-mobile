<template>
  <div class="home-container page-container">
    <navbar title="收益" />
    <!-- 持仓挖矿收益 -->
      <div class="mining-earnings">
        <div class="earnings-title">
          <span class="span1">持仓挖矿收益</span>
          <span class="span2 fz-12" @click="goDetail(1)">流水明细 ></span>
        </div>
        <div class="earnings-num">
          <span class="span1">2345.4</span>
          <span class="span2">USDT</span>
        </div>
        <div class="earnings-info">
          <div class="div1">
            <span class="span1">24891.34</span>
            <span class="span2 fz-11">持仓额（USDT）</span>
          </div>
          <div class="div1">
            <span class="span1">24891.34</span>
            <span class="span2 fz-11">历史累计收益（USDT）</span>
          </div>
        </div>
        <div class="earnings-item">
          <div class="item-div">
            <van-icon class="van-icon" name="refund-o" size="18"/>
            <span class="fz-13" @click="withdraw(true,1)">提现</span>
          </div>
        </div>
      </div>
      <!-- 质押权益 eDRF -->
      <div class="mining-earnings">
        <div class="earnings-title">
          <span class="span1">持仓挖矿收益</span>
          <span class="span2 fz-12" @click="goDetail(2)">流水明细></span>
        </div>
        <div class="earnings-num">
          <span class="span1">2345.4</span>
          <span class="span2">eDRF</span>
        </div>
        <div class="earnings-info">
          <div class="div1">
            <span class="span1">24891.34</span>
            <span class="span2 fz-11">持仓额（DRF）</span>
          </div>
          <div class="div1">
            <span class="span1">24891.34</span>
            <span class="span2 fz-11">历史累计收益（eDRF）</span>
          </div>
        </div>
        <div class="earnings-item">
          <div class="item-div flex1">
            <van-icon class="van-icon" name="refund-o" size="18"/>
            <span class="fz-13" @click="withdraw(true,2)">提现</span>
          </div>
          <div class="item-div flex1">
            <van-icon class="van-icon" name="peer-pay" size="18"/>
            <span class="fz-13" @click="redeem(true,1)">赎回</span>
          </div>
          <div class="item-div flex1">
            <van-icon class="van-icon" name="cash-on-deliver" size="18"/>
            <span class="fz-13" @click="pledge(true,1)">质押</span>
          </div>
        </div>
      </div>
      <!-- 可兑换债券 bDRF -->
      <div class="mining-earnings">
        <div class="earnings-title">
          <span class="span1">持仓挖矿收益</span>
          <span class="span2 fz-12" @click="goDetail(3)">流水明细 ></span>
        </div>
        <div class="earnings-num">
          <span class="span1">2345.4</span>
          <span class="span2">USDT</span>
        </div>
        <div class="earnings-info">
          <div class="div1">
            <span class="span1">24891.34</span>
            <span class="span2 fz-11">持仓额（USDT）</span>
          </div>
          <div class="div1">
            <span class="span1">24891.34</span>
            <span class="span2 fz-11">历史累计收益（USDT）</span>
          </div>
        </div>
        <div class="earnings-item">
          <div class="item-div flex1">
            <van-icon class="van-icon" name="refund-o" size="18"/>
            <span class="fz-13" @click="withdraw(true,3)">提现</span>
          </div>
          <div class="item-div flex1">
            <van-icon class="van-icon" name="balance-o" size="18"/>
            <span class="fz-13" @click="deposit(true)">存入</span>
          </div>
          <div class="item-div flex1">
            <van-icon class="van-icon" name="peer-pay" size="18"/>
            <span class="fz-13" @click="redeem(true,2)">赎回</span>
          </div>
          <div class="item-div flex1">
            <van-icon class="van-icon" name="cash-on-deliver" size="18"/>
            <span class="fz-13" @click="pledge(true,2)">质押</span>
          </div>
        </div>
      </div>
      <withdraw :show='show' :withdrawId='withdrawId' @closeUnwindPopup="closeUnwindPopup"></withdraw>
      <redeem   :show='show' :redeemId='redeemId' @closeUnwindPopup="closeUnwindPopup"></redeem>
      <pledge   :show='show' :pledgeId='pledgeId' @closeUnwindPopup="closeUnwindPopup"></pledge>
      <deposit  :show='show'  @closeUnwindPopup="closeUnwindPopup"></deposit>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar'
import withdraw from './Popup/withdraw.vue'
import redeem from './Popup/redeem.vue'
import pledge from './Popup/pledge.vue'
import deposit from './Popup/deposit.vue'
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
      show: false,
      withdrawId: '',
      redeemId: '',
      pledgeId: ''
    }
  },
  methods: {
    // 关闭弹框
    closeUnwindPopup (bool) {
      this.show = bool
    },
    // 提现弹框
    withdraw (bool, id) {
      this.show = bool
      this.withdrawId = id
    },
    // 赎回弹框
    redeem (bool, id) {
      this.show = bool
      this.redeemId = id
    },
    // 质押弹框
    pledge (bool, id) {
      this.show = bool
      this.pledgeId = id
    },
    // 存入
    deposit (bool, id) {
      this.show = bool
      // this.pledgeId = id
    },
    ClickBox () {
      this.show = true
    },
    goDetail (id) {
      this.$router.push({ path: '/detail', query: { id } })
    }
  }
  // beforeCreate () {
  //   this.$store.dispatch('user/login')
  // }
}
</script>

<style lang="less" scoped>
  .mining-earnings{
    background: #201b48;
    border-radius: 1.6rem;
    padding: 2rem;
    margin: 1.6rem 0;
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
        flex: 1;
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
          margin-left: .5rem;
        }
      }
      .flex1{
        flex: 1;
        text-align: center;
      }
    }
  }
</style>
