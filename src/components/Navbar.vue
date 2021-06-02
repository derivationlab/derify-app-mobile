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
  <van-popup class="menu-popup" v-model="show" position="left">
    <div class="head-info">
      <div class="head-info-left">
        <div class="first-letter-wrap">W</div>
        <div class="info-div">
          <div class="info-name">WETWE</div>
          <div>275fdwqe23jkds</div>
        </div>
      </div>
      <van-icon name="arrow" size="2.2rem" color="rgba(255, 255, 255, .85)"></van-icon>
    </div>
    <div class="menu-list">
      <div class="menu-list-item" @click="changeRouter('home')" :class="$route.name === 'home' ? 'active' : ''">
        <img class="menu-list-item-icon" src="@/assets/icons/icon-menu-active.png" alt="">
        <van-icon class="menu-list-item-van-icon" name="home-o" color="rgba(255, 255, 255, .85)" size="2.0rem"></van-icon>
        <div class="menu-list-item-name">Home</div>
      </div>
      <div class="menu-list-item" @click="changeRouter('exchange')" :class="$route.name === 'exchange' ? 'active' : ''">
        <img class="menu-list-item-icon" src="@/assets/icons/icon-menu-active.png" alt="">
        <van-icon class="menu-list-item-van-icon" name="exchange" color="rgba(255, 255, 255, .85)" size="2.0rem"></van-icon>
        <div class="menu-list-item-name">Exchange</div>
      </div>
      <div class="menu-list-item" @click="changeRouter('data')" :class="$route.name === 'data' ? 'active' : ''">
        <img class="menu-list-item-icon" src="@/assets/icons/icon-menu-active.png" alt="">
        <van-icon class="menu-list-item-van-icon" name="bar-chart-o" color="rgba(255, 255, 255, .85)" size="2.0rem"></van-icon>
        <div class="menu-list-item-name">Dashboard</div>
      </div>
      <div class="menu-list-item" @click="changeRouter('earnings')" :class="$route.name === 'earnings' ? 'active' : ''">
        <img class="menu-list-item-icon" src="@/assets/icons/icon-menu-active.png" alt="">
        <van-icon class="menu-list-item-van-icon" name="bag-o" color="rgba(255, 255, 255, .85)" size="2.0rem"></van-icon>
        <div class="menu-list-item-name">Yield</div>
      </div>
      <div class="menu-list-item" @click="changeRouter('brokers')" :class="$route.name === 'brokers' ? 'active' : ''">
        <img class="menu-list-item-icon" src="@/assets/icons/icon-menu-active.png" alt="">
        <van-icon class="menu-list-item-van-icon" name="friends-o" color="rgba(255, 255, 255, .85)" size="2.0rem"></van-icon>
        <div class="menu-list-item-name">Brokers</div>
      </div>
    </div>
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
    },
    changeRouter (name) {
      this.$router.push({ name })
      this.show = false
    }
  }
}
</script>

<style lang="less">
.head-info {
  padding: 10rem 2rem 2.4rem 2rem;
  border-bottom: .1rem solid rgba(255, 255, 255, .15);
  display: flex;
  justify-content: space-between;
  align-items: center;
  &-left {
    display: flex;
    .first-letter-wrap {
      width: 5rem;
      height: 5rem;
      border-radius: 50%;
      font-size: 1.6rem;
      border: .1rem solid rgba(255, 255, 255, .15);
      text-align: center;
      line-height: 5rem;
    }
    .info-div {
      margin-left: 2rem;
      padding: .5rem 0;
      height: 5rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: flex-start;
      font-size: 1.2rem;
      .info-name {
        font-size: 1.6rem;
        font-weight: 700;
      }
    }
  }
}
.menu-list {
  margin-top: 2.4rem;
  &-item {
    display: flex;
    height: 6.4rem;
    align-items: center;
    &-name {
      font-size: 1.7rem;
      color: rgba(255, 255, 255, .85);
      margin-left: 1.6rem;
    }
    &-icon {
      width: .8rem;
      height: 6.4rem;
      display: none;
    }
    &-van-icon {
      margin-left: 2.8rem;
    }
    &.active {
      background: #201B48;
      .menu-list-item-name {
        color: @orange;
      }
      .menu-list-item-icon {
        display: block;
      }
      .menu-list-item-van-icon {
        margin-left: 2rem;
      }
    }
  }
}
</style>
