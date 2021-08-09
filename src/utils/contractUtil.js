import Web3 from 'web3'
import ABIData from './contract'
import BigNumber from 'bignumber.js'

window.BigNumber = BigNumber
window.Web3 = Web3;
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
  bDRF: ABIData.bDRF.address,
  eDRF: ABIData.bDRF.address,
  USDT: ABIData.DUSD.address
}

const cache = {}

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
    const web3 = new Web3(window.ethereum)

    const gasPrice = null;

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
    this.bDRF = new web3.eth.Contract(ABIData.bDRF.abi, ABIData.bDRF.address, Object.assign({ gasPrice }, option))
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

        const approveRet = await this.__approve(tokenContract, ABIData.DerifyExchange, amount)

        if(approveRet){
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
    return (async () => {

      let tokenAmount = 0
      let decimals = 18
      if(ABIData.DUSD.address === token){
        decimals = await this.DUSD.methods.decimals().call()
        tokenAmount = await this.DUSD.methods.balanceOf(trader).call()
      }else if(ABIData.bDRF.address === token){
        decimals = await this.bDRF.methods.decimals().call()
        tokenAmount = await this.bDRF.methods.balanceOf(trader).call()
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
   * @param token
   * @param trader
   * @param openType enum OpenType { MarketOrder, LimitOrder }
   * @param price
   * @param leverage
   * @return {*}
   */
  getTraderOpenUpperBound ({token, trader, openType, price, leverage}) {
    return this.DerifyExchange.methods.getTraderOpenUpperBound(token, trader, openType, price, leverage).call()
  }

  /**
   * Get the maximum open position of the system
   * @param token
   * @param side
   * @return {*}
   */
  getSysOpenUpperBound ({token, side}) {
    return this.DerifyExchange.methods.getSysOpenUpperBound(token, side).call()
  }

  /**
   * Calculate margin, floating profit and loss, rate of return
   * @param trader
   * @param token
   * @param side
   * @param spotPrice
   * @param size
   * @param leverage
   * @param averagePrice
   */
  getTraderPositionVariables ({trader, token, side, spotPrice, size, leverage, averagePrice}) {
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
   * @param token
   * @return {Web3.eth.Contract}
   */
  __getDerifyDerivativeContract(token) {

    if(ABIData.DerifyDerivative.BTC.token === token){
      return this.DerifyDerivative.BTC
    }

    return this.DerifyDerivative.ETH
  }
  /**
   * Get positions
   * @param trader
   * @param token
   * @return {DerivativePositions}
   */
  getTraderPosition (trader, token) {
    return this.__getDerifyDerivativeContract(token).methods.getTraderDerivativePositions(trader).call()
  }

  /**
   * Set the current price of the currency
   * @param token  token contract address
   * @param price
   * @return {*}
   */
  setSpotPrice (token, price) {
    return this.__getDerifyDerivativeContract(token).methods.setSpotPrice(token, price).send()
  }

  /**
   * Get the current price of the token
   * @param token 币合约地址
   * @return {*}
   */
  getSpotPrice (token) {
    return this.__getDerifyDerivativeContract(token).methods.getSpotPrice().call()
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
   * @param token
   * @param trader
   * @param orderType 0-LimitOrder, 1-StopProfitOrder, 2-StopLossOrder
   * @param side
   * @param timestamp
   * @return {*}
   */
  cancleOrderedPosition ({token, trader, orderType, side, timestamp}) {
    if (orderType === OrderTypeEnum.LimitOrder) {
      return this.__getDerifyDerivativeContract(token).methods.cancleOrderedLimitPosition(trader, side, timestamp).send()
    } else {
      return this.__getDerifyDerivativeContract(token).methods.cancleOrderedStopPosition(trader, orderType, side).send()
    }

  }
  /**
   * Cancel all orders
   * @param token
   * @param trader
   * @return {*}
   */
  cancleAllOrderedPositions (token, trader) {
    return this.__getDerifyDerivativeContract(token).methods.cancleAllOrderedPositions(trader).send()
  }

  /**
   * getPositionChangeFeeRatio
   * @param token
   * @return {*}
   */
  getPositionChangeFeeRatio (token) {
    return this.__getDerifyDerivativeContract(token).methods.getPositionChangeFeeRatio().call()
  }

  /**
   * getTradingFee
   * @param token
   * @param size
   * @param price
   */
  getTradingFee (token, size, price) {
    return this.__getDerifyDerivativeContract(token).methods.getTradingFee(size, price).call()
  }
  getCloseUpperBound ({token, trader, side}) {
    return this.DerifyExchange.methods.getCloseUpperBound(token, trader, side).call()
  }

  /**
   * getPositionChangeFee
   * @param token
   * @param side 0-LONG，1-SHORT，2-HEDGE
   * @param actionType 0-open, 1-close
   * @param size
   * @param price
   */
  getPositionChangeFee (token, side, actionType, size, price) {
    return this.__getDerifyDerivativeContract(token).methods.getPositionChangeFee(side, actionType, size, price).call()
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
  exchangeBond ({amount, bondAccountType}) {

    return new Promise((resolve, reject) => {
      (async () => {
        try{
          let approveRet = false

          if(bondAccountType === BondAccountType.WalletAccount) {
            approveRet = await this.__approve(this.bDRF, ABIData.DerifyBond, amount)
          }else{
            approveRet = true
          }

          if(approveRet){
            resolve(await this.DerifyBond.methods.exchangeBond(amount, bondAccountType).send())
          }else{
            reject('approve failed')
          }
        }catch (e){
          reject(e)
        }
      })()
    })
  }

  /**
   * Income plan deposit
   * deposit f rom Derify account balance or wallet account balance
   * @param amount
   * @param bondAccountType
   * @return {*}
   */
  depositBondToBank ({amount,bondAccountType}) {
    return new Promise((resolve, reject) => {
      (async () => {
        try{
          let approveRet = false

          if(bondAccountType === BondAccountType.WalletAccount) {
            approveRet = await this.__approve(this.bDRF, ABIData.DerifyBond, amount)
          }else{
            approveRet = true
          }

          if(approveRet){
            resolve(await this.DerifyBond.methods.depositBondToBank(amount, bondAccountType).send())
          }else{
            reject('approve failed')
          }
        }catch (e) {
          reject('approve failed')
        }

      })()
    })
  }

  async __approve(tokenContract, contractABI, amount) {
    let decimals = await tokenContract.methods.decimals().call();

    const decimalNum = parseInt(decimals)

    const approveNum = toShiftedHexString(amount, decimalNum - contractDecimals);

    //The wallet obtains the authorized amount
    let ret = false;

    try {
      ret = await tokenContract.methods.approve(contractABI.address, approveNum).send()

      return ret
    } catch (e) {
      return false
    }
  }

  /**
   * Income plan redemption
   * redemption，from "Income plan deposit" to your Derify account balance or wallet account balance
   * @param amount
   * @param bondAccountType
   * @return {*}
   */
  redeemBondFromBank ({amount, bondAccountType }) {
    return this.DerifyBond.methods.redeemBondFromBank(amount, bondAccountType).send();
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
  getExchangeBondSizeUpperBound ({trader, bondAccountType}) {
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
   * @return {Promise<int>} 持仓挖矿收益（精度为8位）
   */
  getPMReward (trader) {
    return this.DerifyStaking.methods.getPMReward(trader).call();
  }
  /**
   * get All positions
   * @param trader
   * @param token
   * @return {PositionDataView}
   */
  async getTraderAllPosition (trader, token) {

    const positionDataView = new PositionDataView()

    //1.getTraderPosition
    const positions = []
    let derivativePosition = new DerivativePositions();
    derivativePosition = await this.getTraderPosition(trader, token)

    const tradeVariables = await this.__getTraderVariablesWithCache(trader)

    //1.1 long position
    if(derivativePosition.long && derivativePosition.long.leverage > 0
      && derivativePosition.long.size > 0){
      const longPositionView = await this.__convertPositionToPositionView(trader, token, SideEnum.LONG
        , derivativePosition.long, derivativePosition.longOrderStopProfitPosition, derivativePosition.longOrderStopLossPosition, tradeVariables);
      positions.push(longPositionView)
    }


    //1.2 short position
    if(derivativePosition.short
      && derivativePosition.short.leverage > 0
      && derivativePosition.short.size > 0){
      const shortPositionView = await this.__convertPositionToPositionView(trader, token, SideEnum.SHORT
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
      limitLongOrderView.token = token
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
      limitShortOrderView.token = token
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

    positionDataView.stopOrderPoistions = []
    positionDataView.orderPositions.push({side: SideEnum.SHORT,
      token,
      size: derivativePosition.short.size,
      leverage: derivativePosition.short.leverage,
      orderType: OrderTypeEnum.StopLossOrder,
      stopPrice: derivativePosition.shortOrderStopLossPosition.stopPrice,
      timestamp: derivativePosition.shortOrderStopLossPosition.timestamp,
      isUsed: derivativePosition.shortOrderStopLossPosition.isUsed});

    positionDataView.orderPositions.push({side: SideEnum.SHORT, token,
      orderType: OrderTypeEnum.StopProfitOrder,
      size: derivativePosition.short.size,
      leverage: derivativePosition.short.leverage,
      stopPrice: derivativePosition.shortOrderStopProfitPosition.stopPrice,
      timestamp: derivativePosition.shortOrderStopProfitPosition.timestamp,
      isUsed: derivativePosition.shortOrderStopProfitPosition.isUsed});

    positionDataView.orderPositions.push({side: SideEnum.LONG, token,
      orderType: OrderTypeEnum.StopLossOrder,
      size: derivativePosition.long.size,
      leverage: derivativePosition.long.leverage,
      stopPrice: derivativePosition.longOrderStopLossPosition.stopPrice,
      timestamp: derivativePosition.longOrderStopLossPosition.timestamp,
      isUsed: derivativePosition.longOrderStopLossPosition.isUsed});

    positionDataView.orderPositions.push({side: SideEnum.LONG, token,
      orderType: OrderTypeEnum.StopProfitOrder,
      size: derivativePosition.long.size,
      leverage: derivativePosition.long.leverage,
      stopPrice: derivativePosition.longOrderStopProfitPosition.stopPrice,
      timestamp: derivativePosition.longOrderStopProfitPosition.timestamp,
      isUsed: derivativePosition.longOrderStopProfitPosition.isUsed});


    return positionDataView
  }

  /**
   * build PositionToPositionView
   * @param trader
   * @param token
   * @param side {SideEnum}
   * @param positionDO {Position}
   * @param stopProfitPosition {StopPosition}
   * @param stopLossPosition {StopPosition}
   * @param tradeVariables
   * @private
   */
  async __convertPositionToPositionView (trader, token, side, positionDO, stopProfitPosition, stopLossPosition, tradeVariables) {
    const position = new PositionView()

    position.token = token
    position.side = side
    position.isUsed = positionDO.isUsed
    position.size = positionDO.size
    position.leverage = positionDO.leverage
    position.averagePrice = positionDO.price
    position.timestamp = positionDO.timestamp
    position.stopLossPrice = stopLossPosition.stopPrice
    position.stopProfitPrice = stopProfitPosition.stopPrice
    position.spotPrice = await this.getSpotPrice()

    // 3.Get floating profit and loss, position margin, rate of return
    const params = {trader:trader,
      token: token,
      side:  side,
      spotPrice: position.spotPrice,
      size:  position.size,
      leverage: Math.max(position.leverage, 1),
      averagePrice: position.averagePrice
    }

    const variables = await this.getTraderPositionVariables(params)

    position.margin = variables.margin
    position.unrealizedPnl = variables.unrealizedPnl

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
  isUsed;
  /**
   * token
   */
  token;

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
  isUsed;

  /**
   * token
   */
  token;

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

  /**
   * @return {OrderStopPoistionView[]}
   */
  stopOrderPoistions;
}

export class OrderStopPoistionView {

  /**
   * @return {boolean}
   */
  isUsed;

  /**
   * @return {SideEnum}
   */
  side;

  /**
   * @return {OrderTypeEnum}
   */
  orderType;

  /**
   * @return {int}
   */
  stopPrice;

  /**
   * @return {long}
   */
  timestamp;
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
