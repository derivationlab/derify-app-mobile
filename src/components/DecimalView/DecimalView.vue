<template>
  <span><span :style="fisrtStyle">{{first}}</span><span :style="lastStyle">{{last}}</span></span>
</template>
<script>
export default {
  props: {
    value:{
      type: String,
      default: '0.0'
    },
    fisrtStyle:{
      type: Object,
      default: null
    },
    lastStyle:{
      type: Object,
      default: null
    }
  },
  computed:{
    first () {
      const numStr = (this.value + '')
      return numStr.substring(0, numStr.indexOf("."))
    },
    last (){
      const numStr = (this.value + '')
      return numStr.substring(numStr.indexOf("."))
    }
  }
}
</script>
