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
import VueI18n from 'vue-i18n'
let locale = 'zh'
try {
  const curLngStr = localStorage.getItem('curLng')
  const lng = JSON.parse(curLngStr || '{}')
  console.log('main==>>lng', lng)
  if (lng.lng) {
    locale = lng.lng
    // store.commit('user/SET_CURLNG', lng)
  }
} catch (err) {
}
Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: locale, // 定义默认语言为中文
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
    W: ['日', '一', '二', '三', '四', '五', '六'][this.getDay()]
  }
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
  for (var k in o) { if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length))) }
  return fmt
}

new Vue({
  router,
  i18n,
  store,
  render: h => h(App)
}).$mount('#app')
