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
    }
  }
}
</script>
<style lang="less" scoped>
.derify-error-notice {
  line-height: 2rem;
  border-radius: 0.6rem;
  border: 0.1rem solid #EA446B;
  position: relative;
  color: #EA446B;
  padding: 4px 2.5rem 4px 0.5rem;
  font-size: 0.1rem;
  .error-right{
    position: absolute;
    right: 0;
    top: 0.4rem;
    display: inline-block;
    padding-right: 1rem;
  }
}
</style>
