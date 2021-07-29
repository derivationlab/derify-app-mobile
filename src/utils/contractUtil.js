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
 * 债券账户种类
 */
export class BondAccountType {

  /**
   * 0-DerifyAccount-Derify账户
   * @return {number}
   */
  static get DerifyAccount () {
    return 0
  }

  /**
   * 1-WalletAccount-用户钱包账户
   * @return {number}
   */
  static get WalletAccount () {
    return 1
  }
}

/**
 * 委托单类型
 */
export class OrderTypeEnum {
  //-限价委托,
 static get LimitOrder () {
   return 0
 }
 //-止盈委托,
 static get StopProfitOrder () {
   return 1
 }
 //-止损委托
 static get StopLossOrder () {
   return 2
 }

}

/**
 * 开仓价格类型
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
  return (new BigNumber(amount)).shiftedBy(contractDecimals - tokenDecimals).toNumber()
}

/**
 *
 * @param abi
 * @param address
 * @param option 对象,实际例子如右: {from: '',gasPrice: '20000000000'}
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
   * 充值金额
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

        //钱包获取授权金额
        let ret = false;

        try{
          ret = await tokenContract.methods.approve(ABIData.DerifyExchange.address, approveNum).send()
        }catch (e){
          reject('授权拒绝')
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
   * 提现
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
      console.log(decimals)
      let tokenAmount = 0;
      if(ABIData.DUSD.address === token){
        tokenAmount = await this.DUSD.methods.balanceOf(trader).call()
        console.log(tokenAmount)
      }else if(ABIData.bDRD.address === token){
        tokenAmount = 0
      }


      return convertTokenNumToContractNum(tokenAmount, decimals)
    })()

  }

  /**
   * 开仓
   * @param token 当前合约币种地址
   * @param side LONG-做多，SHORT-做空，HEDGE-对冲
   * @param openType MarketOrder-市价委托，LimitOrder-限价委托
   * @param size 开仓量（按币种计价）
   * @param price 开仓价（精度为8位）
   * @param leverage 杠杆（精度为8位）
   * @return {*}
   */
  openPosition ({token, side, openType, size, price, leverage}) {
    return this.DerifyExchange.methods
      .openPosition(token, side, openType, size, price, leverage)
      .send()
  }
  /**
   * 平仓
   * @param token 当前合约币种地址
   * @param side LONG-做多，SHORT-做空，HEDGE-对冲
   * @param size 仓量
   * @return {*}
   */
  closePosition (token, side, size) {
    return this.DerifyExchange.methods.closePosition(token, side, size)
      .send()
  }

  /**
   * 一键平仓
   */
  closeAllPositions () {
    return this.DerifyExchange.methods.closeAllPositions()
      .send()
  }


  /**
   * 获取账户信息
   * @param trader
   * @return {*}
   */
  getTraderAccount (trader) {
    return this.DerifyExchange.methods.getTraderAccount(trader).call()
  }
  /**
   * 获取用户最大开仓量
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
   * 获取系统最大开仓量
   * @param marketIdAddress
   * @param side
   * @return {*}
   */
  getSysOpenUpperBound ({marketIdAddress, side}) {
    return this.DerifyExchange.methods.getSysOpenUpperBound(marketIdAddress, side).call()
  }

  /**
   * 计算保证金、浮动盈亏、回报率
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
   * 获取用户保证金信息
   * @param trader
   * @return {*}
   */
  getTraderVariables (trader) {
    return this.DerifyExchange.methods.getTraderVariables(trader).call()
  }

  /**
   * 强平仓金额
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

  onDeposit (user, callback) {
    this.DerifyExchange.events.Deposit({user: user}, callback)
  }
  onWithdraw (user, callback) {
    this.DerifyExchange.events.Withdraw({user: user}, callback)
  }

  /**
   * 根据币种获取合约对象
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
   * 获取持仓
   * @param trader
   * @param marketIdAddress
   * @return {DerivativePositions}
   */
  getTraderPosition (trader, marketIdAddress) {
    return this.__getDerifyDerivativeContract(marketIdAddress).methods.getTraderDerivativePositions(trader).call()
  }

  /**
   * 设置币种的当前价格
   * @param marketIdAddress  币合约地址
   * @param price
   * @return {*}
   */
  setSpotPrice (marketIdAddress, price) {
    return this.__getDerifyDerivativeContract(marketIdAddress).methods.setSpotPrice(marketIdAddress, price).send()
  }

  /**
   * 获取币种当前价格
   * @param marketIdAddress 币合约地址
   * @return {*}
   */
  getSpotPrice (marketIdAddress) {
    return this.__getDerifyDerivativeContract(marketIdAddress).methods.getSpotPrice().call()
  }

  /**
   * 设置止盈止损委托
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
   * 取消委托
   * @param marketIdAddress
   * @param trader
   * @param orderType LimitOrder-限价委托, StopProfitOrder-止盈委托, StopLossOrder-止损委托
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
   * 取消全部委托
   * @param marketIdAddress
   * @param trader
   * @return {*}
   */
  cancleAllOrderedPositions (marketIdAddress, trader) {
    return this.__getDerifyDerivativeContract(marketIdAddress).methods.cancleAllOrderedPositions(trader).send()
  }

  /**
   * 获取动仓费率
   * @param marketIdAddress
   * @return {*}
   */
  getPositionChangeFeeRatio (marketIdAddress) {
    return this.__getDerifyDerivativeContract(marketIdAddress).methods.getPositionChangeFeeRatio().call()
  }

  /**
   * 获取手续费
   * @param marketIdAddress
   * @param size
   * @param price
   */
  getTradingFee (marketIdAddress, size, price) {
    return this.__getDerifyDerivativeContract(marketIdAddress).methods.getTradingFee(size, price).call()
  }

  /**
   * 获取动仓费
   * @param marketIdAddress
   * @param side LONG-做多，SHORT-做空，HEDGE-对冲
   * @param actionType 0 开仓, 1平仓
   * @param size
   * @param price
   */
  getPositionChangeFee (marketIdAddress, side, actionType, size, price) {
    return this.__getDerifyDerivativeContract(marketIdAddress).methods.getPositionChangeFee(side, actionType, size, price).call()
  }

  /**
   * 可兑换债券bDRF
   * 从Derify账户转到钱包账户
   * @param amount
   * @return {*}
   */
  withdrawBond (amount) {
    return this.DerifyBond.methods.withdrawBond(amount).send();
  }

  /**
   * 可兑换债券bDRF
   * 兑换，从Derify账户余额或者钱包账户余额 兑换 成USDT到钱包账户
   * @param amount
   * @param bondAccountType 债券账户种类 0-DerifyAccount-Derify账户, 1-WalletAccount-用户钱包账户
   * @return {*}
   */
  exchangeBond ({amount,bondAccountType}) {
    return this.DerifyBond.methods.exchangeBond(amount,bondAccountType).send();
  }

  /**
   * 收益计划存入
   * 存入，从Derify账户余额或者钱包账户余额 存入 "收益计划存入"
   * @param amount
   * @param bondAccountType
   * @return {*}
   */
  depositBondToBank ({amount,bondAccountType}) {
    return this.DerifyBond.methods.depositBondToBank(amount,bondAccountType).send();
  }

  /**
   * 收益计划赎回
   * 赎回，从 "收益计划存入" 赎回到 Derify账户余额或者钱包账户余额
   * @param amount
   * @param bondAccountType
   * @return {*}
   */
  redeemBondFromBank ({amount, bondAccountType }) {
    return this.DerifyBond.methods.redeemBondFromBank(amount,bondAccountType).send();
  }

  /**
   * 获取用户"可兑换债券bDRF"余额，"收益计划存入"余额， "可兑换债券bDRF"钱包账户余额，债券年化收益率
   * @param trader
   * @return {BondInfo}
   */
  getBondInfo (trader) {
    return this.DerifyBond.methods.getBondInfo(trader).call();
  }

  /**
   * 获取用户"可兑换"bDRF上限。"可兑换债券bDRF"=>兑换=>可兑换 上限
   * @param trader 用户账户地址
   * @param bondAccountType 债券账户种类，0-DerifyAccount-Derify账户, 1-WalletAccount-用户钱包账户
   * @return {int} bDRF可兑换最大值（精度为8位）
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
   * 获取用户持仓挖矿收益
   * @param trader 用户账户地址
   * @return {int} 持仓挖矿收益（精度为8位）
   */
  getPMReward (trader) {
    return this.DerifyStaking.methods.getPMReward(trader).call();
  }
  /**
   * 所有持仓
   * @param trader
   * @param marketIdAddress
   * @return {PositionView[]}
   */
  async getTraderAllPosition (trader, marketIdAddress) {

    const positionDataView = new PositionDataView()

    //1.我的持仓
    const positions = []
    let derivativePosition = new DerivativePositions();
    derivativePosition = await this.getTraderPosition(trader, marketIdAddress)

    const tradeVariables = await this.__getTraderVariablesWithCache(trader)

    //1.1 多仓处理
    if(derivativePosition.long && derivativePosition.long.leverage > 0
      && derivativePosition.long.size > 0){
      const longPositionView = await this.__convertPositionToPositionView(trader, marketIdAddress, SideEnum.LONG
        , derivativePosition.long, derivativePosition.longOrderStopProfitPosition, derivativePosition.longOrderStopLossPosition, tradeVariables);
      positions.push(longPositionView)
    }


    //1.2 空仓处理
    if(derivativePosition.short
      && derivativePosition.short.leverage > 0
      && derivativePosition.short.size > 0){
      const shortPositionView = await this.__convertPositionToPositionView(trader, marketIdAddress, SideEnum.SHORT
        , derivativePosition.short, derivativePosition.shortOrderStopProfitPosition, derivativePosition.shortOrderStopLossPosition, tradeVariables);
      positions.push(shortPositionView)
    }


    positionDataView.positions = positions

    //2.我的委托
    const limitOrders = []
    //2.1 多仓处理
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

    //2.2 空仓处理
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
   * 对象转换
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

    // 3.获取浮动盈亏、持仓保证金、回报率
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

    //4.获取用户参数
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
   * 币的地址
   */
  coinAddress;

  // 多&空
  side;

  // 持仓量
  size;

  // 杠杆
  leverage;

  // 开仓均价
  averagePrice;

  // 时间戳
  timestamp;

  // 浮动盈亏
  unrealizedPnl;

  // 回报率
  returnRate;

  // 当前价格
  spotPrice;

  // 持仓保证金
  margin;

  // 持仓保证金率
  marginRate;

  // 保证金余额
  marginBalance;

  // 持仓总额
  totalPositionAmount;

  // 止盈
  stopProfitPrice;

  // 止损
  stopLossPrice;

  // 预估强平价格
  liquidatePrice;
}

export class LimitPoistion {
  /**
   * 仓量
   */
  size;

  /**
   * 开仓价格
   */
  price;

  /**
   * 杠杆
   */
  leverage;

  /**
   * 时间戳
   */
  timestamp;
}
/**
 * 我的委托
 */
export class OrderLimitPositionView {

  /**
   * 币的地址
   */
  coinAddress;

  /**
   * @return
   */
  orderType;

  // 多&空
  side;

  /**
   * 止盈价格（精度为8位）
   */
  stopProfitPrice;

  //止损价格
  stopLossPrice;

  //时间戳
  stopTimestamp;

  /**
   * 时间戳
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
   * "可兑换债券bDRF"Derify账户余额（精度为8位）
   */
  bondBalance;

  /**
   * "收益计划存入"余额（精度为8位）
   */
  bondReturnBalance;

  /**
   * "可兑换债券bDRF"钱包账户余额（精度为8位）
   */
  bondWalletBalance;

  /**
   * 债券年化收益率（精度为8位）
   */
  bondAnnualInterestRate;
}

export class DerivativePositions {
  /**
   * boolean
   */
  isUsed;
  /**
   *  多仓持仓
   * @return {Position}
   */
  long;
  /**
   * @return {Position}
   */
  short; // 空仓持仓
  /**
   * @return {Position}
   */
  longOrderOpenPosition; // 多仓限价委托单
  /**
   * @return {Position[]}
   */
  shortOrderOpenPosition; // 空仓限价委托单
  /**
   * @return {StopPosition}
   */
  longOrderStopProfitPosition; // 多仓止盈委托单
  /**
   * @return {StopPosition}
   */
  longOrderStopLossPosition; // 多仓止损委托单
  /**
   * @return {StopPosition}
   */
  shortOrderStopProfitPosition; // 空仓止盈委托单
  /**
   * @return {StopPosition}
   */
  shortOrderStopLossPosition; // 空仓止损委托单
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
