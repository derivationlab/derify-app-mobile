import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/home/Home.vue'
import broker from '../views/Broker/broker.vue' // 经济商
import data from '../views/Data/data.vue' // 数据
import earnings from '../views/Earnings/earnings.vue' // 收益
import detail from '../views/Earnings/detail/detail.vue' // 流水明细
import account from '../views/transfer/account.vue' // 交易账户
import financialDetails from '../views/transfer/component/financialDetails.vue' // 资金明细
import topUp from '../views/transfer/component/topUp.vue' // 资金充值
import extract from '../views/transfer/component/extract.vue' // 资金提取

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'home',
    component: Home
  },
  {
    path: '/exchange',
    name: 'exchange',
    component: Home
  },
  {
    path: '/broker',
    name: 'broker',
    component: broker
  },
  {
    path: '/data',
    name: 'data',
    component: data
  },
  {
    path: '/earnings',
    name: 'earnings',
    component: earnings
  },
  {
    path: '/detail',
    name: 'detail',
    component: detail
  },
  {
    path: '/topUp',
    name: 'topUp',
    component: topUp
  },
  {
    path: '/account',
    name: 'account',
    component: account
  },
  {
    path: '/financialDetails',
    name: 'financialDetails',
    component: financialDetails
  },
  {
    path: '/extract',
    name: 'extract',
    component: extract
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
