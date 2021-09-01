import DerifyDerivative from '../utils/contract/DerifyDerivative'
import DerifyExchange from '../utils/contract/DerifyExchange'
import DerifyRewards from '../utils/contract/DerifyRewards'
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
    development: {
      DerifyRewards: {
        abi: DerifyRewards,
        address: '0x1205151798A781c2a9C79Af4Cd731ccB7644dAe1'
      },
      DerifyDerivative: {
        abi: DerifyDerivative,
        BTC: {
          address: '0xE3D7D682734c61C48Fa329D532fe0f8065bacb57',
          token: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599'
        },
        ETH: {
          address: '0x84F874c525CA78f4EedfeDec43e46432A05c0E86',
          token: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
        }
      },
      DerifyExchange: {
        abi: DerifyExchange,
        address: '0xe3eFD887624AF8E660971a917277741a24009EFb'
      },
      DUSD: {
        abi: DUSD,
        address: '0x66C2e4EC9CF2d564c0D72543e681E42ff9a4eDC0'
      },
      bDRF: {
        abi: bDRF,
        address: '0xd29c3B77CeB8cE2252829D2a61503245EF1c39B1'
      },
      DRF: {
        abi: DRF,
        address: '0x7F6f4FA468135777439f7201d24f2518fA52424B'
      },
      eDRF: {
        abi: eDRF,
        address: '0x6482e3f5770B707810e52b66d7BF3B21e30561Ab'
      },
    },
    debug: {
      DerifyRewards: {
        abi: DerifyRewards,
        address: '0x1205151798A781c2a9C79Af4Cd731ccB7644dAe1'
      },
      DerifyDerivative: {
        abi: DerifyDerivative,
        BTC: {
          address: '0xE3D7D682734c61C48Fa329D532fe0f8065bacb57',
          token: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599'
        },
        ETH: {
          address: '0x84F874c525CA78f4EedfeDec43e46432A05c0E86',
          token: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
        }
      },
      DerifyExchange: {
        abi: DerifyExchange,
        address: '0xe3eFD887624AF8E660971a917277741a24009EFb'
      },
      DUSD: {
        abi: DUSD,
        address: '0x66C2e4EC9CF2d564c0D72543e681E42ff9a4eDC0'
      },
      bDRF: {
        abi: bDRF,
        address: '0xd29c3B77CeB8cE2252829D2a61503245EF1c39B1'
      },
      DRF: {
        abi: DRF,
        address: '0x7F6f4FA468135777439f7201d24f2518fA52424B'
      },
      eDRF: {
        abi: eDRF,
        address: '0x6482e3f5770B707810e52b66d7BF3B21e30561Ab'
      },
    },
    production: {
      DerifyRewards: {
        abi: DerifyRewards,
        address: '0x1205151798A781c2a9C79Af4Cd731ccB7644dAe1'
      },
      DerifyDerivative: {
        abi: DerifyDerivative,
        BTC: {
          address: '0xE3D7D682734c61C48Fa329D532fe0f8065bacb57',
          token: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599'
        },
        ETH: {
          address: '0x84F874c525CA78f4EedfeDec43e46432A05c0E86',
          token: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
        }
      },
      DerifyExchange: {
        abi: DerifyExchange,
        address: '0xe3eFD887624AF8E660971a917277741a24009EFb'
      },
      DUSD: {
        abi: DUSD,
        address: '0x66C2e4EC9CF2d564c0D72543e681E42ff9a4eDC0'
      },
      bDRF: {
        abi: bDRF,
        address: '0xd29c3B77CeB8cE2252829D2a61503245EF1c39B1'
      },
      DRF: {
        abi: DRF,
        address: '0x7F6f4FA468135777439f7201d24f2518fA52424B'
      },
      eDRF: {
        abi: eDRF,
        address: '0x6482e3f5770B707810e52b66d7BF3B21e30561Ab'
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
