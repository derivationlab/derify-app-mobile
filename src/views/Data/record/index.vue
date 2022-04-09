<template>
  <div>
    <van-list
        :v-model="loading"
        :finished="finished"
        :loading-text="$t('global.Loading')"
        :finished-text="$t('global.NoMoreInfo')"
        @load="onLoad"
      >
      <div class="heard">
        <div>{{$t('Data.TradeHitory.List.Contract')}}</div>
        <div>{{$t('Data.TradeHitory.List.TradeType')}}</div>
        <div class="center-span">{{$t('Data.TradeHitory.List.Size')}}</div>
        <div class="center-span">{{$t('Data.TradeHitory.List.Time')}}</div>
      </div>
      <div class="heard">
        <div class="color-type">ETH / {{ usdTokenName }}</div>
        <div>
          <div class="color-type">{{$t('Data.Data.Token.Price')}}</div>
          <div class="unit-span mrt-5">{{$t('Data.Data.Token.TokenInfo')}}</div>
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
import {getUSDTokenName} from '@/config'

export default {
  data () {
    return {
      list: [],
      loading: false,
      finished: false
    }
  },
  computed:{
    usdTokenName(){
      return getUSDTokenName();
    }
  },
  methods: {
    onLoad () {

      setTimeout(() => {
        for (let i = 0; i < 10; i++) {
          this.list.push(this.list.length + 1)
        }

        this.loading = false

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
