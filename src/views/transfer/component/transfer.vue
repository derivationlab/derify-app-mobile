<template>
  <div class="home-container page-container">
    <van-nav-bar
      title="资金划转"
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
    <div class="num-div">数量</div>
    <van-cell-group>
      <van-field
        v-model="amount"
        class="derify-input no-padding-hor"
        type="number"
      >
      </van-field>
      <span class="unit">USDT</span>
    </van-cell-group>
    <div class="transfer-div"><span class="span1">可划转：{{account.accountBalance | fck(-8)}} USDT</span><span class="span2">全部划转</span></div>
    <div class="pay-div" v-if="type === 'deposit'" @click="deposit">充值</div>
    <div class="pay-div" v-if="type === 'withdraw'" @click="withdraw">提现</div>
  </div>
</template>
<script>
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
      return this.$store.state.contract.account
    }
  },
  mounted () {
    this.type = (this.$route.query && this.$route.query.type) || 'deposit'
  },
  methods: {
    onClickLeft () {
      this.$router.go(-1)
    },
    changeType () {
      this.type = this.type === 'deposit' ? 'withdraw' : 'deposit'
    },
    deposit () {
      if (!this.amount) {
        this.$toast('请输入正确的数量')
        return false
      }
      const a = parseFloat(this.amount)
      const amount = parseInt(a) * 1e8
      this.$store.dispatch('contract/depositAccount', amount).then(_ => {
        this.$toast('充值成功')
      })
      this.$router.go(-1)
    },
    withdraw () {
      if (!this.amount) {
        this.$toast('请输入正确的数量')
        return false
      }
      const a = parseFloat(this.amount)
      const amount = parseInt(a) * 1e8
      this.$store.dispatch('contract/withdrawAccount', amount).then(_ => {
        this.$router.go(-1)
      }).catch(err => {
        this.$toast(`出现异常:` + err)
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
