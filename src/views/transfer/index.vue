<template>
  <div class="home-container page-container">
    <navbar title="资金划转" />
    <div class="from-div">From</div>
    <van-cell-group>
      <van-field v-model="value"  placeholder="Metamask Wallet" border='false' />
    </van-cell-group>
    <div class="to-div"><span class="span1">to</span><van-icon class="span2" name="exchange" size="2rem"/></div>
    <van-cell-group>
      <van-field v-model="value"  placeholder="Derify Account" />
    </van-cell-group>
    <div class="num-div">数量</div>
    <van-cell-group>
      <van-field
        v-model="value"
        placeholder="1.23456789"
      >
      </van-field>
      <span class="unit">USDT</span>
    </van-cell-group>
    <div class="transfer-div"><span class="span1">可划转：1234567.00000000 USDT</span><span class="span2">全部划转</span></div>
    <div class="pay-div">充值</div>
  </div>
</template>
<script>
import Navbar from '@/components/Navbar'
export default {
  name: 'transfer',
  components: {
    Navbar
  },
  data () {
    return {
      value: ''
    }
  },
  mounted () {
  },
  methods: {
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
