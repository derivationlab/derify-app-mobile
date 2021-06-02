import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/home/Home.vue'
import broker from '../views/Broker/broker.vue' // 经济商
import data from '../views/Data/data.vue' // 数据
import earnings from '../views/Earnings/earnings.vue' // 收益
import detail from '../views/Earnings/detail/detail.vue' // 流水明细

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
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
