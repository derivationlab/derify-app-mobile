import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vant from 'vant'
import 'vant/lib/index.less'
import './styles/index.less'
import * as echarts from 'echarts'
import '@/utils/web3Utils'
import '@/utils/filters'
import '@/utils/contractUtil.js'
import VueI18n from 'vue-i18n'
import UserProcessBox from './components/UserProcessBox'
import {asyncInitWallet, getWallet, handleEthereum} from './store/modules/user'
import { EVENT_WALLET_CHANGE } from './utils/web3Utils'
let locale = 'en'
try {
  const curLngStr = sessionStorage.getItem('locale')
  const lng = JSON.parse(curLngStr || '{}')

  if (lng.locale) {
    locale = lng.locale
    // store.commit('user/SET_CURLNG', lng)
    // this.$i18n.locale = locale
    // console.log(this.$i18n.locale)
  }
} catch (err) {
}
Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: locale, // set default language
  messages: {
    zh: require('@/assets/languages/zh.json'),
    en: require('@/assets/languages/en.json')
  }
})
Vue.prototype.$echarts = echarts
Vue.use(Vant)
Vue.config.productionTip = false

/* eslint-disable */
Date.prototype.Format = function (fmt) {
  var o = {
    'M+': this.getMonth() + 1, // month
    'd+': this.getDate(), // day
    'h+': this.getHours(), // hour
    'm+': this.getMinutes(), // min
    's+': this.getSeconds(), // sec
    'q+': Math.floor((this.getMonth() + 3) / 3), // quarter
    S: this.getMilliseconds(), // ms
    W: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'][this.getDay()]
  }
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
  for (var k in o) { if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length))) }
  return fmt
}

// Vue.config.errorHandler = (err, vm, info) => {
//   console.log.apply(console, arguments);
// }

const vueApp = new Vue({
  router,
  i18n,
  store,
  render: h => h(App)
}).$mount('#app')

/**
 *
 * @param {{show: Boolean,status: UserProcessStatus,msg:String}} param
 */
Vue.prototype.$userProcessBox = function (param) {
  UserProcessBox.install(i18n, param)
}

Vue.prototype.$eventBus = vueApp

Vue.prototype.$loginWallet = function () {
  asyncInitWallet().then(() => {
    const walletInfo = getWallet()

    if(!walletInfo.isLogin){
      walletInfo.showWallet = true
    }else{
      walletInfo.showWallet = false
    }

    this.$store.commit("user/updateState", walletInfo)
  }).catch(() => {
    console.log('init wallet failed')
  })
}

window.onload = function (){
  if(window.ethereum){
    window.ethereum.on('accountsChanged', function () {
      updateWallet(1)
    })

    window.ethereum.on('chainChanged', function () {
      updateWallet(2)
    })

    updateWallet()
  }else{
    window.addEventListener('ethereum#initialized', updateWallet, {
      once: true,
    });

    // If the event is not dispatched by the end of the timeout,
    // the user probably doesn't have MetaMask installed.
    setTimeout(updateWallet, 3000); // 3 seconds
  }
}

window.vexstore = store
window.vuexApp = vueApp

function updateWallet (eventType = 0) {

  asyncInitWallet().then(async () => {
    const walletInfo = await getWallet()

    if(walletInfo.isLogin && !walletInfo.hasBroker) {
      if(vueApp.$route.name === 'home' && vueApp.$route.params.id){
        await store.dispatch('broker/bindBroker', {trader: walletInfo.selectedAddress, brokerId: vueApp.$route.params.id}).then((data) => {
          this.$toast(data.msg)
        }).catch(e => {
          this.$toast(e)
        })
      }else{
        return await vueApp.$router.push({name: 'brokerAdd'})
      }
    }

    if(store.state.user.selectedAddress !== walletInfo.selectedAddress) {
      eventType = 1
    }
    store.commit("user/updateState", walletInfo)

    vueApp.$eventBus.$emit(EVENT_WALLET_CHANGE, eventType)

  }).catch(() => {
    console.log('init wallet failed')
  })
}


