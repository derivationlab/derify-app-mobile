<template>
  <div class="home-container page-container">
    <navbar title="选择经济商" :logo="false" :showGoback="true"/>
    <div class="home-mid">
      <van-list class="brokers-wrap">
        <template v-for="(broker,key) in brokers">
          <div :class="broker.selected ? 'broker-info active' : 'broker-info'" :key="key">
            <i class="selected-icon" v-if="broker.selected">
              <img src="@/assets/images/wallet/select.png" alt="" style="width: 100%;height: 100%;"/>
            </i>

            <div class="broker-avatar">
              <img :src="broker.avatar" style="width: 5rem;height: 5rem" alt=""/>
            </div>
            <div class="broker-contact">
              <div class="broker-name">{{broker.userName}}</div>
              <div class="broker-addr">
                <p>{{broker.account}}</p>
                <p>{{broker.address | textwrap(36)}}</p>
              </div>
            </div>
          </div>
        </template>
      </van-list>
    </div>
    <div class="home-last">
      <p class="code-wrap"><span class="fc-yellow" @click="() => this.$router.push({name:'brokerAdd'})">I have a code ...</span></p>
      <div class="derify-big-btn btn-yellow">提交</div>
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
      brokers:[
        {
          id: 1,
          avatar: 'https://dummyimage.com/400x400/fef/fff',
          address: '0xc9f071844870552fa07726e57AcaaCC8E70a7B73',
          userName: 'Coinbaby\'s Playground',
          account: 'Coinbaby',
          accountAddress: 'http://app.derify.finance/@Coinbaby',
          selected: true
        },
        {
          id: 2,
          avatar: 'https://dummyimage.com/400x400/fef/fff',
          address: '0xc9f071844870552fa07726e57AcaaCC8E70a7B73',
          userName: 'Coinbaby\'s Playground',
          account: 'Coinbaby',
          accountAddress: 'http://app.derify.finance/@Coinbaby',
          selected: false
        },
        {
          id: 3,
          avatar: 'https://dummyimage.com/400x400/fef/fff',
          address: '0xc9f071844870552fa07726e57AcaaCC8E70a7B73',
          userName: 'Coinbaby\'s Playground',
          account: 'Coinbaby',
          accountAddress: 'http://app.derify.finance/@Coinbaby',
          selected: false
        },
      ]
    }
  },
  created () {
  },
  computed: {
    isLogin () {
      return this.$store.state.user.isLogin
    }
  },
  methods: {
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
