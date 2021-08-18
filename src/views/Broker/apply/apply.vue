<template>
  <div class="home-container page-container">
    <navbar title="选择经济商" />
    <div class="home-mid">
      <van-list class="brokers-wrap">
        <template v-for="(broker,key) in brokers">
          <div class="broker-info" :key="key">
            <i class="selected-icon"></i>
            <div class="broker-avatar">
              <img :src="broker.avatar" style="width: 5rem;height: 5rem"/>
            </div>
            <div class="broker-contact">
              <div class="broker-name">{{broker.userName}}</div>
              <div>
                <p>{{broker.account}}</p>
                <p>{{broker.address}}</p>
              </div>
            </div>
          </div>
        </template>
      </van-list>
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
          selected: false
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
  background-image: url('~@/assets/images/wallet/select.png');
  width: 2rem;
  height: 2rem;
}
.home-mid{
  brokers-wrap{
    background-color: #272354;
  }
  .broker-info{
    margin: 0.5rem 1rem;
    position: relative;
    box-sizing: content-box;
    display: flex;
    justify-content: stretch;
    border-radius: 1rem;
    align-items: center;
    &.active{
      border: 0.1rem solid #fae247;
    }
    .selected-icon{
      position: absolute;
      right: 1rem;
      top: 1rem;
    }
    .broker-avatar img{
      width: 5rem;
      height: 5rem;
      border-radius: 2.5rem;
      margin: 2rem;
    }
    .broker-info{
      margin:1rem;
      .broker-name{
        opacity: 1;
        background: #ffffff;
        font-size: 1rem;
        font-weight: 700;
        text-align: LEFT;
        color: #ffffff;
        line-height: 14rem;
      }

      .broker-contact{
        color: rgba(255,255,255,0.45);

      }
    }
  }
}
</style>
