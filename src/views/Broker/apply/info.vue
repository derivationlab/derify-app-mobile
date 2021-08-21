<template>
  <div class="home-container page-container">
    <navbar title="经济商信息" />
    <div class="home-mid">
      <div class="market-popup system-popup">
        <DerifyErrorNotice :show="showError" @close="errorNotice(null)">
          {{errorMsg}}
        </DerifyErrorNotice>

        <div class="system-popup-line system-popup-input">
          <span class="fz-15"><span class="fc-85">地址</span></span>
          <van-field class="derify-input no-padding-hor fz-15  fc-45" placeholder=""
                     :formatter="(value) => value.replace(/-/g, '')"
                     type="text" value="0x8503ea9b"/>
        </div>

        <div class="system-popup-line system-popup-input">
          <span class="fz-15"><span class="fc-85">姓名</span></span>
          <van-field class="derify-input no-padding-hor fz-15 fc-85" placeholder=""
                     :formatter="(value) => value.replace(/-/g, '')"
                     type="text" value="Coinbaby's Playground"/>
        </div>

        <div class="system-popup-line system-popup-input">
          <span class="fz-15"><span class="fc-85">头像</span></span>
          <div class="broker-avatar">
            <input type="file" class="broker-avatar-file"/>
            <img :src="broker.avatar" style="width: 5.5rem;height: 5.5rem" alt=""/>
          </div>
        </div>

        <div class="account-wrap">

          <div class="account-label">
            <span class="fz-15"><span class="fc-85">账户地址</span></span>
            <span class="fz-15 fc-85">coinbaby</span>
          </div>

          <div class="system-popup-input">
            <van-field class="derify-input no-padding-hor fz-15 fc-45" placeholder=""
                       :formatter="(value) => value.replace(/-/g, '')"
                       type="text" value="http://app.derify.finance/"/>
            <span class="fc-85">coinbaby</span>
          </div>
        </div>

        <div class="btn-wrap">
          <div class="derify-big-btn btn-yellow" @click="submitThenClose">提交</div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import Navbar from '@/components/Navbar'
import DerifyErrorNotice from "@/components/DerifyErrorNotice/DerifyErrorNotice";
export default {
  name: 'Home',
  components: {
    DerifyErrorNotice,
    Navbar
  },
  data () {
    return {
      showError: false,
      errorMsg: '',
      broker:{
        id: 1,
        avatar: require('@/assets/images/broker-default-avatar.png'),
        address: '0xc9f071844870552fa07726e57AcaaCC8E70a7B73',
        userName: 'Coinbaby\'s Playground',
        account: 'Coinbaby',
        accountAddress: 'http://app.derify.finance/@Coinbaby',
        selected: true
      },
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
    submitThenClose () {
      this.errorNotice("错误提示")
    },

    errorNotice (msg) {
      if(msg){
        this.showError = true
        this.errorMsg = msg
      }else{
        this.showError = false
      }
    }
  }
}
</script>

<style lang="less">
.selected-icon{
  width: 2rem;
  height: 2rem;
}

.page-container{
  background: #140B32;
}

.home-mid{
  .market-popup{
    background: #272354;
    border-radius: 1.8rem;
    padding: 1.8rem;
  }

  .broker-avatar {
    padding: 1.1rem;
    position: relative;
    img{
      width: 5.5rem;
      height: 5.5rem;
      border-radius: 2.75rem;
    }
    .broker-avatar-file{
      width: 5.5rem;
      height: 5.5rem;
      opacity: 0;
      position: absolute;
    }
  }

  .account-wrap {
    .account-label {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .system-popup-input{
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .van-cell {
        width: inherit;
      }
    }

    .van-field__control{
      text-align: right;
      color: rgba(255,255,255,0.45);
    }
    .fc-85 .van-field__control{
      color: rgba(255,255,255,0.85);
    }
  }
  .system-popup-line {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .derify-input{
      width: auto;
    }

    .van-field__control{
      text-align: right;
      color: rgba(255,255,255,0.45);
    }
    .fc-85 .van-field__control{
      color: rgba(255,255,255,0.85);
    }
  }

  .btn-wrap{
    margin-top: 4rem;
    p {
      text-align: center;
      margin: 1rem;
      line-height: 5rem;
      height: 5rem;
      .fc-yellow{
        border-bottom: 0.1rem solid @orange;
      }
    }
  }

  .account-label{
    margin-top: 1rem;
  }

  .broker-avatar-file{
    width: 100%;
    height: 100%;
    opacity: 0;
  }
}

</style>
