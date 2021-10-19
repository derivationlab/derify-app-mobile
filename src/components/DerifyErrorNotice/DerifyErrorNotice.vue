<template>
  <div :class="className">
    <div class="derify-error-notice" v-if="showError">
      <div class="derify-error-notice-info">
        <span><slot></slot></span>
      </div>
      <div class="error-right">
        <van-icon name="cross" class="van-icon-close" color="#EA446B" @click="closeError"></van-icon>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props:['show','className'],
  data() {
    return {
      showError: false
    }
  },
  methods:{
    closeError() {
      this.$emit('close', false)
    }
  },
  watch:{
    show() {
      this.showError = this.show
      if(this.show) {
        setTimeout(() => {
          this.closeError();
        },3000)
      }
    }
  }
}
</script>
<style lang="less" scoped>
.derify-error-notice {
  line-height: 2rem;
  font-size: 1.3rem;
  border-radius: 0.9rem;
  border: 0.1rem solid #EA446B;
  position: relative;
  color: #EA446B;
  background: rgba(234,68,107,0.10);
  padding: 0.8rem 3rem 0.8rem 0.8rem;
  overflow-wrap: break-word;
  .error-right{
    position: absolute;
    right: 0;
    top: 0.4rem;
    display: inline-block;
    padding-right: 1rem;
  }
}
</style>
