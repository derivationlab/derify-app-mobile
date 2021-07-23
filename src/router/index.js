import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
import {getWallet} from "@/store/modules/user";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/home/Home')
  },
  {
    path: '/exchange',
    name: 'exchange',
    component: () => import('@/views/home/Home')
  },
  {
    path: '/broker',
    name: 'broker',
    component: () => import('@/views/Broker/broker')
  },
  {
    path: '/data',
    name: 'data',
    component: () => import('@/views/Data/data')
  },
  {
    path: '/earnings',
    name: 'earnings',
    component: () => import('@/views/Earnings/earnings')
  },
  {
    path: '/detail',
    name: 'detail',
    component: () => import('@/views/Earnings/detail/detail')
  },
  {
    path: '/transfer',
    name: 'transfer',
    component: () => import('@/views/transfer/component/transfer')
  },
  {
    path: '/account',
    name: 'account',
    component: () => import('@/views/transfer/account')
  },
  {
    path: '/financialDetails',
    name: 'financialDetails',
    component: () => import('@/views/transfer/component/financialDetails')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

router.beforeEach((to, from, next) => {
  if (window.ethereum && window.ethereum.isConnected() && window.ethereum.selectedAddress) { // 判断该路由是否需要登录权限
    store.commit("user/setShowWallet", false)
  } else {
    store.commit("user/setShowWallet", true)
  }
  next()
})



window.onload = function (){
  if(window.ethereum){
    window.ethereum.on('accountsChanged', function () {
      location.reload()
    })

    window.ethereum.on('chainChanged', function () {
      location.reload()
    })


    const walletInfo = getWallet()

    store.commit("user/updateState", walletInfo)
  }
}
