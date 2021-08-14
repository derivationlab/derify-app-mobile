<template>
  <div>
    <van-list
        v-model="loading"
        :finished="finished"
        :loading-text="$t('Trade.OpenPosition.Loading')"
        :finished-text="$t('Brokers.NoMoreData')"
        @load="onLoad"
      >
      <div class="heard">
        <div>{{$t('Brokers.Type')}}</div>
        <div class="rigth-span">{{$t('Brokers.Time')}}</div>
      </div>
      <div class="heard">
        <div class="color-type width-70">0x40d276e6a7C80562BB1848e3ACB7B7629234C5a6</div>
        <div class="rigth-span unit-span width-30">
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
  justify-content: space-between;
  div{
    flex: 1;
    color: rgba(255,255,255,0.45);
    font-size: 1.3rem;
  }
  .rigth-span{
    text-align:right;
  }
  .unit-span{
    color: rgba(255,255,255,0.45);
    font-weight: 400;
  }
  .color-type{
    color: rgba(255,255,255,0.85);
  }
  .width-70{
    width: 70%;
    word-break: break-all;
  }
  .width-30{
    width: 30%;
  }
}

</style>
