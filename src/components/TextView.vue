<template>
  <fragment>
    {{showText}}
  </fragment>
</template>

<script>
export default {
  props:['text', 'len', 'showPos'],
  data() {
    const text = this.text;
    const showLen = this.len;
    const pos = this.showPos || 'left';

    let resultText = text;
    if(showLen < text.length){
      if(pos === 'left'){
        resultText = text.substr(0, showLen) + "...";
      }else if(pos === 'mid'){
        resultText = text.substr(0, showLen/2) + "..." + text.substr(text.length - showLen/2, showLen/2);
      }else{
        resultText = "..." + text.substr(text.length - showLen, showLen);
      }
    }

    return {showText: resultText}
  },
  template:{

  },
  methods:{
  }
}
</script>
