import Web3 from 'web3'

const cache = {}
/**
 *
 * @param abi
 * @param address
 * @param option 对象,实际例子如右: {from: '',gasPrice: '20000000000'}
 * @constructor
 */
export default class Contract {

  constructor (abi, address, option) {
    const web3 = new Web3()
    const provider = window.ethereum
    web3.setProvider(provider)

    this.web3 = web3
    this.contract = new web3.eth.Contract(abi, address, Object.assign({ gasPrice: '20000000000' }, option))
  }

  /**
   * 充值金额
   * @param amount
   * @return
   */
  deposit (amount) {
    return this.contract.methods.deposit(amount).send()
  }
  /**
   * 提现
   * @param amount
   * @returns {*}
   */
  withdraw (amount) {
    return this.contract.methods.withdraw(amount).send()
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
    return this.contract.methods
      .openPosition(token, side, openType, size, price, leverage)
      .send()
  }

  /**
   * 设置止盈止损委托
   * @param token
   * @param side
   * @param stopType
   * @param stopPrice
   * @return {*}
   */
  orderStopPosition (token, side, stopType, stopPrice) {
    return this.contract.methods.orderStopPosition(token, side, stopType, stopPrice)
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
    return this.contract.methods.closePosition(token, side, size)
      .send()
  }
  /**
   * 一键平仓
   */
  closeAllPositions () {
    return this.contract.methods.closeAllPositions()
      .send()
  }
  /**
   * 获取账户信息
   * @param trader
   * @return {*}
   */
  getTraderAccount (trader) {
    return this.contract.methods.getTraderAccount(trader).call()
  }
  /**
   * 设置币种的当前价格
   * @param marketIdAddress  币合约地址
   * @param price
   * @return {*}
   */
  setSpotPrice (marketIdAddress, price) {
    return this.contract.methods.setSpotPrice(marketIdAddress, price).send()
  }

  /**
   * 获取币种当前价格
   * @param marketIdAddress 币合约地址
   * @return {*}
   */
  getSpotPrice (marketIdAddress) {
    return this.contract.methods.getSpotPrice(marketIdAddress).call()
  }

  /**
   * 取消委托
   * @param marketIdAddress
   * @param orderType
   * @param side
   * @param timestamp
   * @return {*}
   */
  cancleOrderedPosition (marketIdAddress, orderType, side, timestamp) {
    return this.contract.methods.cancleOrderedPosition(marketIdAddress, orderType, side, timestamp).send()
  }
  /**
   * 取消全部委托
   * @param marketIdAddress
   * @return {*}
   */
  cancleAllOrderedPositions (marketIdAddress) {
    return this.contract.methods.cancleAllOrderedPositions(marketIdAddress).send()
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
    return this.contract.methods.getTraderOpenUpperBound(marketIdAddress, trader, openType, price, leverage).call()
  }

  /**
   * 获取持仓
   * @param trader
   * @param marketIdAddress
   * @param side
   * @return position
   size: 持仓量（精度为8位）
   leverage: 杠杆（精度为8位）
   averagePrice: 开仓均价（精度为8位）
   timestamp: 时间戳
   */
  getTraderPosition (trader, marketIdAddress, side) {
    return this.contract.methods.getTraderPosition(trader, marketIdAddress, side).call()
  }
  /**
   * 获取委托单
   * @param trader
   * @param marketIdAddress
   * @param side
   * @param stopType
   * @return {*}
   */
  getTraderOrderStopPosition (trader, marketIdAddress, side, stopType) {
    return this.contract.methods.getTraderOrderStopPosition(trader, marketIdAddress, side, stopType).call()
  }

  /**
   *
   * @param trader
   * @param marketIdAddress
   * @param side
   * @return {*}
   */
  getTraderOrderLimitPositions (trader, marketIdAddress, side) {
    return this.contract.methods.getTraderOrderLimitPositions(trader, marketIdAddress, side).call()
  }
  /**
   * 获取动仓费率
   * @param marketIdAddress
   * @return {*}
   */
  getPositionChangeFeeRatio (marketIdAddress) {
    return this.contract.methods.getPositionChangeFeeRatio(marketIdAddress).call()
  }

  /**
   * 获取系统最大开仓量
   * @param marketIdAddress
   * @param side
   * @return {*}
   */
  getSysOpenUpperBound (marketIdAddress, side) {
    return this.contract.methods.getSysOpenUpperBound(marketIdAddress, side).call()
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
    return this.contract.methods.getTraderPositionVariables(trader, marketIdAddress, side, spotPrice, size, leverage, averagePrice).call()
  }
  /**
   * 获取用户保证金信息
   * @param trader
   * @return {*}
   */
  getTraderVariables (trader) {
    return this.contract.methods.getTraderVariables(trader).call()
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
    return this.contract.methods.getTraderPositionLiquidatePrice(side, spotPrice, size, marginMaintenanceRatio, marginBalance, totalPositionAmount).call()
  }

  /**
   * 所有持仓
   * @param trader
   * @param marketIdAddress
   * @return Array<Position>
   */
  async getTraderAllPosition (trader, marketIdAddress) {
    const positionArr = []

    // 多
    positionArr.push(await this.getTraderViewPosition(trader, marketIdAddress, 0))

    // 空
    positionArr.push(await this.getTraderViewPosition(trader, marketIdAddress, 1))

    return positionArr
  }

  /**
   * 获取某种持仓
   * @param trader
   * @param marketIdAddress
   * @param side
   * @return {Promise<Position>}
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
  onDeposit (user, callback) {
    this.contract.events.Deposit({user: user}, callback)
  }
  onWithdraw (user, callback) {
    this.contract.events.Withdraw({user: user}, callback)
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
