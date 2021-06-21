import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 一次性引入Vant组件
import Vant from 'vant'
// TODO:flexible.js 的使用暂不明确
// import './js/flexible.js'
// 自定义vant主题色步骤一引入全部组件样式
import 'vant/lib/index.less'
import './styles/index.less'
// 引入 echarts
// import echarts from 'echarts'
import * as echarts from 'echarts'
import '@/utils/web3Utils'
import VueI18n from 'vue-i18n'
let locale = 'zh'
try {
  const curLngStr = localStorage.getItem('curLng')
  const lng = JSON.parse(curLngStr || '{}')
  console.log('main==>>lng', lng)
  if (lng.lng) {
    locale = lng.lng
    store.commit('user/SET_CURLNG', lng)
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
new Vue({
  router,
  i18n,
  store,
  render: h => h(App)
}).$mount('#app')
