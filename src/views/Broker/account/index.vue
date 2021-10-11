<template>
  <div>
    <van-list
        v-model="loading"
        :finished="finished"
        :loading-text="$t('global.Loading')"
        @load="onLoad"
      >
      <div class="heard">
        <div>{{$t('Broker.Broker.TraderInfo.TraderAddress')}}</div>
        <div class="rigth-span">{{$t('Broker.Broker.TraderInfo.RegistrationDate')}}</div>
      </div>
      <template v-for="(data,key) in list">
        <div class="heard" :key="key">
          <div class="color-type width-70">{{data.trader}}</div>
          <div class="rigth-span unit-span width-30">
            {{new Date(data.update_time).Format("yyyy-MM-dd hh:mm:ss")}}
          </div>
        </div>
      </template>
        <!-- <van-cell v-for="item in list" :key="item" :title="item" /> -->
    </van-list>
  </div>
</template>
<script>

export default {
  props: ['broker'],
  data () {
    return {
      list: [],
      page: 0,
      size: 10,
      loading: false,
      finished: false
    }
  },
  methods: {
    onLoad () {
      this.loading = true
      this.finished = false
      this.$store.dispatch('broker/getBrokerBindTraders',
        {broker: this.broker, page: this.page, size: this.size})
        .then((records) => {

          console.log(records)

          if(!records || records.length < 1) {
            this.finished = true
            return
          }

          if(this.page < 1){
            this.list.splice(0);
          }

          records.forEach((record) => {
            this.list.push(record)
          })
          this.page++

        }).catch((e) => {
        console.warn(e)
      }).finally(() => {
        this.loading = false
      })
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
