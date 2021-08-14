<template>
  <svg style="flex: 1" v-if="iconName === 'switch-updown-arrow'" t="1628939435389" class="derify-icon" :width="width" :height="height" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1247" data-spm-anchor-id="a313x.7781069.0.i2">
    <path d="M848 704.1H712.2v-572a4 4 0 0 0-4-4h-64a3.9 3.9 0 0 0-4 4v747.8a16 16 0 0 0 26.2 12.3l191.8-159.8c11.5-9.6 4.7-28.3-10.2-28.3zM357.8 131.8l-192 160c-11.5 9.6-4.7 28.3 10.2 28.3h136v571.8a4 4 0 0 0 4 4h64a4 4 0 0 0 4-4V144.1a16 16 0 0 0-26.2-12.3z" p-id="1248" :fill="color"></path>
  </svg>
</template>
<script>
export default {
  props: {
    iconName:{
      type: String,
      default: null
    },
    color: {
      type: String,
      default: null
    },
    wrapStyle: {
      type: String,
      default: ''
    },
    width:{
      type: String,
      default: ''
    },
    height:{
      type: String,
      default: ''
    }
  },
  computed:{
    first () {
      const numStr = (this.value + '')
      let first = numStr.substring(0, numStr.indexOf("."))
      if(this.digitSplit) {
        let num = parseInt(first)
        let nums = []
        while (num > 1){
          nums.push(num % 1000)
          num = Math.ceil(num / 1000)
        }
        return nums.join(this.digitSplit)
      }
      return first
    },
    last (){
      const numStr = (this.value + '')
      return numStr.substring(numStr.indexOf("."))
    },
    spliter () {
      return digitSplit
    }
  }
}
</script>
