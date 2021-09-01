<template>
  <div class="home-container page-container">
    <navbar title="选择经济商" :logo="false" :showGoback="true"/>
    <div class="home-mid">
      <van-list class="brokers-wrap"
                v-model="loading"
                @load="loadBrokers"
                :finished="finished"
                :loading-text="$t('global.Loading')"
      >
        <template v-for="(broker,key) in brokers">
          <div :class="broker.selected ? 'broker-info active' : 'broker-info'" :key="key" @click="() => {
              broker.selected = !broker.selected
            }">
            <i class="selected-icon" v-if="broker.selected">
              <img src="@/assets/images/wallet/select.png" alt="" style="width: 100%;height: 100%;"/>
            </i>

            <div class="broker-avatar">
              <img :src="broker.logo" style="width: 5rem;height: 5rem" alt=""/>
            </div>
            <div class="broker-contact">
              <div class="broker-name">{{broker.id}}</div>
              <div class="broker-addr">
                <p>@{{broker.name}}</p>
                <p>{{broker.broker | textwrap(36)}}</p>
              </div>
            </div>
          </div>
        </template>
      </van-list>
    </div>
    <div class="home-last">
      <p class="code-wrap"><span class="fc-yellow" @click="() => this.$router.push({name:'brokerAdd'})">I have a code ...</span></p>
      <div class="derify-big-btn btn-yellow">{{ $t('Broker.Broker.InfoEdit.Commit') }}</div>
    </div>

  </div>
</template>

<script>
import Navbar from '@/components/Navbar'
export default {
  name: 'Home',
  components: {
    Navbar
  },
  data () {
    return {
      loading: false,
      finished: true,
      brokers: [],
      brokerPageSize: 10,
      brokerPageNum: 0
    }
  },
  created () {
    this.loadBrokers()
  },
  computed: {
    isLogin () {
      return this.$store.state.user.isLogin
    }
  },
  methods: {
    loadBrokers() {
      this.loading = true
      this.$store.dispatch('broker/getBrokerList', {page: this.brokerPageNum, size: this.brokerPageSize})
        .then((brokers) => {
        if(brokers.length < 1) {
          this.finished = true
        }else{
          brokers.forEach(broker => {
            this.brokers.push(Object.assign({selected: false}, broker))
          })
          this.finished = false
        }
      }).finally(() => {
        this.loading = false
      })

      this.brokerPageNum++
    }
  }
}
</script>

<style lang="less" scoped>
.selected-icon{
  width: 2rem;
  height: 2rem;
}

.page-container{
  background: #140B32;
}

.home-mid{
  .broker-info{
    margin: 1.5rem 0;
    position: relative;
    box-sizing: content-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.1rem;
    border-radius: 1.8rem;
    background-color: #272354;
    border: 0.1rem solid transparent;
    &.active{
      border: 0.1rem solid #fae247;
    }
    .selected-icon{
      position: absolute;
      right: 1rem;
      top: 1rem;
    }
    .broker-avatar {
      padding: 1.1rem;
      img{
        width: 5.5rem;
        height: 5.5rem;
        border-radius: 2.5rem;
      }
    }

    .broker-contact {
      overflow: hidden;
      overflow-wrap: break-word;
      text-overflow: ellipsis;
      color: rgba(255,255,255,0.45);
      font-size: 1.3rem;
      line-height: 1.8rem;
      .broker-name{
        font-size: 1.7rem;
        font-weight: Bold;
        text-align: LEFT;
        color: #ffffff;
      }
    }
  }
}

.home-last {
  position: fixed;
  bottom: 1rem;
  left: 0;
  width: 100%;
  align-items: center;
  padding: 2rem;
  p {
    text-align: center;
    margin: 1rem;
    .fc-yellow{
      border-bottom: 0.1rem solid @orange;
    }
  }
}

</style>
