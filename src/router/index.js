import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/home/Home.vue'
import broker from '../views/Broker/broker.vue'
import data from '../views/Data/data.vue'
import earnings from '../views/Earnings/earnings.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/Home'
  },
  {
    path: '/Home',
    name: 'Home',
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
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
