<template>
  <div class="home-container page-container">
    <navbar title="Derity Account" />
    <div class="account-num">
      <span class="num">账户余额</span>
      <span class="info" @click="lookFinDetail">资金明细 ></span>
    </div>
    <div class="account-info">
      <div class="div-unmUnit"><span>23,456</span><span class="unit">USDT</span></div>
      <span class="unm">+1,234.56</span>
    </div>
    <div class="title-div">
      <span>保证金余额</span>
      <span>占用保证金</span>
    </div>
    <div class="unit-tr">
      <div>24.691.34<span>USDT</span></div>
      <div>24.691.34<span>USDT(52%)</span></div>
    </div>
    <div class="recharge" @click="goTransfer('deposit')">充值</div>
    <div class="withdraw" @click="goTransfer('withdraw')">提现</div>
  </div>
</template>
<script>
import Navbar from '@/components/Navbar'
export default {
  name: 'account',
  components: {
    Navbar
  },
  data () {
    return {
    }
  },
  mounted () {
  },
  methods: {
    lookFinDetail () {
      this.$router.push({ path: '/financialDetails' })
    },
    goTransfer (type) {
      this.$router.push({ path: '/transfer', query: { type } })
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
    color: rgba(255,255,255,0.65);
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
