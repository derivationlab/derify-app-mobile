import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
import { asyncInitWallet, getWallet } from '@/store/modules/user'

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject);
  return originalPush.call(this, location).catch(err => err);
};

Vue.use(VueRouter)

const routes = [
  {
    path: '*',
    redirect: '/trade'
  },
  {
    path: '/trade',
    name: 'home',
    component: () => import('@/views/home/Home')
  },
  {
    path: '/broker/:id',
    name: 'brokerBind',
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
    path: '/reward',
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
  },
  {
    path: '/bind/list',
    name: 'brokerApply',
    component: () => import('@/views/Broker/apply/apply')
  },
  {
    path: '/bind',
    name: 'brokerAdd',
    component: () => import('@/views/Broker/apply/add')
  },
  {
    path: '/broker-info/:id?',
    name: 'brokerInfo',
    component: () => import('@/views/Broker/apply/info')
  },
  {
    path: '/faucet',
    name: 'faucet',
    component: () => import('@/views/faucet/index')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach(async (to, from, next) => {
  // const isBindBrokerPath = to.name === 'brokerApply' || to.name === 'brokerAdd';
  //
  // if(!store.state.user.isLogin){
  //   return next()
  // }
  //
  // if (!isBindBrokerPath && !store.state.user.hasBroker) {
  //   //return next({path: '/bind'})
  // } else if(isBindBrokerPath && store.state.user.hasBroker){
  //   //return next({path: '/trade'})
  // }else{
  //   next()
  // }
  return next();
});


export default router
