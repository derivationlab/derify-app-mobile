import logo from '@/assets/images/wallet/eth-logo.png'

export class TraderAccount {
  balance;
  marginBalance;
  totalMargin;
  marginRate;
  totalPositionAmount;
  availableMargin;

  constructor() {
    this.balance = 0
    this.marginBalance = 0
    this.totalMargin = 0
    this.availableMargin = 0
  }
}

export class TraderVariable {
  marginBalance;
  totalPositionAmount;
  marginRate;

  constructor() {
    this.marginBalance = 0;
    this.totalPositionAmount = 0;
    this.marginRate = 0;
  }
}


export class ChainEnum {
  static values = []
  constructor(chainId, name, logo = require('@/assets/images/wallet/eth-logo.png'), disabled = true, rpcUrl= '', explorerUrl=''){
    this.chainId = chainId
    this.name = name
    this.logo = logo
    this.disabled = disabled
    this.rpc = rpcUrl;
    this.explorer = explorerUrl;
  }

  static get ETH() {
    return new ChainEnum(1, "mainnet", require('@/assets/images/wallet/eth-logo.png'))
  }

  static get Kovan() {
    return new ChainEnum(42, "Kovan", true)
  }

  static get Goerli() {
    return new ChainEnum(5, "Goerli")
  }

  static get Rinkeby() {
    return new ChainEnum(4, "Rinkeby")
  }

  static get Ropsten() {
    return new ChainEnum(3, "Ropsten")
  }

  static get Morden() {
    return new ChainEnum(2, "Morden")
  }

  static get BSC() {
    return new ChainEnum(0x61, "BSC-TEST", '', false, 'https://data-seed-prebsc-1-s1.binance.org:8545/', 'https://testnet.bscscan.com/')
  }

  /**
   *
   * @return {ChainEnum[]}
   */
  static get values() {
    return ChainEnum.values
  }
}

ChainEnum.values.push(ChainEnum.BSC);
ChainEnum.values.push(ChainEnum.Kovan);
ChainEnum.values.push(ChainEnum.Goerli);
ChainEnum.values.push(ChainEnum.Rinkeby);
ChainEnum.values.push(ChainEnum.Ropsten);
ChainEnum.values.push(ChainEnum.Morden);
ChainEnum.values.push(ChainEnum.BSC);
