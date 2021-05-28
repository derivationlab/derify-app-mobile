<template>
  <div class="home">
    <van-nav-bar title="首页" :border="false" :fixed="true">
      <template #left>
        <img  @click="ClickBox" src="@/assets/images/uil_bars.png" alt="" srcset="">
      </template>
      <template #title>
        <img src="@/assets/images/logo.png" alt="" srcset="">
      </template>
    </van-nav-bar>
          <van-popup
      v-model="show"
      :style="{ height: '100%', width: '60%',}"
      position="left"
    >
    <div class="headDiv">
      <div class="imgDiv">
        <img src="@/assets/logo.png" alt="" width="50px" height="50px">
      </div>
      <div class="infoDiv">
        <span>甩哥</span>
        <span>275fdfd39782ndfs67</span>
      </div>
    </div>
            <van-list router>
        <van-cell to="/" :border="false"
          ><van-icon
            color="#FFFFFF"
            size="0.853333rem"
            name="home-o"
          /><span class="spSize">Home</span></van-cell
        >
        <van-cell to="/" :border="false"
          ><van-icon color="#FFFFFF" size="0.853333rem" name="exchange" /><span
            class="spSize"
            >Exchange</span
          ></van-cell
        >
        <van-cell to="/" :border="false"
          ><van-icon color="#FFFFFF" size="0.853333rem" name="chart-trending-o" /><span
            class="spSize"
            >Dashboard</span
          ></van-cell
        >
        <van-cell to="/" :border="false"
          ><van-icon color="#FFFFFF" size="0.853333rem" name="point-gift-o" /><span
            class="spSize"
            >Yield</span
          ></van-cell
        >
        <van-cell to="/" :border="false"
          ><van-icon color="#FFFFFF" size="0.853333rem" name="friends-o" /><span
            class="spSize"
            >经纪商</span
          ></van-cell
        >
            </van-list>
    </van-popup>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      show: false
    }
  },
  beforeCreate () {
    this.$store.dispatch('user/login')
  },
  methods: {
    ClickBox () {
      this.show = true
    }
  }
}
</script>

<style lang="less" scoped>
  .headDiv{
    display: flex;
    align-items: center;
    margin-top: 2.5rem;
    padding-left: 16px;
    padding-bottom: .6rem;
    border-bottom: 1px solid rgb(190, 190, 190);
    .imgDiv{
      margin-right: 16px;
        img{
          border-radius: 50%;
        }
    }
    .infoDiv{
      display: flex;
      flex-direction: column;
      line-height: 32px;
      span:nth-child(1){
        font-size: 16px;
        color: rgba(255,255,255,0.85);
      }
       span:nth-child(2){
        font-size: 14px;
        color: rgba(255,255,255,0.85);
      }
    }
  }

  .spSize{
      margin-left: 18px;
      color: #FFFFFF;
    }
</style>
