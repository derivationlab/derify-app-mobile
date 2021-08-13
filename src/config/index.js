import DerifyBond from '../utils/contract/DerifyBond'
import DerifyDerivative from '../utils/contract/DerifyDerivative'
import DerifyExchange from '../utils/contract/DerifyExchange'
import DerifyStaking from '../utils/contract/DerifyStaking'
import DUSD from '../utils/contract/DUSD'
import bDRF from '../utils/contract/bDRF'
import DRF from '../utils/contract/DRF'

const currentEnv = "production,development,debug".indexOf(process.env.NODE_ENV) > -1 ? process.env.NODE_ENV : "production"


const config = {
  currentEnv: currentEnv,
  debug: true,
  server: {
    development: "http://13.125.43.43:8081",
    debug: "http://13.125.43.43:8081",
    production: "http://13.125.43.43:8081"
  },
  kdata:{
    development: 'http://app-test.haoping.video',
    debug: 'http://app-test.haoping.video',
    production: 'http://app-test.haoping.video',
  },
  contract: {
    development: {
      DerifyBond: {
        abi: DerifyBond,
        address: '0x3f013D2290CE40f6026B53F562630A331FA422c6'
      },
      DerifyDerivative: {
        abi: DerifyDerivative,
        BTC: {
          address: '0xAa85ddA108AB30659a3A89E87C4048BBbAA71f54',
          token: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599'
        },
        ETH: {
          address: '0xEf42f61000fA5d554Fd111D8d6613129b9E28f6D',
          token: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
        }
      },
      DerifyExchange: {
        abi: DerifyExchange,
        address: '0xdBC38A5d8a10AdEb49e84e5Eb263dFa9d68a05a7'
      },
      DerifyStaking: {
        abi: DerifyStaking,
        address: '0x519231B9A4Eef0A59FE8fF57FF50fD018b9950cC'
      },
      DUSD: {
        abi: DUSD,
        address: '0x04cE9B212B43b68cfC5b67Dc0ae9bDC81727c544'
      },
      bDRF: {
        abi: bDRF,
        address: '0xDedE1D361CdD4Cfb72Eb9E41D6b530cD6581e8c8'
      },
      DRF: {
        abi: DRF,
        address: '0x3A096d9d9bF3Cb355Ede5057657b887ef8C4cBed'
      },
    }
  }
}

export function getCurrentContractConfig() {
  return config.contract[currentEnv]
}

export function getCurrentServerEndPoint() {
  return config.server[currentEnv]
}

export function getCurrentKdataEndPoint() {
  return config.kdata[currentEnv]
}

export function getCurrentEnv() {
  return currentEnv
}

export function isCurrentProduction() {
  return currentEnv === 'production'
}

export function  isDebug() {
  if(config.debug) {
    return true
  }

  return !isCurrentProduction()
}

export default config
