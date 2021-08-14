<template>
  <span :style="wrapStyle">
    <slot name="first" v-bind:value="first"><span :style="firstStyle">{{first}}</span></slot>
    <slot name="last" v-bind:value="last"><span :style="lastStyle">{{last}}</span></slot>
  </span>
</template>
<script>
export default {
  props: {
    value:{
      type: String,
      default: '0.0'
    },
    wrapStyle: {
      type: String,
      default: ''
    },
    firstStyle:{
      type: String,
      default: ''
    },
    lastStyle:{
      type: String,
      default: 'font-size: 1rem; font-weight: lighter'
    },
    digitSplit:{
      type: String,
      default: null
    }
  },
  computed:{
    first () {
      const numStr = this.value + ''
      let first = numStr.substring(0, numStr.indexOf("."))
      if(this.digitSplit) {
        let nums = []
        let splits = first.split('')
        while (splits.length > 0){
          nums.push(splits.splice(Math.max(splits.length - 3, 0)).join(''))
        }
        return nums.reverse().join(this.digitSplit)
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
