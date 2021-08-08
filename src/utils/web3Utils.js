import Contract from './contractUtil'
import * as CfgUtil from '../config'

const contractDebug = CfgUtil.isDebug()
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
                  console.log('request.contract.'+ propKey + ',args=' + JSON.stringify(args))

                  return (async () => {
                    let data = await ret;
                    console.log('response.contract.'+ propKey + ',args=' + JSON.stringify(args) + ",ret=", data)
                    return data
                  })();

                }else{
                  console.log('contract.'+ propKey + ',args=' + JSON.stringify(args) + ",ret=", ret)
                }
                return ret;
              }catch (e) {
                console.log('contract.'+ propKey + ',args=' + JSON.stringify(args) + ",error=", e)
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
