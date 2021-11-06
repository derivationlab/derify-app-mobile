<template>
  <fragment :is="component">
  </fragment>
</template>
<script>
import Vue from "vue";
import DecimalView from "@/components/DecimalView/DecimalView";

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
  const resultArr = [];
  for(let i = 0; i < treeMapArr.length; i++){
    let item = treeMapArr[i];
    if(typeof item === 'object'){
      const name = item.name;
      const chunks = renderVar(item.children, values);
      const renderVal =  values[name];

      if(renderVal){
        resultArr.push(renderVal(renderMap(chunks, values)));
      }else{
        resultArr.push(`<${name}>${chunks}</${name}>`);
      }

    }else{
      resultArr.push(renderVar(item,values));
    }
  }

  return resultArr.join('');
}

function renderVar(html, params){
  const arr = html.split(/({.+?})/)
  const retArr = [];

  for (let i = 0; i < arr.length; i++) {
    const subHtml = arr[i];
    const matches = subHtml.match(/^{(.+?)}$/);
    if(matches){
      if(params && params.hasOwnProperty(matches[1])){
        retArr.push(params[matches[1]]);
      }else{
        retArr.push(subHtml);
      }
    }else{
      retArr.push(subHtml);
    }
  }

  return retArr.join('')
}

export default {
  props:['text', 'params'],
  data() {
    const html = renderMap(convertToMap(this.$t(this.text)), this.params);
    console.log(html)
    const Component = Vue.extend({template: `<fragment> ${html}</fragment>`, components:{DecimalView}});
    return {component: Component}
  }
}
</script>
