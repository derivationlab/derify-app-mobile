<template>
  <fragment :is="component">
  </fragment>
</template>
<script>
import Vue from "vue";

function convertToMap(text){
  var arr = text.split(/(<.+?>)/);
  var subArr = [];

  var parentArrStack = [subArr];

  for(let i = 0; i < arr.length; i++){
    let item = arr[i];
    if(/<.+?>/.test(item)){
      if(item.startsWith('</')){
        var tagName = item.substring(2,item.length - 1)
        const parentArr = parentArrStack.pop();
        parentArr.push({name: tagName, children: subArr});
        subArr = parentArr;
      }else{
        parentArrStack.push(subArr);
        subArr = [];
      }
    }else{
      subArr.push(item);
    }
  }

  return parentArrStack.pop();
}


function renderMap(treeMapArr, values){
  var resultArr = [];
  for(let i = 0; i < treeMapArr.length; i++){
    let item = treeMapArr[i];
    if(typeof item === 'object'){
      var name = item.name;
      console.log(values);
      var chunks = item.children;
      var renderVal =  values[name];

      if(renderVal){
        resultArr.push(renderVal(renderMap(chunks, values)));
      }else{
        resultArr.push(`<${name}>${chunks}</${name}>`);
      }

    }else{
      resultArr.push(item);
    }
  }

  return resultArr.join('');
}

export default {
  props:['text', 'params'],
  data() {
    const html = renderMap(convertToMap(this.$t(this.text, this.params)), this.params);
    const Component = Vue.extend({template: `<fragment> ${html}</fragment>`});
    return {component: Component}
  }
}
</script>
