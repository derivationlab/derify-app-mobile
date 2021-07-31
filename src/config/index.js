import DerifyBond from '../utils/contract/DerifyBond'
import DerifyDerivative from '../utils/contract/DerifyDerivative'
import DerifyExchange from '../utils/contract/DerifyExchange'
import DerifyStaking from '../utils/contract/DerifyStaking'
import DUSD from '../utils/contract/DUSD'
import bDRD from '../utils/contract/bDRD'

import Cfg from '../config'

export default {
  server: {
    development: "http://13.125.43.43:8081",
    debug: "http://13.125.43.43:8081",
    production: "http://13.125.43.43:8081"
  },
  contract: {
    development: {
      DerifyBond: {
        abi: DerifyBond,
        address: '0xf5c6A2E323b657f796896f7C93906f43a03A997A'
      },
      DerifyDerivative: {
        abi: DerifyDerivative,
        BTC: {
          address: '0x8873798304069F720874aAB3DED9ed372E0Fa24d',
          token: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599'
        },
        ETH: {
          address: '0x93944255B679D7a10D64C4fB2d88b02208eE0Daf',
          token: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
        }
      },
      DerifyExchange: {
        abi: DerifyExchange,
        address: '0xA0DA26db9649C21EdB2A91f03ECF7f1103aC122e'
      },
      DerifyStaking: {
        abi: DerifyStaking,
        address: '0x6059021fBD2D48460B4deCD42b9D6Af5472e4fee'
      },
      DUSD: {
        abi: DUSD,
        address: '0xcA6C365a22e18a4fE36B175899E918357489A416'
      },
      bDRD: {
        abi: bDRD,
        address: '0x0cA0e7810d00A9268478aF0eC03C49bD37862D00'
      },
    },
    debug: {
      DerifyBond: {
        abi: DerifyBond,
        address: '0xf5c6A2E323b657f796896f7C93906f43a03A997A'
      },
      DerifyDerivative: {
        abi: DerifyDerivative,
        BTC: {
          address: '0x8873798304069F720874aAB3DED9ed372E0Fa24d',
          token: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599'
        },
        ETH: {
          address: '0x93944255B679D7a10D64C4fB2d88b02208eE0Daf',
          token: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
        }
      },
      DerifyExchange: {
        abi: DerifyExchange,
        address: '0xA0DA26db9649C21EdB2A91f03ECF7f1103aC122e'
      },
      DerifyStaking: {
        abi: DerifyStaking,
        address: '0x6059021fBD2D48460B4deCD42b9D6Af5472e4fee'
      },
      DUSD: {
        abi: DUSD,
        address: '0xcA6C365a22e18a4fE36B175899E918357489A416'
      },
      bDRD: {
        abi: bDRD,
        address: '0x0cA0e7810d00A9268478aF0eC03C49bD37862D00'
      },
    },
    production: {
      DerifyBond: {
        abi: DerifyBond,
        address: '0xf5c6A2E323b657f796896f7C93906f43a03A997A'
      },
      DerifyDerivative: {
        abi: DerifyDerivative,
        BTC: {
          address: '0x8873798304069F720874aAB3DED9ed372E0Fa24d',
          token: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599'
        },
        ETH: {
          address: '0x93944255B679D7a10D64C4fB2d88b02208eE0Daf',
          token: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
        }
      },
      DerifyExchange: {
        abi: DerifyExchange,
        address: '0xA0DA26db9649C21EdB2A91f03ECF7f1103aC122e'
      },
      DerifyStaking: {
        abi: DerifyStaking,
        address: '0x6059021fBD2D48460B4deCD42b9D6Af5472e4fee'
      },
      DUSD: {
        abi: DUSD,
        address: '0xcA6C365a22e18a4fE36B175899E918357489A416'
      },
      bDRD: {
        abi: bDRD,
        address: '0x0cA0e7810d00A9268478aF0eC03C49bD37862D00'
      },
    }
  }
}
