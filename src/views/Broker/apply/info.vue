<template>
  <div class="home-container page-container">
    <navbar :title="$t('Broker.Broker.InfoEdit.Title')" :showGoback="true" :logo="false"/>

    <div class="home-mid">
      <div class="market-popup system-popup">
        <DerifyErrorNotice :show="showError" @close="errorNotice(null)">
          {{errorMsg}}
        </DerifyErrorNotice>

        <div class="system-popup-line system-popup-input" style="display: none;">
          <span class="fz-15"><span class="fc-85">{{ $t('Broker.Broker.InfoEdit.WalletAddress') }}</span></span>
          <van-field readonly class="derify-input no-padding-hor fz-15  fc-45" placeholder=""
                     :formatter="(value) => value.replace(/-/g, '')"
                     type="text" v-model="broker.broker"/>
        </div>

        <div class="system-popup-line system-popup-input">
          <span class="fz-15"><span class="fc-red">*</span>&nbsp;<span class="fc-85">{{ $t('Broker.Broker.InfoEdit.Name') }}</span></span>
          <van-field class="derify-input no-padding-hor fz-15 fc-85" placeholder=""
                     type="text" v-model="broker.name"/>
        </div>

        <div class="system-popup-line system-popup-input">
          <span class="fz-15"><span class="fc-red">*</span>&nbsp;<span class="fc-85">{{ $t('Broker.Broker.InfoEdit.Avatar') }}</span></span>
          <div class="broker-avatar">
            <input type="file" class="broker-avatar-file" ref="logo" accept="image/gif,image/jpeg,image/jpg,image/png"/>

            <template v-if="broker.logo">
              <van-image fit="cover" :round="true" lazy-load :src="broker.logo" width="5.5rem" height="5.5rem" alt=""/>
            </template>

            <template v-else>
              <img src="@/assets/images/broker-default-avatar.png" style="width: 5.5rem;height: 5.5rem" alt=""/>
            </template>

          </div>
        </div>

        <div class="account-label system-popup-line">
          <span class="fz-15"><span class="fc-red">*</span>&nbsp;<span class="fc-85">{{ $t('Broker.Broker.InfoEdit.BrokerCode') }}</span></span>
          <van-field class="derify-input no-padding-hor fz-15 fc-85" placeholder=""
                     type="text" v-model="broker.id" @input="(val)=>{this.broker.id = val.toLowerCase()}"/>
        </div>

        <div class="system-popup-input derify-broker-url">
          <span class="derify-input no-padding-hor fz-15 fc-45">{{webroot}}/broker/</span>
          <span class="fc-85 fz-12">{{(broker.id || "").toLowerCase()}}</span>
        </div>

        <div class="account-label system-popup-line">
          <span class="fz-15"><span class="fc-red">*</span>&nbsp;<span class="fc-85">{{ $t('Broker.Broker.InfoEdit.Introduction') }}</span></span>
          <van-field class="derify-input no-padding-hor fz-15 fc-85"
                     rows="4"
                     placeholder=""
                     type="textarea" v-model="broker.introduction" @input="(val)=>{
                       this.broker.introduction = cutLength(val, 800)
                     }"/>
        </div>

        <div class="btn-wrap">
          <div class="derify-big-btn btn-yellow" @click="submitThenClose">{{ $t('Broker.Broker.InfoEdit.Commit') }}</div>
        </div>
      </div>

      <van-overlay :show="false" @click="showLoading = false" class-name="derify-loading-wrap">
        <van-loading size="2.4rem" v-show="false" vertical>{{ $t('global.TradePendingMsg') }}</van-loading>
      </van-overlay>

    </div>

  </div>
</template>

<script>
import Navbar from '@/components/Navbar'
import DerifyErrorNotice from "@/components/DerifyErrorNotice/DerifyErrorNotice";
import { BrokerInfo } from '@/api/broker'
import { getWebroot } from '@/config'
import { EVENT_WALLET_CHANGE } from '@/utils/web3Utils'
import { UserProcessStatus } from '@/store/modules/user'
import { countLength,cutLength } from '@/utils/utils'

export default {
  name: 'Home',
  components: {
    DerifyErrorNotice,
    Navbar
  },
  data () {
    const broker = new BrokerInfo()
    broker.broker = this.trader
    return {
      showLoading: false,
      webroot: getWebroot(),
      showError: false,
      errorMsg: '',
      broker: {...broker},
    }
  },
  mounted () {

    if(this.trader) {
      this.loadBrokerInfo()
    }


    this.$eventBus.$on(EVENT_WALLET_CHANGE, () => {
      this.loadBrokerInfo()
    })

    const logoFileItem = this.$refs.logo;
    const self = this;

    //picture preview
    logoFileItem.onchange =  function () {
      var file = logoFileItem.files[0];
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function (e) {
        self.broker.logo = e.target.result;
      };
    }
  },
  computed: {
    isLogin () {
      return this.$store.state.user.isLogin
    },
    trader () {
      return this.$store.state.user.selectedAddress
    }
  },
  methods: {
    countLength,cutLength,
    loadBrokerInfo() {
      this.$store.dispatch("broker/getBrokerByTrader", this.trader).then(broker => {
        if(!broker.broker) {
          broker.broker = this.trader
        }
        Object.assign(this.broker, broker)
      })
    },

    async checkForm() {
      if(!this.broker.broker) {
        this.errorNotice(this.$t('Broker.Broker.InfoEdit.InfoRequired'))
        return false
      }

      if(!this.broker.name) {
        this.errorNotice(this.$t('Broker.Broker.InfoEdit.InfoRequired'))
        return false
      }


      if(this.$refs.logo.files.length < 1 && !this.broker.logo) {
        this.errorNotice(this.$t('Broker.Broker.InfoEdit.InfoRequired'))
        return false
      }

      var file = this.$refs.logo.files[0];


      if(file && file.size > 2*1024*1024) {
        this.errorNotice(this.$t('Broker.Broker.InfoEdit.PhotoSizeError'))
        return false
      }

      if(!this.broker.id) {
        this.errorNotice(this.$t('Broker.Broker.InfoEdit.InfoRequired'));
        return false
      }

      if(!this.broker.introduction || this.broker.introduction.length < 1) {
        this.errorNotice(this.$t('Broker.Broker.InfoEdit.InfoRequired'));
        return false;
      }

      if(!/^[0-9a-zA-Z_@$]+$/.test(this.broker.id)){
        this.errorNotice(this.$t('Broker.Broker.InfoEdit.FormatError'));
        return false;
      }

      const resBroker = await this.$store.dispatch('broker/getBrokerByBrokerId', this.broker.id)
      if(resBroker && resBroker.id && resBroker.broker !== this.broker.broker) {
        this.errorNotice(this.$t('Broker.Broker.InfoEdit.CodeOccuError'))
        return false
      }

      this.errorNotice(null)

      return true
    },

    async submitThenClose () {

      const checkRet = await this.checkForm()
      if(!checkRet) {
        return
      }

      const param = {...this.broker}

      if(this.$refs.logo.files.length > 0){
        param.logo = this.$refs.logo.files[0]
      }else{
        param.logo = this.broker.logo
      }

      //this.$userProcessBox({show: true, status: UserProcessStatus.waiting, msg: this.$t('global.TradePendingMsg')})
      this.$store.dispatch('broker/updateBroker', param, {}).then((data) => {
        if(data.success) {
          this.$router.go(-1)
        }else{
          this.errorNotice(data.msg)
        }

      }).catch(e => {
        this.errorNotice(this.$t('global.TradeFailedMsg'))
      }).finally(() => {
        //this.$userProcessBox({show: false, status: UserProcessStatus.finished, msg: ''})
      });


    },
    errorNotice (msg) {
      if(msg){
        this.showError = true
        this.errorMsg = msg
      }else{
        this.showError = false
      }
    }
  }
}
</script>

<style lang="less">
.derify-loading-wrap{
  display: flex;
  align-items: center;
  justify-content: center;
  align-content: center;
}
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
    padding: 1.8rem;
  }

  .broker-avatar {
    padding: 1.1rem;
    position: relative;
    img{
      width: 5.5rem;
      height: 5.5rem;
      border-radius: 2.75rem;
    }
    .broker-avatar-file{
      width: 5.5rem;
      height: 5.5rem;
      opacity: 0;
      z-index: 100;
      position: absolute;
    }
  }

  .account-wrap {
    .account-label {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .system-popup-input{
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .van-cell {
        width: inherit;
      }
    }
  }

  .van-field__control{
    text-align: right;
    color: rgba(255,255,255,0.45);
  }

  textarea.van-field__control{
    text-align: left;
  }

  .fc-85 .van-field__control{
    color: rgba(255,255,255,0.85);
  }
  .system-popup-line {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .derify-input{
      width: auto;
    }

    .fc-85 .van-field__control{
      color: rgba(255,255,255,0.85);
    }
  }

  .derify-broker-url {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding-bottom: 1rem;
    .van-field__control{
      text-align: right;
      color: rgba(255,255,255,0.45);
    }
    .van-cell{
      width: auto;
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

  .account-label{
    margin-top: 1rem;
  }

  .broker-avatar-file{
    width: 100%;
    height: 100%;
    opacity: 0;
  }
}

</style>
