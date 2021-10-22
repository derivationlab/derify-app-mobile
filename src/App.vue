<template>
  <div id="app">
    <fragment :is="container">
    </fragment>
    <debug-console-view/>
  </div>
</template>

<style lang="less">
#app{
  background-color: #140B32;
  min-height: 100vh;
}
</style>
<script>
import DebugConsoleView from "@/components/DebugConsoleView/DebugConsoleView";
import { createDataEvenet } from '@/api/trade'
import Bind from '@/views/Broker/apply/add'
import Trade from '@/views/home/Home'
import { asyncInitWallet, getWallet } from '@/store/modules/user'
import store from '@/store'
import { EVENT_WALLET_CHANGE } from '@/utils/web3Utils'
import Vue from 'vue'

const brokerBindPath = "/bind";
const tradePath = "/trade";
const brokerPath = "/broker";

let eventSource = null;

const RouterView = Vue.compile("<router-view></router-view>");

export default {
  components: {DebugConsoleView},
  data() {
    return {
      container: null
    }
  },
  computed:{
    curPair () {
      const {curPairKey, pairs} = this.$store.state.contract
      return pairs.find(pair => pair.key === curPairKey)
    },
    hasBroker() {
      return this.$store.state.user.hasBroker;
    },
    isLogin(){
      return this.$store.state.user.isLogin;
    },
    trader(){
      return this.$store.state.user.trader;
    },
    slefBrokerId() {
      return this.$store.state.user.brokerInfo.broker;
    }
  },
  mounted () {
    this.resetRoute();
  },
  methods:{
    async resetRoute(){
      const self = this;

      const [,rootPath, pathBrokerId] = location.pathname.split("/");
      const isBrokerReferPage = (`/${rootPath}` === brokerPath) && !!pathBrokerId;
      const isBrokerBindPath = location.pathname.toLowerCase().startsWith(brokerBindPath);

      const walletInfo = await this.$store.dispatch("user/initWallet");
      if(!walletInfo.isLogin){
        self.container = Bind;
        return;
      }

      if(isBrokerReferPage && pathBrokerId && walletInfo.slefBrokerId && pathBrokerId.toLowerCase() === walletInfo.slefBrokerId.toLowerCase()){
        self.container = Trade;
        return;
      }

      if(!walletInfo.hasBroker){
        if(isBrokerReferPage){
          self.$store.dispatch('user/bindBroker', {trader: self.trader, brokerId: pathBrokerId}).then((data) => {
            if(data.success){
              self.container = Trade;
            }
          }).catch(e => {
            console.log('bindBroker error', e);
            self.container = Bind;
          });
        }else if(!isBrokerBindPath){
          self.$router.push({path: brokerBindPath});
          self.container = Bind;
        }else{
          self.container = Bind;
        }
        return;
      }

      self.container = RouterView;
      if(isBrokerBindPath){
        self.$router.push({name: 'home'});
      }


    },
    bindEthrumEvent(){
      const self = this;
      window.ethereum.on('accountsChanged', function () {
        self.updateWallet(1);
      })

      window.ethereum.on('chainChanged', function () {
        self.updateWallet(2);
      })
    },
    async updateWallet (eventType = 0) {
      const self = this;

      const walletInfo = await this.$store.dispatch('user/initWallet');

      self.resetRoute();

      if(self.$store.state.user.selectedAddress !== walletInfo.selectedAddress) {
        eventType = 1
      }

      this.$eventBus.$emit(EVENT_WALLET_CHANGE, eventType)
    }
  },
  events:{
    afterInitWallet(){
      this.resetRoute()
    }
  },
  created () {
    const self = this;

    this.$events.$on('afterInitWallet', () => this.resetRoute());

    //bind chain event
    (async() => {
      if(window.ethereum){
        self.bindEthrumEvent();
      }else{
        let ethereumInitialized = false;
        window.addEventListener('ethereum#initialized', () =>{
          self.bindEthrumEvent();
          self.updateWallet(1);
          ethereumInitialized = true;
        }, {
          once: true,
        });

        // If the event is not dispatched by the end of the timeout,
        // the user probably doesn't have MetaMask installed.
        setTimeout(() => {
          if(!ethereumInitialized){
            self.bindEthrumEvent();
            self.updateWallet(1);
          }
        }, 3000); // 3 seconds
      }
    })();

    if(eventSource){
      eventSource.close();
      eventSource = null;
    }

    eventSource = createDataEvenet((datas) => {
      datas.forEach((data) => {
        if(data.token === self.curPair.address){
          self.$store.commit('contract/SET_CONTRACT_DATA', {longPmrRate: data.longPmrRate * 100, shortPmrRate: data.shortPmrRate * 100})
        }

        self.$store.dispatch('contract/updateAllPairPrice', {token: data.token, priceChangeRate: data.price_change_rate})
      });
    });
  },
  beforeDestroy () {
    if(!eventSource){
      eventSource.close();
      eventSource = null;
    }
  }
}
</script>
