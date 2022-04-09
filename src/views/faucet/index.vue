<template>
  <div class="home-container page-container">
    <navbar :title="$t('Faucet.Faucet')" :logo="false"/>
    <div class="home-mid">
      <div class="market-popup system-popup">
        <DerifyErrorNotice :show="showError" @close="errorNotice(null)">
          {{errorMsg}}
        </DerifyErrorNotice>

        <div class="home-mid-input">
          <div class="fc-85 fz-15">{{$t("Faucet.Address")}}</div>
          <van-field readonly class="derify-big-input" type="text" placeholder="" input-align="center" v-model="tokenAddress"/>
        </div>

<!--        <div v-if="!usdtClaimed" style="display:flex;justify-content: center;margin-top: 2rem;">-->
<!--          <vue-recaptcha language="en" sitekey="6Lev3DIeAAAAAD5fDP3f12cMzgmPfu9qZaOMdQYd" @verify="(res) =>{-->
<!--            this.userToken = res;-->
<!--          }" @expired="() => {-->
<!--            this.userToken = null;-->
<!--          }"></vue-recaptcha>-->
<!--        </div>-->

        <div class="btn-wrap">
          <a href="https://form.jotform.com/220268814408052" target="_blank">
            <div class="derify-big-btn btn-yellow">
              <DerifyI18n text="Faucet.GetUSDT" :params="getUSDTDesc"/>
            </div>
          </a>
          <ButtonLoginWrap className="derify-big-btn btn-yellow">
<!--            <div v-if="usdtClaimed" class="derify-big-btn disabled-btn">-->
<!--              <DerifyI18n text="Faucet.GetUSDT" :params="getUSDTDesc"/>-->
<!--            </div>-->

<!--            <template v-else>-->
<!--              <a href="https://form.jotform.com/220268814408052" target="_blank">-->
<!--                <div :class="userToken ? 'derify-big-btn btn-yellow' : 'derify-big-btn btn-black'">-->
<!--                  <DerifyI18n text="Faucet.GetUSDT" :params="getUSDTDesc"/>-->
<!--                </div>-->
<!--              </a>-->
<!--            </template>-->

            <template v-if="curChain.chainId === ChainEnum.Rinkeby.chainId">
              <p class="code-wrap"><a class="fc-yellow" href="https://www.rinkeby.io/#faucet" target="_blank">{{ $t('Faucet.GetETH') }}</a></p>
            </template>
            <template v-if="curChain.chainId === ChainEnum.BSC.chainId">
              <p class="code-wrap"><a class="fc-yellow" href="https://testnet.binance.org/faucet-smart" target="_blank">{{ $t('Faucet.GetBNB') }}</a></p>
            </template>
          </ButtonLoginWrap>
        </div>
      </div>
    </div>

    <van-overlay :show="loading" class-name="derify-loading-wrap">
      <van-loading size="2.4rem" v-show="loading" vertical>{{ $t('global.TradePendingMsg') }}</van-loading>
    </van-overlay>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar'
import DerifyErrorNotice from "@/components/DerifyErrorNotice/DerifyErrorNotice";
import ButtonLoginWrap from '@/components/ButtonLoginWrap/ButtonLoginWrap'
import {isUSDTClaimed, sendUSDT} from '@/api/trade'
import {ChainEnum, UserProcessStatus} from '@/store/modules/user'
import {Token} from '@/utils/contractUtil'
import DerifyI18n from "@/components/DerifyI18n";
import {VueRecaptcha} from 'vue-recaptcha';

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
    DerifyI18n,
    ButtonLoginWrap,
    DerifyErrorNotice,
    // VueRecaptcha,
    Navbar
  },
  data () {
    const defaultUSDTAmount = 100000;
    return {
      ChainEnum,
      showError: false,
      errorMsg: '',
      loading: false,
      usdtClaimed: true,
      getUSDTDesc: {0: `<DecimalView value="${defaultUSDTAmount}" digitSplit=","/>`},
      tokenAddress:Token.USDT,
      userToken: null,
      defaultUSDTAmount
    }
  },

  computed: {
    isLogin () {
      return this.$store.state.user.isLogin
    },
    trader () {
      return this.$store.state.user.selectedAddress;
    },
    curChain(){
      return this.$store.state.user.chainEnum;
    }
  },
  created() {
    this.updateUsdtCalainmState();
    this.$events.$on('afterInitWallet', () => {
      this.updateUsdtCalainmState();
    });
  },
  methods: {
    updateUsdtCalainmState(){
      isUSDTClaimed(this.trader).then((res) => {
        this.usdtClaimed = res;
      }).catch(e => {
        console.log('error', e);
      })
    },
    async submitThenClose () {

      if(this.usdtClaimed){
        this.$userProcessBox({show: true, status: UserProcessStatus.failed, msg: this.$t('Faucet.GetUSDTError')});
        return;
      }

      if(!this.userToken){
        return;
      }

      if(this.loading){
        return;
      }

      this.loading = true;
      if(!this.trader){
        this.loading = false;

        this.$userProcessBox({show: true, status: UserProcessStatus.waiting, msg: 'error input!'});
        return;
      }

      sendUSDT(this.trader, this.defaultUSDTAmount, this.userToken).then((data) => {

        if(data.code === 0){
          this.usdtClaimed = true
          this.$userProcessBox({show: true, status: UserProcessStatus.success, msg: 'success'});
          addTestTokentoWallet();
        }else{
          this.$userProcessBox({show: true, status: UserProcessStatus.failed, msg: this.$t('Faucet.GetUSDTError')});
        }

      }).catch(e => {
        this.$userProcessBox({show: true, status: UserProcessStatus.failed, msg: this.$t('Faucet.GetUSDTError')});
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

  .van-loading--vertical{
    height: 100%;
    width: 100%;
    justify-content: center;
  }
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
