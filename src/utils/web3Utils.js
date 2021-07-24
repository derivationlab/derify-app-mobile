import Contract, { contractDebug } from './contractUtil'

const ethUrl = 'https://kovan.infura.io/v3/4790cd7bb24349738a3b05ee0c20746e'


export function contract (account) {

  const contractObj = new Contract({ from: account })

  if(contractDebug){
    return new Proxy(contractObj, {
      get(target, propKey, receiver) {
        const ret = Reflect.get(...arguments)

        if(ret instanceof Function){
          return new Proxy(ret, {
            apply (target, ctx, args) {
              console.log('contract.'+ propKey + ',args=' + JSON.stringify(args))
              return Reflect.apply(...arguments);
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


class Aop {
  constructor(obj, beforeFork, afterFork) {
    return new Proxy(obj, {
      get: function (target, propKey, receiver) {
        for (let key in beforeFork) {
          if (Object.prototype.toString.call(target[propKey]) == "[object " + key + "]") {
            beforeFork[key]?.(target[propKey]);
          }
        }
        beforeFork[propKey]?.(target[propKey]);
        //before

        var re = Reflect.get(target, propKey, receiver)();

        for (let key in afterFork) {
          if (Object.prototype.toString.call(target[propKey]) == "[object " + key + "]") {
            afterFork[key]?.(target[propKey]);
          }
        }
        afterFork[propKey]?.(target[propKey]);
        //after

        return ()=>{return re};
      },
      set: function (target, propKey, value, receiver) {
        return Reflect.set(target, propKey, value, receiver);
      },

    });
  }
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
