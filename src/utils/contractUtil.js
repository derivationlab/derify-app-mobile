import Web3 from 'web3'
import ABIData from './contract'

const cache = {}

export const contractDebug = true

/**
 *
 * @param abi
 * @param address
 * @param option 对象,实际例子如右: {from: '',gasPrice: '20000000000'}
 * @constructor
 */
export default class Contract {

  constructor (option) {

    //TODO 确认该值
    const gasPrice = null;"20000000000"

    const web3 = new Web3()
    const provider = window.ethereum
    web3.setProvider(provider)

    this.web3 = web3

    this.DerifyBond = new web3.eth.Contract(ABIData.DerifyBond.abi, ABIData.DerifyBond.address, Object.assign({ gasPrice }, option))

    this.DerifyDerivative = {
      BTC: new web3.eth.Contract(ABIData.DerifyDerivative.abi, ABIData.DerifyDerivative.BTC.address, Object.assign({ gasPrice }, option)),
      ETH: new web3.eth.Contract(ABIData.DerifyDerivative.abi, ABIData.DerifyDerivative.ETH.address, Object.assign({ gasPrice }, option))
    }

    this.DerifyExchange = new web3.eth.Contract(ABIData.DerifyExchange.abi, ABIData.DerifyExchange.address, Object.assign({ gasPrice }, option))
    this.DerifyStaking = new web3.eth.Contract(ABIData.DerifyStaking.abi, ABIData.DerifyStaking.address, Object.assign({ gasPrice }, option))
  }

  /**
   * 充值金额
   * @param amount
   * @return
   */
  deposit (amount) {
    return this.DerifyExchange.methods.deposit(amount).send()
  }
  /**
   * 提现
   * @param amount
   * @returns {*}
   */
  withdraw (amount) {
    return this.DerifyExchange.methods.withdraw(amount).send()
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
  openPosition (token, side, openType, size, price, leverage) {
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
  getTraderOpenUpperBound (marketIdAddress, trader, openType, price, leverage) {
    return this.DerifyExchange.methods.getTraderOpenUpperBound(marketIdAddress, trader, openType, price, leverage).call()
  }

  /**
   * 获取系统最大开仓量
   * @param marketIdAddress
   * @param side
   * @return {*}
   */
  getSysOpenUpperBound (marketIdAddress, side) {
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
  getTraderPositionVariables (trader, marketIdAddress, side, spotPrice, size, leverage, averagePrice) {
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
  getTraderPositionLiquidatePrice (side, spotPrice, size, marginMaintenanceRatio, marginBalance, totalPositionAmount) {
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
  getDerifyDerivativeContract(marketIdAddress) {

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
    return this.getDerifyDerivativeContract(marketIdAddress).methods.getTraderDerivativePositions(trader).call()
  }

  /**
   * 设置币种的当前价格
   * @param marketIdAddress  币合约地址
   * @param price
   * @return {*}
   */
  setSpotPrice (marketIdAddress, price) {
    return this.getDerifyDerivativeContract(marketIdAddress).methods.setSpotPrice(marketIdAddress, price).send()
  }

  /**
   * 获取币种当前价格
   * @param marketIdAddress 币合约地址
   * @return {*}
   */
  getSpotPrice (marketIdAddress) {
    return this.getDerifyDerivativeContract(marketIdAddress).methods.getSpotPrice().call()
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
  orderStopPosition (token, trader, side, stopType, stopPrice) {
    return this.getDerifyDerivativeContract(token).methods.orderStopPosition(trader, side, stopType, stopPrice)
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
  cancleOrderedPosition (marketIdAddress, trader, orderType, side, timestamp) {
    if (orderType === 0) {
      return this.getDerifyDerivativeContract(token).methods.cancleOrderedLimitPosition(trader, side, timestamp).send()
    } else {
      return this.getDerifyDerivativeContract(token).methods.cancleOrderedStopPosition(trader, orderType, side).send()
    }

  }
  /**
   * 取消全部委托
   * @param marketIdAddress
   * @param trader
   * @return {*}
   */
  cancleAllOrderedPositions (marketIdAddress, trader) {
    return this.getDerifyDerivativeContract(marketIdAddress).methods.cancleAllOrderedPositions(trader).send()
  }

  /**
   * 获取动仓费率
   * @param marketIdAddress
   * @return {*}
   */
  getPositionChangeFeeRatio (marketIdAddress) {
    return this.getDerifyDerivativeContract(marketIdAddress).methods.getPositionChangeFeeRatio().call()
  }

  /**
   * 获取手续费
   * @param marketIdAddress
   * @param size
   * @param price
   */
  getTradingFee (marketIdAddress, size, price) {
    return this.getDerifyDerivativeContract(marketIdAddress).methods.getTradingFee(size, price).call()
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
    return this.getDerifyDerivativeContract(marketIdAddress).methods.getPositionChangeFee(side, actionType, size, price).call()
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
  exchangeBond (amount,bondAccountType) {
    return this.DerifyBond.methods.exchangeBond(amount,bondAccountType).send();
  }

  /**
   * 收益计划存入
   * 存入，从Derify账户余额或者钱包账户余额 存入 "收益计划存入"
   * @param amount
   * @param bondAccountType
   * @return {*}
   */
  depositBondToBank (amount,bondAccountType) {
    return this.DerifyBond.methods.depositBondToBank(amount,bondAccountType).send();
  }

  /**
   * 收益计划赎回
   * 赎回，从 "收益计划存入" 赎回到 Derify账户余额或者钱包账户余额
   * @param amount
   * @param bondAccountType
   * @return {*}
   */
  redeemBondFromBank (amount, bondAccountType) {
    return this.DerifyBond.methods.redeemBondFromBank(amount,bondAccountType).send();
  }

  /**
   * 获取用户"可兑换债券bDRF"余额，"收益计划存入"余额， "可兑换债券bDRF"钱包账户余额，债券年化收益率
   * @param trader
   * @return {BondInfo}
   */
  getBondInfo (trader) {
    return this.DerifyBond.methods.getBondInfo(trader);
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
    return this.DerifyStaking.methods.withdrawPMReward(trader).call();
  }
  /**
   * 所有持仓
   * @param trader
   * @param marketIdAddress
   * @return Array<PositionView>
   */
  async getTraderAllPosition (trader, marketIdAddress) {
    const positionArr = []
    let derivativePosition = new DerivativePositions();
    derivativePosition = await this.getTraderPosition(trader, marketIdAddress)
    derivativePosition.long;


    return positionArr
  }

  /**
   * 获取某种持仓
   * @param trader
   * @param marketIdAddress
   * @param side
   * @return {Promise<PositionView>}
   */
  async getTraderViewPosition (trader, marketIdAddress, side) {
    let position = new PositionView()
    position.side = side
    position.coinAddress = marketIdAddress

    // 1.获取持仓量、杠杆、开仓均价、时间戳
    position = Object.assign(position, await this.getTraderPosition(trader, marketIdAddress, side))
    position.averagePrice = position.price
    position.spotPrice = await this.getSpotPrice(marketIdAddress)

    // 2.获取止盈、止损价格
    // 2.1.获取止盈委托
    const profitPostion = await this.getTraderOrderStopPosition(trader, marketIdAddress, side, 0)

    // 2.2.获取止损委托
    const lossPostion = await this.getTraderOrderStopPosition(trader, marketIdAddress, side, 1)

    // 2.3.合并
    position.stopProfitPrice = profitPostion.stopPrice
    position.stopLossPrice = lossPostion.stopPrice


    // 3.获取浮动盈亏、持仓保证金、回报率
    const variables = await this.getTraderPositionVariables(trader, marketIdAddress
      , side, position.spotPrice, position.size, position.leverage, position.averagePrice)
    position.margin = variables.margin
    position.unrealizedPnl = variables.unrealizedPnl
    position.margin = variables.margin

    //4.获取用户参数
    const tradeVariables = await this.getTraderVariablesWithCache(trader)
    position.marginBalance = tradeVariables.marginBalance
    position.totalPositionAmount = tradeVariables.totalPositionAmount
    position.marginRate = tradeVariables.marginRate

    position.liquidatePrice = await this.getTraderPositionLiquidatePrice(position.side, position.spotPrice, position.size, position.marginRate, position.marginBalance, position.totalPositionAmount);

    return position
  }

  async getTraderVariablesWithCache (trader) {
    if(cache[trader] !== undefined){
      return cache[trader]
    }

    return this.getTraderVariables(trader)
  }
  async getTraderAllLimitPosition (trader, marketIdAddress) {
    const positionArr = []

    const longArr = await this.getTraderOrderLimitPosition(trader, marketIdAddress, 0);

    longArr.forEach(function(limitOrder){
      positionArr.push(limitOrder)
    })

    const shortArr = await this.getTraderOrderLimitPosition(trader, marketIdAddress, 1);
    // 多
    shortArr.forEach(function(limitOrder){
      positionArr.push(limitOrder)
    })

    return positionArr
  }
  async getTraderOrderLimitPosition (trader, marketIdAddress, side) {

    const arr = [];


    // 1.获取持仓量、杠杆、开仓均价、时间戳
    const limitOrders = await this.getTraderOrderLimitPositions(trader, marketIdAddress, side);

    // 2.获取止盈、止损价格
    // 2.1.获取止盈委托
    const profitPostion = await this.getTraderOrderStopPosition(trader, marketIdAddress, side, 0)

    // 2.2.获取止损委托
    const lossPostion = await this.getTraderOrderStopPosition(trader, marketIdAddress, side, 1)

    const spotPrice = await this.getSpotPrice(marketIdAddress)

    for (const limitOrder of limitOrders) {
      //LimitPoistion

      let orderLimitPositionView = new OrderLimitPositionView()
      orderLimitPositionView.side = side
      orderLimitPositionView.coinAddress = marketIdAddress

      orderLimitPositionView.spotPrice = spotPrice

      orderLimitPositionView.stopLossPrice = lossPostion.stopPrice

      orderLimitPositionView.stopProfitPrice = profitPostion.stopPrice
      orderLimitPositionView = Object.assign({}, orderLimitPositionView, limitOrder)

      arr.push(orderLimitPositionView)
    }


    return arr
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

export const Token = {
  BTC: ABIData.DerifyDerivative.BTC.address,
  ETH: ABIData.DerifyDerivative.ETH.address
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
   * Array<LimitPoistion>
   */
  limitOrders;
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
   *  // 多仓持仓
   * Position
   */
  long;
  /**
   * Position
   */
  short; // 空仓持仓
  /**
   * Position[]
   */
  longOrderOpenPosition; // 多仓限价委托单
  /**
   * Position[]
   */
  shortOrderOpenPosition; // 空仓限价委托单
  /**
   * StopPosition
   */
  longOrderStopProfitPosition; // 多仓止盈委托单
  /**
   * StopPosition
   */
  longOrderStopLossPosition; // 多仓止损委托单
  /**
   * StopPosition
   */
  shortOrderStopProfitPosition; // 空仓止盈委托单
  /**
   * StopPosition
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
