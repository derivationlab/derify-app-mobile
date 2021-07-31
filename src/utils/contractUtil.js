import Web3 from 'web3'
import ABIData from './contract'
import BigNumber from 'bignumber.js'

window.BigNumber = BigNumber
export class SideEnum {
  static get LONG (){
    return 0;
  }

  static get SHORT (){
    return 1;
  }

  static get HEDGE() {
    return 2
  }
}

/**
 * Bond account types
 */
export class BondAccountType {

  /**
   * 0-DerifyAccount
   * @return {number}
   */
  static get DerifyAccount () {
    return 0
  }

  /**
   * 1-WalletAccount
   * @return {number}
   */
  static get WalletAccount () {
    return 1
  }
}

/**
 * Order type
 */
export class OrderTypeEnum {
 static get LimitOrder () {
   return 0
 }
 static get StopProfitOrder () {
   return 1
 }
 static get StopLossOrder () {
   return 2
 }

}

/**
 * Opening price type
 */
export class OpenType {
  static get MarketOrder(){
    return 0
  }

  static get LimitOrder() {
    return 1
  }
}

export const Token = {
  BTC: ABIData.DerifyDerivative.BTC.token,
  ETH: ABIData.DerifyDerivative.ETH.token,
  DUSD: ABIData.DUSD.address,
  bDRD: ABIData.bDRD.address,
  USDT: ABIData.bDRD.address
}

const cache = {}

export const contractDebug = true

export const contractDecimals = 8

export function toContractUnit (number) {
  return toShiftedHexString(number, contractDecimals)
}

export function toShiftedHexString (number, decimals = 0) {
  return "0x" + (new BigNumber(number)).shiftedBy(decimals).toString(16)
}

export function toShiftedString (number, decimals = 0, bit = 2) {
  return (new BigNumber(number)).shiftedBy(decimals).toFixed(bit)
}


export function toHexString (number) {
  return toShiftedHexString(number)
}

export function toContractNum (number) {
  return (new BigNumber(number)).shiftedBy(contractDecimals).toNumber()
}


export function fromContractUnit (unit) {
  const number = new BigNumber(unit)
  return number.shiftedBy(-contractDecimals).toNumber()
}

export function stringFromContractUnit (unit, bit = 2) {
  return toShiftedString(unit, -contractDecimals, bit)
}

export function convertTokenNumToContractNum (amount, tokenDecimals) {
  console.log('convertTokenNumToContractNum', amount, tokenDecimals)
  return (new BigNumber(amount)).shiftedBy(tokenDecimals).toNumber()
}

/**
 *
 * @param abi
 * @param address
 * @param option Object, the actual example: {from: '',gasPrice: '20000000000'}
 * @constructor
 */
export default class Contract {

  constructor (from) {
    const option = {from}
    const web3 = new Web3()

    const gasPrice = null;

    const provider = window.ethereum
    web3.setProvider(provider)

    this.web3 = web3
    this.from = from

    this.DerifyBond = new web3.eth.Contract(ABIData.DerifyBond.abi, ABIData.DerifyBond.address, Object.assign({ gasPrice }, option))

    this.DerifyDerivative = {
      BTC: new web3.eth.Contract(ABIData.DerifyDerivative.abi, ABIData.DerifyDerivative.BTC.address, Object.assign({ gasPrice }, option)),
      ETH: new web3.eth.Contract(ABIData.DerifyDerivative.abi, ABIData.DerifyDerivative.ETH.address, Object.assign({ gasPrice }, option))
    }

    this.DerifyExchange = new web3.eth.Contract(ABIData.DerifyExchange.abi, ABIData.DerifyExchange.address, Object.assign({ gasPrice }, option))
    this.DerifyStaking = new web3.eth.Contract(ABIData.DerifyStaking.abi, ABIData.DerifyStaking.address, Object.assign({ gasPrice }, option))
    this.DUSD = new web3.eth.Contract(ABIData.DUSD.abi, ABIData.DUSD.address, Object.assign({ gasPrice }, option))
  }

  /**
   * deposit amount
   * @param amount
   * @return
   */
  deposit (amount) {

    const web3 = this.web3
    const from = this.from
    const tokenContract = this.DUSD

    return new Promise((resolve, reject) => {
      (async () => {

        let decimals = await tokenContract.methods.decimals().call();

        const decimalNum = parseInt(decimals)

        const approveNum = toShiftedHexString(amount, decimalNum - contractDecimals);

        //The wallet obtains the authorized amount
        let ret = false;

        try{
          ret = await tokenContract.methods.approve(ABIData.DerifyExchange.address, approveNum).send()
        }catch (e){
          reject('approve denied')
          return
        }


        if(ret){
          try{
            let depositRes = await  this.DerifyExchange.methods.deposit(amount).send();
            resolve(depositRes)
          }catch (e) {
            reject(e)
          }
        }else{
          reject('approve failed')
        }

      })()
    })
  }
  /**
   * withdraw
   * @param amount
   * @returns {*}
   */
  withdraw (amount) {
    return this.DerifyExchange.methods.withdraw(amount).send()
  }

  balanceOf (trader, token) {

    const DUSD = this.DUSD;
    return (async () => {
      let decimals = await DUSD.methods.decimals().call();
      let tokenAmount = 0;
      if(ABIData.DUSD.address === token){
        tokenAmount = await DUSD.methods.balanceOf(trader).call()
      }else if(ABIData.bDRD.address === token){
        tokenAmount = 0
      }

      return convertTokenNumToContractNum(tokenAmount, contractDecimals - decimals)
    })()

  }

  /**
   * Open a position
   * @param token Current contract token address
   * @param side LONG，SHORT，HEDGE
   * @param openType 0-MarketOrder，1-LimitOrder
   * @param size Open position volume (based on currency, precision is 8 digits)
   * @param price Opening price (precision is 8 digits)
   * @param leverage（precision is 8 digits）
   * @return {*}
   */
  openPosition ({token, side, openType, size, price, leverage}) {
    return this.DerifyExchange.methods
      .openPosition(token, side, openType, size, price, leverage)
      .send()
  }
  /**
   * 平仓
   * @param token Current contract currency address
   * @param side LONG，SHORT，HEDGE
   * @param size size for close position volume (based on currency, precision is 8 digits)
   * @return {*}
   */
  closePosition (token, side, size) {
    return this.DerifyExchange.methods.closePosition(token, side, size)
      .send()
  }

  /**
   * closeAllPositions
   */
  closeAllPositions () {
    return this.DerifyExchange.methods.closeAllPositions()
      .send()
  }


  /**
   * getTraderAccount
   * @param trader
   * @return {*}
   */
  getTraderAccount (trader) {
    return this.DerifyExchange.methods.getTraderAccount(trader).call()
  }
  /**
   * Get the user's maximum open position
   * @param marketIdAddress
   * @param trader
   * @param openType enum OpenType { MarketOrder, LimitOrder }
   * @param price
   * @param leverage
   * @return {*}
   */
  getTraderOpenUpperBound ({marketIdAddress, trader, openType, price, leverage}) {
    return this.DerifyExchange.methods.getTraderOpenUpperBound(marketIdAddress, trader, openType, price, leverage).call()
  }

  /**
   * Get the maximum open position of the system
   * @param marketIdAddress
   * @param side
   * @return {*}
   */
  getSysOpenUpperBound ({marketIdAddress, side}) {
    return this.DerifyExchange.methods.getSysOpenUpperBound(marketIdAddress, side).call()
  }

  /**
   * Calculate margin, floating profit and loss, rate of return
   * @param trader
   * @param marketIdAddress
   * @param side
   * @param spotPrice
   * @param size
   * @param leverage
   * @param averagePrice
   */
  getTraderPositionVariables ({trader, marketIdAddress, side, spotPrice, size, leverage, averagePrice}) {
    return this.DerifyExchange.methods.getTraderPositionVariables(side, spotPrice, size, leverage, averagePrice).call()
  }
  /**
   * Get user margin information
   * @param trader
   * @return {*}
   */
  getTraderVariables (trader) {
    return this.DerifyExchange.methods.getTraderVariables(trader).call()
  }

  /**
   * Forced liquidation amount
   * @param side
   * @param spotPrice
   * @param size
   * @param marginMaintenanceRatio
   * @param marginBalance
   * @param totalPositionAmount
   * @return {*}
   */
  getTraderPositionLiquidatePrice ({side, spotPrice, size, marginMaintenanceRatio, marginBalance, totalPositionAmount}) {
    return this.DerifyExchange.methods.getTraderPositionLiquidatePrice(side, spotPrice, size, marginBalance, totalPositionAmount).call()
  }

  /**
   * deposit event
   * @param user
   * @param callback
   */
  onDeposit (user, callback) {
    this.DerifyExchange.events.Deposit({user: user}, callback)
  }

  /**
   * withdraw event
   * @param user
   * @param callback
   */
  onWithdraw (user, callback) {
    this.DerifyExchange.events.Withdraw({user: user}, callback)
  }

  /**
   * Obtain contract objects based on currency
   * @param marketIdAddress
   * @return {Web3.eth.Contract}
   */
  __getDerifyDerivativeContract(marketIdAddress) {

    if(ABIData.DerifyDerivative.BTC.token === marketIdAddress){
      return this.DerifyDerivative.BTC
    }

    return this.DerifyDerivative.ETH
  }
  /**
   * Get positions
   * @param trader
   * @param marketIdAddress
   * @return {DerivativePositions}
   */
  getTraderPosition (trader, marketIdAddress) {
    return this.__getDerifyDerivativeContract(marketIdAddress).methods.getTraderDerivativePositions(trader).call()
  }

  /**
   * Set the current price of the currency
   * @param marketIdAddress  token contract address
   * @param price
   * @return {*}
   */
  setSpotPrice (marketIdAddress, price) {
    return this.__getDerifyDerivativeContract(marketIdAddress).methods.setSpotPrice(marketIdAddress, price).send()
  }

  /**
   * Get the current price of the token
   * @param marketIdAddress 币合约地址
   * @return {*}
   */
  getSpotPrice (marketIdAddress) {
    return this.__getDerifyDerivativeContract(marketIdAddress).methods.getSpotPrice().call()
  }

  /**
   * Set up a stop-profit and stop-loss commission
   * @param token
   * @param trader
   * @param side
   * @param stopType
   * @param stopPrice
   * @return {*}
   */
  orderStopPosition ({token, trader, side, stopType, stopPrice}) {
    return this.__getDerifyDerivativeContract(token).methods.orderStopPosition(trader, side, stopType, stopPrice)
      .send()
  }

  /**
   * Cancel order
   * @param marketIdAddress
   * @param trader
   * @param orderType 0-LimitOrder, 1-StopProfitOrder, 2-StopLossOrder
   * @param side
   * @param timestamp
   * @return {*}
   */
  cancleOrderedPosition ({marketIdAddress, trader, orderType, side, timestamp}) {
    if (orderType === 0) {
      return this.__getDerifyDerivativeContract(marketIdAddress).methods.cancleOrderedLimitPosition(trader, side, timestamp).send()
    } else {
      return this.__getDerifyDerivativeContract(marketIdAddress).methods.cancleOrderedStopPosition(trader, orderType, side).send()
    }

  }
  /**
   * Cancel all orders
   * @param marketIdAddress
   * @param trader
   * @return {*}
   */
  cancleAllOrderedPositions (marketIdAddress, trader) {
    return this.__getDerifyDerivativeContract(marketIdAddress).methods.cancleAllOrderedPositions(trader).send()
  }

  /**
   * getPositionChangeFeeRatio
   * @param marketIdAddress
   * @return {*}
   */
  getPositionChangeFeeRatio (marketIdAddress) {
    return this.__getDerifyDerivativeContract(marketIdAddress).methods.getPositionChangeFeeRatio().call()
  }

  /**
   * getTradingFee
   * @param marketIdAddress
   * @param size
   * @param price
   */
  getTradingFee (marketIdAddress, size, price) {
    return this.__getDerifyDerivativeContract(marketIdAddress).methods.getTradingFee(size, price).call()
  }

  /**
   * getPositionChangeFee
   * @param marketIdAddress
   * @param side 0-LONG，1-SHORT，2-HEDGE
   * @param actionType 0-open, 1-close
   * @param size
   * @param price
   */
  getPositionChangeFee (marketIdAddress, side, actionType, size, price) {
    return this.__getDerifyDerivativeContract(marketIdAddress).methods.getPositionChangeFee(side, actionType, size, price).call()
  }

  /**
   * Convertible bond bDRF
   * Transfer from Derify account to wallet account
   * @param amount
   * @return {*}
   */
  withdrawBond (amount) {
    return this.DerifyBond.methods.withdrawBond(amount).send();
  }

  /**
   * Convertible bond bDRF
   * Transfer from Derify account balance or wallet account balance to USDT to wallet account
   * @param amount
   * @param bondAccountType 0-DerifyAccount, 1-WalletAccount
   * @return {*}
   */
  exchangeBond ({amount,bondAccountType}) {
    return this.DerifyBond.methods.exchangeBond(amount,bondAccountType).send();
  }

  /**
   * Income plan deposit
   * deposit f rom Derify account balance or wallet account balance
   * @param amount
   * @param bondAccountType
   * @return {*}
   */
  depositBondToBank ({amount,bondAccountType}) {
    return this.DerifyBond.methods.depositBondToBank(amount,bondAccountType).send();
  }

  /**
   * Income plan redemption
   * redemption，from "Income plan deposit" to your Derify account balance or wallet account balance
   * @param amount
   * @param bondAccountType
   * @return {*}
   */
  redeemBondFromBank ({amount, bondAccountType }) {
    return this.DerifyBond.methods.redeemBondFromBank(amount,bondAccountType).send();
  }

  /**
   * Get the user's "convertible bond bDRF" balance, "income plan deposit" balance
   * , "convertible bond bDRF" wallet account balance, bond annualized yield
   * @param trader
   * @return {BondInfo}
   */
  getBondInfo (trader) {
    return this.DerifyBond.methods.getBondInfo(trader).call();
  }

  /**
   * Get the upper limit of the user's "redeemable" bDRF. "Convertible bond bDRF"=>Exchange=>Convertible upper limit
   * @param trader User account address
   * @param bondAccountType，0-DerifyAccount, 1-WalletAccount
   * @return {int} bDRF exchangeable maximum（The precision is 8 bits）
   */
  getExchangeBondSizeUpperBound (trader, bondAccountType) {
    return this.DerifyBond.methods.getExchangeBondSizeUpperBound(trader, bondAccountType).call();
  }

  /**
   * 提取持仓挖矿收益
   * @param amount
   * @return {*}
   */
  withdrawPMReward (amount) {
    return this.DerifyStaking.methods.withdrawPMReward(amount).send();
  }

  /**
   * Obtain user's holding mining income
   * @param trader 用户账户地址
   * @return {int} 持仓挖矿收益（精度为8位）
   */
  getPMReward (trader) {
    return this.DerifyStaking.methods.getPMReward(trader).call();
  }
  /**
   * get All positions
   * @param trader
   * @param marketIdAddress
   * @return {PositionView[]}
   */
  async getTraderAllPosition (trader, marketIdAddress) {

    const positionDataView = new PositionDataView()

    //1.getTraderPosition
    const positions = []
    let derivativePosition = new DerivativePositions();
    derivativePosition = await this.getTraderPosition(trader, marketIdAddress)

    const tradeVariables = await this.__getTraderVariablesWithCache(trader)

    //1.1 long position
    if(derivativePosition.long && derivativePosition.long.leverage > 0
      && derivativePosition.long.size > 0){
      const longPositionView = await this.__convertPositionToPositionView(trader, marketIdAddress, SideEnum.LONG
        , derivativePosition.long, derivativePosition.longOrderStopProfitPosition, derivativePosition.longOrderStopLossPosition, tradeVariables);
      positions.push(longPositionView)
    }


    //1.2 short position
    if(derivativePosition.short
      && derivativePosition.short.leverage > 0
      && derivativePosition.short.size > 0){
      const shortPositionView = await this.__convertPositionToPositionView(trader, marketIdAddress, SideEnum.SHORT
        , derivativePosition.short, derivativePosition.shortOrderStopProfitPosition, derivativePosition.shortOrderStopLossPosition, tradeVariables);
      positions.push(shortPositionView)
    }


    positionDataView.positions = positions

    //2.my order position
    const limitOrders = []
    //2.1 long position
    const limitLongOrders = derivativePosition.longOrderOpenPosition
    for(const limitOrder of limitLongOrders){
      const limitLongOrderView = new OrderLimitPositionView()
      limitLongOrderView.side = SideEnum.LONG
      limitLongOrderView.coinAddress = marketIdAddress
      limitLongOrderView.orderType = OrderTypeEnum.LimitOrder
      if(!derivativePosition.longOrderStopProfitPosition){
        limitLongOrderView.stopProfitPrice = derivativePosition.longOrderStopProfitPosition.stopProfitPrice
      }

      if(!derivativePosition.longOrderStopLossPosition) {
        limitLongOrderView.stopLossPrice = derivativePosition.longOrderStopLossPosition.stopLossPrice
      }

      Object.assign(limitLongOrderView, limitOrder)
      limitOrders.push(limitLongOrderView)
    }

    //2.2 short position
    const limitShortOrders = derivativePosition.shortOrderOpenPosition

    for(const limitOrder of limitShortOrders){
      const limitShortOrderView = new OrderLimitPositionView()
      limitShortOrderView.side = SideEnum.SHORT
      limitShortOrderView.coinAddress = marketIdAddress
      limitShortOrderView.orderType = OrderTypeEnum.LimitOrder
      if(!derivativePosition.shortOrderStopProfitPosition){
        limitShortOrderView.stopProfitPrice = derivativePosition.shortOrderStopProfitPosition.stopProfitPrice
      }

      if(!derivativePosition.shortOrderStopProfitPosition) {
        limitShortOrderView.stopLossPrice = derivativePosition.shortOrderStopProfitPosition.stopLossPrice
      }

      Object.assign(limitShortOrderView, limitOrder)
      limitOrders.push(limitShortOrderView)
    }

    positionDataView.orderPositions = limitOrders

    return positionDataView
  }

  /**
   * build PositionToPositionView
   * @param trader
   * @param marketAddr
   * @param side {SideEnum}
   * @param positionDO {Position}
   * @param stopProfitPosition {StopPosition}
   * @param stopLossPosition {StopPosition}
   * @param tradeVariables
   * @private
   */
  async __convertPositionToPositionView (trader, marketAddr, side, positionDO, stopProfitPosition, stopLossPosition, tradeVariables) {
    const position = new PositionView()

    position.coinAddress = marketAddr
    position.side = side
    position.size = positionDO.size
    position.leverage = positionDO.leverage
    position.averagePrice = positionDO.price
    position.timestamp = positionDO.timestamp
    position.stopLossPrice = stopLossPosition.stopPrice
    position.stopProfitPrice = stopProfitPosition.stopPrice
    position.spotPrice = await this.getSpotPrice()

    // 3.Get floating profit and loss, position margin, rate of return
    const params = {trader:trader,
      marketIdAddress: marketAddr,
      side:  side,
      spotPrice: position.spotPrice,
      size:  position.size,
      leverage: Math.max(position.leverage, 1),
      averagePrice: position.averagePrice
    }

    const variables = await this.getTraderPositionVariables(params)

    position.margin = variables.margin
    position.unrealizedPnl = variables.unrealizedPnl
    position.margin = variables.margin

    //4.Get trader parameters
    position.marginBalance = tradeVariables.marginBalance
    position.totalPositionAmount = tradeVariables.totalPositionAmount
    position.marginRate = tradeVariables.marginRate

    const liquidPriceParam = {
      side: position.side,
      spotPrice: position.spotPrice,
      size: position.size,
      marginMaintenanceRatio:  position.marginRate,
      marginBalance: position.marginBalance,
      totalPositionAmount: position.totalPositionAmount
    }
    position.liquidatePrice = await this.getTraderPositionLiquidatePrice(liquidPriceParam);


    return position
  }

  async __getTraderVariablesWithCache (trader) {
    if(cache[trader] !== undefined){
      return cache[trader]
    }

    return this.getTraderVariables(trader)
  }
}

const SOLIDITY_RATIO = 1e8

export class PositionView {

  /**
   * token
   */
  coinAddress;

  /**
   * @see {SideEnum}
   */
  side;

  size;

  leverage;

  averagePrice;

  timestamp;

  unrealizedPnl;

  returnRate;

  spotPrice;

  margin;

  marginRate;

  marginBalance;

  totalPositionAmount;

  stopProfitPrice;

  stopLossPrice;

  liquidatePrice;
}

export class LimitPoistion {

  size;


  price;


  leverage;

  timestamp;
}

export class OrderLimitPositionView {

  /**
   * token
   */
  coinAddress;

  /**
   * @see {OrderTypeEnum}
   */
  orderType;

  /**
   * @see {SideEnum}
   */
  side;

  /**
   * stopProfitPrice（precision is 8 digits）
   */
  stopProfitPrice;

  //precision is 8 digits
  stopLossPrice;

  //时间戳
  stopTimestamp;

  /**
   *
   *@return {LimitPoistion[]}
   */
  limitOrders;
}


export class PositionDataView {
  /**
   * @return {PositionView[]}
   */
  positions;

  /**
   * @return {OrderLimitPositionView[]}
   */
  orderPositions;
}


export class BondInfo {
  /**
   * The precision is 8 bits
   */
  bondBalance;

  /**
   * The precision is 8 bits
   */
  bondReturnBalance;

  /**
   * The precision is 8 bits
   */
  bondWalletBalance;

  /**
   * The precision is 8 bits
   */
  bondAnnualInterestRate;
}

export class DerivativePositions {
  /**
   * boolean
   */
  isUsed;
  /**
   * @return {Position}
   */
  long;
  /**
   * @return {Position}
   */
  short;
  /**
   * @return {Position}
   */
  longOrderOpenPosition;
  /**
   * @return {Position[]}
   */
  shortOrderOpenPosition;
  /**
   * @return {StopPosition}
   */
  longOrderStopProfitPosition;
  /**
   * @return {StopPosition}
   */
  longOrderStopLossPosition;
  /**
   * @return {StopPosition}
   */
  shortOrderStopProfitPosition;
  /**
   * @return {StopPosition}
   */
  shortOrderStopLossPosition;
}

export class Position {
  /**
   * bool
   */
  isUsed;
  /**
   * uint256
   */
  size;
  /**
   * uint256
   */
  price;
  /**
   * uint256
   */
  leverage;

  /**
   * uint256
   */
  timestamp;
}


export class StopPosition {
  /**
   * {bool}
   */
  isUsed;
  /**
   * {int}
   */
  stopPrice;

  /**
   * {int}
   */
  timestamp;
}


window.Contract = Contract
