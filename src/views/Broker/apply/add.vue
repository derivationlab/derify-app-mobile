<template>
  <BindList v-if="bindList" @onSwitch="() => this.bindList = false"></BindList>
  <div v-else class="home-container page-container">
    <navbar :title="$t('Trade.BrokerBind.BrokerCodes.BindBrokerPrivilege')" :logo="false" :showGoback="true"/>
    <div class="home-mid">
      <div class="market-popup system-popup">
        <DerifyErrorNotice :show="showError" @close="errorNotice(null)">
          {{errorMsg}}
        </DerifyErrorNotice>

        <div class="home-mid-input">
          <div class="fc-85 fz-15">{{ $t('Trade.BrokerBind.BrokerCodes.BrokerCode') }}</div>
          <van-field class="derify-big-input" type="text" placeholder="" input-align="center" v-model="brokerCode"/>
        </div>

        <div class="btn-wrap">
          <ButtonLoginWrap className="derify-big-btn btn-yellow">
              <p class="code-wrap"><span class="fc-yellow" @click="() => this.bindList=true">{{ $t('Trade.BrokerBind.BrokerCodes.NoBrokerCode') }}</span></p>
              <div class="derify-big-btn btn-yellow" @click="submitThenClose">{{ $t('Trade.BrokerBind.BrokerCodes.Submit') }}</div>
          </ButtonLoginWrap>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import Navbar from '@/components/Navbar'
import DerifyErrorNotice from "@/components/DerifyErrorNotice/DerifyErrorNotice";
import ButtonLoginWrap from '@/components/ButtonLoginWrap/ButtonLoginWrap'
import BindList from './apply'

export default {
  name: 'bind',
  components: {
    ButtonLoginWrap,
    DerifyErrorNotice,
    Navbar,
    BindList
  },
  data () {
    return {
      showError: false,
      errorMsg: '',
      brokerCode: '',
      bindList: false
    }
  },
  created () {
  },
  computed: {
    isLogin () {
      return this.$store.state.user.isLogin
    },
    trader () {
      return this.$store.state.user.selectedAddress;
    }
  },
  methods: {
    async submitThenClose () {
      const checkRes = await this.checkBrokerCode()
      if(!checkRes) {
        return false
      }

      this.$store.dispatch('user/bindBroker', {trader: this.trader, brokerId: this.brokerCode}).then((data) => {
        if(data.success){
          this.$store.dispatch("user/initWallet").then(() => {
            this.$router.push({name: 'home'})
          });
        }else{
          this.errorNotice(data.msg)
        }
      }).catch(e => {
        this.$toast(e)
      })
      return true
    },

    async checkBrokerCode() {

      if(this.brokerCode === null) {
        this.errorNotice(null)
        return false
      }

      if(this.brokerCode.trim() === '') {
        this.errorNotice(this.$t('Trade.BrokerBind.BrokerCodes.NoBrokerCode'))
        return false
      }

      const resBroker = await this.$store.dispatch('broker/getBrokerByBrokerId', this.brokerCode)
      if(!resBroker || !resBroker.id) {
        this.errorNotice(this.$t('Trade.BrokerBind.BrokerCodes.BrokerCodeNoExistError'))
        return false
      }

      this.errorNotice(null)

      return true
    },

    errorNotice (msg) {
      if(msg){
        this.showError = true
        this.errorMsg = msg
      }else{
        this.showError = false
        this.errorMsg = msg
      }
    }
  }
}
</script>

<style lang="less" scoped>
.selected-icon{
  width: 2rem;
  height: 2rem;
}

.page-container{
  background: #140B32;
}

.home-mid{
  .market-popup{
    background: #272354;
    border-radius: 1.8rem;
  }
  &-input {
    margin: 1rem 0;
  }
}

.btn-wrap{
  margin-top: 4rem;
  p {
    text-align: center;
    margin: 1rem;
    line-height: 5rem;
    height: 5rem;
    .fc-yellow{
      border-bottom: 0.1rem solid @orange;
    }
  }
}
</style>
