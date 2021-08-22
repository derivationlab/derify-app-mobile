<template>
  <div class="home-container page-container">
    <navbar title="新增经济商" :logo="false" :showGoback="true"/>
    <div class="home-mid">
      <div class="market-popup system-popup">
        <DerifyErrorNotice :show="showError" @close="errorNotice(null)">
          {{errorMsg}}
        </DerifyErrorNotice>

        <div class="home-mid-input">
          <div class="fc-85 fz-15">输入邀请码</div>
          <van-field class="derify-big-input" type="text" input-align="center" />
        </div>

        <div class="btn-wrap">
          <p class="code-wrap"><span class="fc-yellow">还没有邀请码</span></p>
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
      errorMsg: ''
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

<style lang="less" scoped>
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
  }
  &-input {
    margin: 1rem 0;
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
</style>
