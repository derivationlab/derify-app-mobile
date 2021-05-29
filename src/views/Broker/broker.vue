<template>
  <div class="home-container page-container">
    <navbar :logo="true" title="经济商" />
    <div class="home-top">
      <span>账户余额</span>
      <div>
        <span> 23,456.78</span>
        <span>USDT</span>
      </div>
      <div>
        <div>
          <span>24,691.34</span>
          <span>今日收入 ( USDT )</span>
        </div>
        <div>
          <span>24,691.34</span>
          <span>累计收入 ( USDT )</span>
        </div>
      </div>
      <div><span>充值</span></div>
      <div><span>提现</span></div>
      <p>经销商权益有效期<span>365</span>天，至 2048 年 12月 31日</p>
      <div>
        <span>说明：</span>
        <ul>
          <li>平台采取经纪商制度。所有的交易者只能通过访问经纪商的交易页面进行交易，Derify protocol并不直接面向交易者提供服务。</li>
          <li>经纪商可以持续获得手续费奖励（未来还将获得额外的DRF奖励）。</li>
          <li> 经纪商需要燃烧eDRF才能保持享有该权益（当前，每600个eDRF可以维持一天的经纪商收益）。 </li>
          <li>权益有效期到期后将无法获得经纪商奖励，但仍会保持经纪商身份， 您可以随时燃烧eDRF恢复经纪商奖励权益。</li>
        </ul>
      </div>
      <van-tabs v-model="active" background="#140B32" color="#FAE247" title-active-color="#FAE247">
        <van-tab title="账户流水"><trader></trader></van-tab>
        <van-tab title="交易者信息"><account></account></van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar'
import trader from './trader/index.vue'
import account from './account/index.vue'
export default {
  name: 'Home',
  components: {
    Navbar,
    trader,
    account
  },
  data () {
    return {
      show: false,
      active: '1'
    }
  },
  created () {
  },
  methods: {

  }
}
</script>

<style lang="less" scoped>
</style>
