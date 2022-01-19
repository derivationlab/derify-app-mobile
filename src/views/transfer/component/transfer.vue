<template>
  <div class="home-container page-container">

    <DerifyErrorNotice @close="errorNotice" :show="showError">
      {{errorMsg}}
    </DerifyErrorNotice>
    <van-nav-bar
      :title="$t('Trade.Account.Transfer.Transfers')"
      left-arrow
      :border="false"
      :fixed="true"
      @click-left="onClickLeft"
    >
      <template #left>
        <van-icon name="arrow-left" color="rgba(255, 255, 255, .85)" size="2.4rem"></van-icon>
      </template>
    </van-nav-bar>
    <div class="from-div">{{ $t('Trade.Account.Transfer.From') }}</div>
    <van-cell-group>
      <van-field readonly class="derify-input no-padding-hor" :value="type === 'deposit' ? $t('Trade.Account.Transfer.MyWallet') : $t('Trade.Account.Transfer.MarginAccount')" :border='false' />
    </van-cell-group>
    <div class="to-div" @click="changeType"><span class="span1">{{ $t('Trade.Account.Transfer.To') }}</span>
      <span class="switch-updown-arrow">
        <DerifyIcon icon-name="switch-updown-arrow" color="#140B32" width="1.5rem" height="1.5rem"/>
      </span>
    </div>
    <van-cell-group>
      <van-field readonly class="derify-input no-padding-hor" :value="type === 'deposit' ? $t('Trade.Account.Transfer.MarginAccount') : $t('Trade.Account.Transfer.MyWallet')" />
    </van-cell-group>
    <div class="num-div">{{$t('Trade.Account.Transfer.Size')}}</div>
    <van-cell-group>
      <van-field
        v-model="amount"
        class="derify-input no-padding-hor"
        :formatter="formatter"
        @input="onAmoutChange"
        type="number"
      >
      </van-field>
      <span class="unit">BUSD</span>
    </van-cell-group>
    <div class="transfer-div"><span class="span1">{{$t('Trade.Account.Transfer.Size')}}
      {{maxAmount}} BUSD</span><span class="span2" @click="transferAll">{{$t('Trade.Account.Transfer.All')}}</span></div>
    <div class="pay-div" v-if="type === 'deposit'" @click="deposit">{{$t('Trade.Account.Transfer.Deposit')}}</div>
    <div class="pay-div" v-if="type === 'withdraw'" @click="withdraw">{{$t('Trade.Account.Transfer.Withdraw')}}</div>
  </div>
</template>
<script>
  import { fromContractUnit, toContractUnit } from '../../../utils/contractUtil'
import { UserProcessStatus } from '../../../store/modules/user'
import {toContractNum} from "@/utils/contractUtil";
  import DerifyIcon from '../../../components/DerifyIcon/DerifyIcon'
  import DerifyErrorNotice from '../../../components/DerifyErrorNotice/DerifyErrorNotice'

export default {
  name: 'transfer',
  components: { DerifyErrorNotice, DerifyIcon },
  data () {
    return {
      errorMsg: '',
      showError: false,
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
    maxAmount () {
      const {type} = this;

      if(type === 'deposit'){
        return fromContractUnit(this.balanceOfWallet)
      }else{
        return fromContractUnit(this.balanceOfDerify)
      }
    }
  },
  mounted () {
    this.type = (this.$route.query && this.$route.query.type) || 'deposit'

    this.$store.dispatch('user/getBalanceOfDUSD')

    this.$store.dispatch('contract/loadAccountData')
  },
  watch: {
    '$store.state.user.selectedAddress':{
      handler () {
        if(this.$store.state.user.selectedAddress) {
          this.$store.dispatch('user/getBalanceOfDUSD')
          this.$store.dispatch('contract/loadAccountData')
        }
      },
      immediate: true
    }
  },
  methods: {
    onClickLeft () {
      this.$router.go(-1)
    },
    errorNotice(msg){
      if(msg){
        this.errorMsg = msg
        this.showError = true
      }else{
        this.showError = false
      }
    },
    changeType () {
      this.type = this.type === 'deposit' ? 'withdraw' : 'deposit'
      if(this.type === 'withdraw') {
        this.$store.dispatch('contract/loadAccountData')
      }else{
        this.$store.dispatch('user/getBalanceOfDUSD')
      }
    },
    transferAll () {
      this.amount = this.maxAmount
    },
    onAmoutChange () {
      this.checkAmount()
    },
    checkAmount() {

      if (!this.amount || this.amount <= 0) {
        this.errorNotice(this.$t('global.NumberError'))
        return false
      }

      if(this.amount >= this.maxAmount) {
        this.amount = this.maxAmount
      }

      this.errorNotice(null)

      return true
    },
    deposit () {
      if(!this.checkAmount()){
        return
      }

      const self = this
      const a = parseFloat(this.amount)
      const amount = toContractUnit(a)

      this.$userProcessBox({status: UserProcessStatus.waiting, msg: self.$t('global.TradePendingMsg')});
      this.$store.dispatch('contract/depositAccount', amount).then(_ => {
        self.$userProcessBox({status: UserProcessStatus.success, msg: self.$t('global.TradeSuccessMsg')});
      }).catch(e => {
        self.$userProcessBox({status: UserProcessStatus.failed, msg: self.$t('global.TradeFailedMsg')})
      }).finally(_ => {
        self.$router.go(-1)
      })
    },
    withdraw () {
      if(!this.checkAmount()){
        return
      }

      const a = parseFloat(this.amount)
      const amount = toContractUnit(a)
      this.$userProcessBox({status: UserProcessStatus.waiting, msg: this.$t('global.TradePendingMsg')});

      const self = this
      this.$store.dispatch('contract/withdrawAccount', amount).then(_ => {
        self.$userProcessBox({status: UserProcessStatus.success, msg: self.$t('global.TradeSuccessMsg')})
      }).catch(err => {
        self.$userProcessBox({status: UserProcessStatus.failed, msg:  self.$t('global.TradeFailedMsg')})
      }).finally(() => {
        self.$router.go(-1)
      })
    },
    formatter(value) {
      value = value.replace(/-/g, '');
      const maxAmount = this.maxAmount
      if(parseFloat(value) >= maxAmount) {
        return maxAmount
      }
      return value.replace(/-/g, '');
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
  .switch-updown-arrow{
    border-radius: 1rem;
    width: 2rem;
    height: 2rem;
    background-color: #FAE247;
    align-items: center;
    display: flex;
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
