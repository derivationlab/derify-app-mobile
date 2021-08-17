<template>
  <div class="derify-debug-console">
    <div class="show-debug-icon" @click="toggle" v-if="showIcon">D</div>
    <van-popup v-model="showPopup" class="derify-debug-console-ctn">
      <van-field
        v-model="commands"
        rows="10"
        autosize
        label="execute command"
        type="textarea"
        placeholder="input codes here"
        show-word-limit
      />
      <van-button type="primary" @click="execute">execute</van-button>
      <van-button type="primary" @click="clear">clear</van-button>
      <van-button type="primary" @click="close">close</van-button>
      <div>
        <p v-for="(line, key) in logs" :key="key">{{line}}</p>
      </div>
    </van-popup>
  </div>
</template>
<script>
import {DebugConsole} from "@/utils/web3Utils";
import * as CfgUtil from "@/config";

const context = {
  console: window.console,
  debugConsole: new DebugConsole(),
}

export default {
  data() {
    return {
      CfgUtil,
      showIcon: !!this.$route.query.debug,
      commands: '',
      showPopup: false
    }
  },
  computed:{
    logs (){
      return context.debugConsole.logs
    }
  },
  watch:{
    logArr:{
      handler(){

      },
      deep:true,
      immediate: true
    }
  },
  methods: {
    execute() {
      const result = context.debugConsole.execute(this.commands)
      this.commands = ''
      context.debugConsole.log(result)
    },
    clear() {
      context.debugConsole.clearLogs()
    },
    close() {
      this.showPopup = false
      if(context.debugConsole){
        context.debugConsole.unmockConsole()
        context.debugConsole = null
      }
      this.$emit('close')
    },
    toggle() {
      if(!this.showPopup){
        this.showPopup = true
        context.debugConsole.mockConsole()

      }else{
        this.close()
      }
    }
  }
}
</script>
<style scoped lang="less">
.show-debug-icon{
  background: #ccc;
  width: 3rem;
  height: 3rem;
  position: fixed;
  opacity: 0.5;
  border-radius: 1.5rem;
  top: 2rem;
  z-index: 100;
  left: 5rem;
  line-height: 3rem;
  text-align: center;
}

.derify-debug-console{
  position: fixed;
  bottom: 0;
  right: 0;
  z-index: 9999;
  .derify-debug-console-ctn{
    width: 90%;
    height: 90%;
  }
}
</style>
