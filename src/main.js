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

Vue.prototype.$echarts = echarts
Vue.use(Vant)
Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
