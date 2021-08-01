import Cfg from '../../config'

let ABIData = Cfg.contract.development
if (process.env.NODE_ENV === 'development') {
  ABIData = Cfg.contract.development
}

if (process.env.NODE_ENV === 'debug') {
  ABIData = Cfg.contract.debug
}

if (process.env.NODE_ENV === 'production') {
  ABIData = Cfg.contract.production
}

export default ABIData


