<template>
  <div class="home-container page-container">
    <navbar :title="$t('Trade.BrokerBind.BrokerCodes.BindBrokerPrivilege')" :logo="false" :showGoback="true"/>
    <div class="home-mid">
      <div class="market-popup system-popup">
        <DerifyErrorNotice :show="showError" @close="errorNotice(null)">
          {{errorMsg}}
        </DerifyErrorNotice>

        <div class="home-mid-input">
          <div class="fc-85 fz-15">{{$t("Faucet.Address")}}</div>
          <van-field readonly class="derify-big-input" type="text" placeholder="" input-align="center" v-model="trader"/>
        </div>

        <div class="btn-wrap">
          <ButtonLoginWrap className="derify-big-btn btn-yellow">
            <div class="derify-big-btn btn-yellow" @click="submitThenClose">{{ $t('Faucet.GetUSDT', [defaultUSDTAmount]) }}</div>
            <p class="code-wrap"><a class="fc-yellow" href="https://www.rinkeby.io/#faucet" target="_blank">{{ $t('Faucet.GetETH') }}</a></p>

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
import { sendUSDT } from '@/api/trade'
import { UserProcessStatus } from '@/store/modules/user'
import { Token } from '@/utils/contractUtil'

const addTestTokentoWallet = async() => {
  const tokenAddress = Token.USDT;
  const tokenSymbol = 'USDT';
  const tokenDecimals = 18;
  const tokenImage = null;

  try {
    // wasAdded is a boolean. Like any RPC method, an error may be thrown.
    const wasAdded = await window.ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20', // Initially only supports ERC20, but eventually more!
        options: {
          address: tokenAddress, // The address that the token is at.
          symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
          decimals: tokenDecimals, // The number of decimals in the token
          image: tokenImage, // A string url of the token logo
        },
      },
    });
  } catch (error) {
    console.log(error);
  }
};

export default {
  name: 'faucet',
  components: {
    ButtonLoginWrap,
    DerifyErrorNotice,
    Navbar
  },
  data () {
    const defaultUSDTAmount = 100000;
    return {
      showError: false,
      errorMsg: '',
      loading: false,
      defaultUSDTAmount
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
      this.loading = true;
      if(!this.trader){
        this.loading = false;

        this.$userProcessBox({show: true, status: UserProcessStatus.waiting, msg: 'error input!'});
        return;
      }

      sendUSDT(this.trader, this.defaultUSDTAmount).then((data) => {

        if(data.code === 0){
          addTestTokentoWallet();
          this.$userProcessBox({show: true, status: UserProcessStatus.success, msg: 'success'});
        }else{
          this.$userProcessBox({show: true, status: UserProcessStatus.failed, msg: data.msg});
        }

      }).catch(e => {
        this.$userProcessBox({show: true, status: UserProcessStatus.failed, msg: !e ? 'failed' :  e.msg});
      }).finally(() => {
        this.loading = false;
      });
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
