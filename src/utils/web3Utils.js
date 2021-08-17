import Contract from './contractUtil'
import * as CfgUtil from '../config'

export const contractDebug = CfgUtil.isDebug()


export class DebugConsole{
  logs = [];

  logToConsole = true;


  constructor(wconsole = window.console) {

    for(const key in wconsole) {
      if(key !== 'log'){
        this[key] = wconsole[key]
      }
    }

    this._console = wconsole
  }

  unmockConsole() {
    window.console = this._console
    this.logToConsole = false
    this.logs.splice(0)
  }

  clearLogs() {
   this.logs.splice(0)
  }

  mockConsole() {
    this.logToConsole = false
    window.console = this
  }

  log() {
    if(this.logToConsole){
      this._console.log.call(this, arguments)
    }else{
      if(this.logs.length > 1000) {
        this.logs.shift()
      }

      const args = [];

      for(let i = 0; i < arguments.length; i++){
        args.push(arguments[i])
      }

      const line = JSON.stringify(args)
      this.logs.push(line.substring(1, line.length - 1))
    }
  }

  execute (codes) {
    return eval(codes)
  }

}

export const EVENT_WALLET_CHANGE = 'walletChange'

export function contract (account) {

  const contractObj = new Contract(account)

  if(contractDebug){

    /**
     * debug log
     */
    return new Proxy(contractObj, {
      get(target, propKey, receiver) {
        const ret = Reflect.get(...arguments)

        if(ret instanceof Function && isProxyPropertyKey(propKey)){
          return new Proxy(ret, {
            apply (target, ctx, args) {
              try{
                const ret = Reflect.apply(...arguments)

                if(ret instanceof Promise){
                  console.log('request.contract.'+ propKey + ',args=' + JSON.stringify(args) + ',trader=' + contractObj.from)

                  return (async () => {
                    let data = await ret;
                    console.log('response.contract.'+ propKey + ',args=' + JSON.stringify(args)+ ',trader=' + contractObj.from + ",ret=", data)
                    return data
                  })();

                }else{
                  console.log('contract.'+ propKey + ',args=' + JSON.stringify(args)+ ',trader=' + contractObj.from + ",ret=", ret)
                }
                return ret;
              }catch (e) {
                console.log('contract.'+ propKey + ',args=' + JSON.stringify(args)+ ',trader=' + contractObj.from + ",error=", e)
              }

            }
          })
        }else{
          return ret
        }
      }
    });
  }else{
    return contractObj
  }
}

function isProxyPropertyKey(key) {
  if(key.startsWith('__')) {
    return false
  }

  if(key === 'getSpotPrice'){
    return false
  }

  // if('getTraderVariables,getTraderPositionLiquidatePrice,getTraderPositionVariables,getTraderAllPosition'.indexOf(key) > -1){
  //   return false
  // }

  return true
}

export function enable () {
  if (!window.ethereum) {
    return new Promise((resolve, reject) => {
      reject(new Error('please install Metamask'))
    })
  }
  return new Promise((resolve, reject) => {
    window.ethereum.request({
      method: 'eth_requestAccounts'
    }).then(r => resolve(r)).catch(e => reject(e))
  })
}
