import Vue from 'vue'
import Fragment from 'vue-fragment'
import App from './App.vue'
import router from './router'
import store from './store'
import Vant from 'vant'
import { Lazyload } from 'vant';
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

Vue.use(Fragment.Plugin)

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
Vue.use(Lazyload);

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
  asyncInitWallet().then(async () => {
    const walletInfo = await getWallet()

    if(!walletInfo.isLogin){
      walletInfo.showWallet = true
    }else{
      walletInfo.showWallet = false
    }

    this.$store.commit("user/updateState", walletInfo)
  }).catch((e) => {
    console.error('init wallet failed',e);
  })
}

window.vexstore = store
window.vuexApp = vueApp


