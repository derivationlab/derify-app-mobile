<template>
  <div>
    <van-list
        v-model="loading"
        :finished="finished"
        :finished-text="$t('data.NoMoreData')"
        @load="onLoad"
      >
      <div class="heard">
        <div>{{$t('data.contract')}}</div>
        <div>{{$t('data.dealingSlip')}}</div>
        <div class="center-span">{{$t('data.freightSpace')}}</div>
        <div class="center-span">{{$t('data.Time')}}</div>
      </div>
      <div class="heard">
        <div class="color-type">ETH / USDT</div>
        <div>
          <div class="color-type">{{$t('data.open')}}</div>
          <div class="unit-span mrt-5">{{$t('data.more')}}</div>
        </div>
        <div class="center-span">
          <div class="color-type">7890.12</div>
          <div class="unit-span mrt-5">ETH</div>
        </div>
        <div class="center-span unit-span">
          2021-12-31
        </div>
      </div>
        <!-- <van-cell v-for="item in list" :key="item" :title="item" /> -->
      </van-list>
  </div>
</template>
<script>
export default {
  data () {
    return {
      list: [],
      loading: false,
      finished: false
    }
  },
  methods: {
    onLoad () {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      setTimeout(() => {
        for (let i = 0; i < 10; i++) {
          this.list.push(this.list.length + 1)
        }
        // 加载状态结束
        this.loading = false
        // 数据全部加载完成
        if (this.list.length >= 40) {
          this.finished = true
        }
      }, 1000)
    }
  }
}
</script>
<style lang="less" scoped>
.heard{
  margin: 2.4rem 0;
  display: flex;
  div{
    flex: 1;
    color: rgba(255,255,255,0.45);
    font-size: 1.3rem;
  }
  .center-span{
    width: 10%;
    text-align:center;
  }
  .unit-span{
    color: rgba(255,255,255,0.45);
    font-weight: 400;
  }
  .color-type{
    color: rgba(255,255,255,0.85);
  }
}

</style>
