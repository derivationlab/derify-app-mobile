import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 一次性引入Vant组件
// import Vant from 'vant'
// import 'vant/lib/index.css'
// 自定义vant主题色步骤一引入全部组件样式
import './js/flexible.js'
import 'vant/lib/index.less'
import './styles/index.less'

// Vue.use(Vant)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
