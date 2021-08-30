import DerifyBond from '../utils/contract/DerifyRewards'
import DerifyDerivative from '../utils/contract/DerifyDerivative'
import DerifyExchange from '../utils/contract/DerifyExchange'
import DerifyStaking from '../utils/contract/DerifyRewards'
import DUSD from '../utils/contract/DUSD'
import bDRF from '../utils/contract/bDRF'
import DRF from '../utils/contract/DRF'
import eDRF from '../utils/contract/eDRF'

const currentEnv = "production,development,debug".indexOf(process.env.NODE_ENV) > -1 ? process.env.NODE_ENV : "production"


const config = {
  currentEnv: currentEnv,
  debug: true,
  server: {
    development: "https://app-test.haoping.video",
    debug: "https://app-test.haoping.video",
    production: "https://app-test.haoping.video"
  },
  kdata:{
    development: 'https://app-test.haoping.video',
    debug: 'https://app-test.haoping.video',
    production: 'https://app-test.haoping.video',
  },
  contract: {
    development: {},
    debug: {
      DerifyBond: {
        abi: DerifyBond,
        address: '0xC04195aB6ff125EabA2A23d72E7B061F0A90e001'
      },
      DerifyDerivative: {
        abi: DerifyDerivative,
        BTC: {
          address: '0x0a9753876BBfa4c4dD087202f0FDB5f0C5146Fb7',
          token: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599'
        },
        ETH: {
          address: '0x7B8ffdDb24fEB5614594bf4476deA07033953065',
          token: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
        }
      },
      DerifyExchange: {
        abi: DerifyExchange,
        address: '0x7af1EdeAD20EF8cDDdCEE3bAb641718A6a3349DF'
      },
      DerifyStaking: {
        abi: DerifyStaking,
        address: '0x519231B9A4Eef0A59FE8fF57FF50fD018b9950cC'
      },
      DUSD: {
        abi: DUSD,
        address: '0x0316d79C86c02d75C23BDA219579e24349E0f9B9'
      },
      bDRF: {
        abi: bDRF,
        address: '0xbFEC3135Da40f88605c927e9cF763B7bD106b94f'
      },
      DRF: {
        abi: DRF,
        address: '0x9fBEE4273ab8F9c2560982890dA82E7fd37d983F'
      },
      eDRF: {
        abi: eDRF,
        address: '0x48e08918582cC4489a73fCAfCC43f5ce6cAd991e'
      },
    },
    production: {
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
