<template v-if="CfgUtil.isDebug()">
  <div class="derify-debug-console">
    <div class="show-debug-icon" @click="toggle" v-if="showIcon">D</div>
    <van-popup v-model="showPopup" class="derify-debug-console-ctn">
      <van-field
        v-model="commands"
        rows="10"
        autosize
        type="textarea"
        placeholder="execute command"
        show-word-limit
      />
      <div class="console-btns">
        <van-button type="primary" size="small" @click="clearCommond">clear commonds</van-button>&nbsp;
        <van-button type="primary" size="small" @click="execute">execute</van-button>&nbsp;
        <van-button type="primary" size="small" @click="clear">clear logs</van-button>&nbsp;
        <van-button type="primary" size="small" @click="close">close</van-button>&nbsp;
      </div>
      <div class="derify-console-logs">
        <p class="log-lines" v-for="(line, key) in logLines" :key="key">{{line}}</p>
      </div>
    </van-popup>
  </div>
</template>
<script>
import * as CfgUtil from "@/config";

setTimeout(() => {
  throw new Error('test error')
}, 3000)
function handleError(){
  console.log('debug console handleError')
  console.log.apply(this, arguments)
}

class DebugConsole{
  logs = []
  isLogToLogs = true

  constructor(wconsole = window.console, mockConsole = false) {

    for(const key in wconsole) {
      if(key !== 'log' && key !== 'error'){
        this[key] = wconsole[key]
      }
    }

    this._console = wconsole

    if(mockConsole) {
      this.mockConsole()
    }
  }

  unmockConsole() {
    window.console = this._console
    window.onerror = this._onerror
    window.removeEventListener('error', handleError)
    window.removeEventListener('unhandledrejection', handleError)
  }

  clearLogs() {
    this.logs.splice(0)
  }

  mockConsole() {
    this._onerror = window.onerror
    window.console = this
    // js erro
    window.onerror = handleError;

    // net error
    window.addEventListener('error', handleError, true);

    //promise error
    window.addEventListener("unhandledrejection", handleError);
  }

  __log4Logs(){
    if(this.isLogToLogs){
      if(this.logs.length > 1000) {
        this.logs.shift()
      }

      const args = [];

      for(let i = 0; i < arguments.length; i++){
        if(typeof arguments[i] === 'object'){
          if(arguments[i] instanceof Error) {
            const e = arguments[i]
            args.push(e.message + "," + e.stack)
          }else{
            args.push(JSON.stringify(arguments[i]))
          }

        }else{
          args.push(arguments[i])
        }
      }

      this.logs.push(args.join(','))
    }
  }

  error() {
    if(this.__log4Logs){
      this.__log4Logs.apply(this, arguments)
    }

    if(this._console) {
      this._console.error.apply(this, arguments)
    }
  }

  log() {

    if(this.__log4Logs){
      this.__log4Logs.apply(this, arguments)
    }

    if(this._console) {
      this._console.log.apply(this, arguments)
    }

  }

  execute (codes) {
    try{
      return eval(codes)
    }catch (e) {
      console.log(e)
      throw e
    }

  }
}
const isDebug = location.search.indexOf("debug") > -1
const context = {
  console: window.console,
  debugConsole: CfgUtil.isDebug() ? new DebugConsole(window.console, isDebug) : new DebugConsole(window.console, isDebug),
}


export default {
  data() {
    return {
      CfgUtil,
      showIcon: isDebug,
      commands: '',
      logArr: context.debugConsole.logs,
      logLines: [],
      showPopup: false
    }
  },
  watch:{
    logArr:{
      handler(){
        this.logLines.splice(0)
        context.debugConsole.logs.forEach((line) => {
          this.logLines.push(line)
        })
      },
      deep:true,
      immediate: true
    }
  },
  methods: {
    execute() {
      const result = context.debugConsole.execute(this.commands)
      context.debugConsole.log(result)
    },
    clearCommond () {
      this.commands = ''
    },
    clear() {
      context.debugConsole.clearLogs()
    },
    close() {
      this.showPopup = false
      this.$emit('close')
    },
    toggle() {
      if(!this.showPopup){
        this.showPopup = true
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
  .derify-console-logs{
    .log-lines{
      border-bottom: silver 1px solid;
    }
  }
  .console-btns{
    display: flex;
    justify-content: flex-end;
    padding: 0.5rem;
    border-bottom: 1px silver solid;
  }
}
</style>
