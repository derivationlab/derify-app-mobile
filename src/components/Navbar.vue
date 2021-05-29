<template>
<div class="navbar-container">
  <van-nav-bar :title="title" :border="false" :fixed="true">
    <template #left>
      <img @click="ClickBox" src="@/assets/images/uil_bars.png" alt="" srcset="">
    </template>
    <template #title v-if="logo">
      <img src="@/assets/images/logo.png" alt="" srcset="">
    </template>
  </van-nav-bar>
  <van-popup class="wrap-navbar-popup" v-model="show" :style="{ height: '100%', width: '60%',}" position="left">
    <div class="headDiv">
      <div class="imgDiv">
        <img src="@/assets/logo.png" alt="" width="50px" height="50px">
      </div>
      <div class="infoDiv">
        <span>甩哥SSSSassjdnkawd</span>
        <span>275fdfd39782ndfs67</span>
      </div>
    </div>
    <van-list router>
      <van-cell to="/" :border="false" title="Home" icon="home-o" />
      <van-cell to="/" :border="false" title="Exchange" icon="exchange" />
      <van-cell to="/" :border="false" title="Dashboard" icon="chart-trending-o" />
      <van-cell to="/earnings" :border="false" title="Earnings" icon="gold-coin-o" />
      <van-cell to="/data" :border="false" title="Data" icon="point-gift-o" />
      <van-cell to="/broker" :border="false" title="Broker" icon="friends-o" />
    </van-list>
  </van-popup>
</div>
</template>

<script>
export default {
  props: ['logo', 'title'],
  data () {
    return {
      show: false
    }
  },
  methods: {
    ClickBox () {
      this.show = true
    }
  }
}
</script>

<style lang="less">
    .headDiv {
      display: flex;
      align-items: center;
      margin-top: 2.5rem;
      padding-left: 16px;
      padding-bottom: .6rem;
      border-bottom: 1px solid rgb(190, 190, 190);

      .imgDiv {
        margin-right: 16px;

        img {
          border-radius: 50%;
        }
      }

      .infoDiv {
        display: flex;
        flex-direction: column;
        line-height: 32px;

        span:nth-child(1) {
          font-size: 16px;
          color: rgba(255, 255, 255, 0.85);
        }

        span:nth-child(2) {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.85);
        }
      }
    }

    .spSize {
      margin-left: 18px;
      color: #FFFFFF;
    }
</style>
