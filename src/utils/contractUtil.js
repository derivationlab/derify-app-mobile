/**
 *
 * @param abi
 * @param address
 * @param option {
 *     from: '',
 *     gasPrice: '20000000000'
 * }
 * @constructor
 */
function Contract(abi, address, option) {
  let web3 = new Web3();
  let provider = window.ethereum;
  web3.setProvider(provider);

  this.web3 = web3;
  this.contract = new web3.eth.Contract(abi, address, Object.assign({gasPrice: '20000000000'}, option));
}


Contract.prototype = {
  /**
   * 充值金额
   * @param amount
   * @return
   */
  deposit: function (amount) {
    return this.contract.methods.deposit(amount).send();
  },
  /**
   * 提现
   * @param amount
   * @returns {*}
   */
  withdraw: function (amount) {
    return this.contract.methods.withdraw(amount).send();
  },
  /**
   * 开仓
   * @param token 当前合约币种地址
   * @param trader 用户账户地址
   * @param side LONG-做多，SHORT-做空，HEDGE-对冲
   * @param openType MarketOrder-市价委托，LimitOrder-限价委托
   * @param size 开仓量（按币种计价）
   * @param price 开仓价（精度为8位）
   * @param leverage 杠杆（精度为8位）
   * @param estimateGasFee
   * @return {*}
   */
  openPosition: function (token, trader, side, openType, size, price, leverage, estimateGasFee) {
    return this.contract.methods.openPosition(token, side, openType, size, price, leverage)
      .send();
  },

  /**
   * 设置止盈止损委托
   * @param token
   * @param trader
   * @param side
   * @param stopType
   * @param stopPrice
   * @return {*}
   */
  orderStopPosition: function (token, side, stopType, stopPrice) {

    return this.contract.methods.orderStopPosition(token, side, stopType, stopPrice)
      .send();
  },
  /**
   * 平仓
   * @param trader 用户账户地址
   * @param token 当前合约币种地址
   * @param side LONG-做多，SHORT-做空，HEDGE-对冲
   * @param size 仓量
   * @return {*}
   */
  closePosition: function(token, side, size){
    return this.contract.methods.closePosition(token, side, size)
      .send();
  },
  /**
   * 一键平仓
   * @param trader 平仓账户
   */
  closeAllPositions: function(trader){
    return this.contract.methods.closeAllPositions(trader)
      .send();
  },
  /**
   * 获取账户信息
   * @param trader
   * @return {*}
   */
  getTraderAccount: function (trader) {
    return this.contract.methods.getTraderAccount(trader).call();
  },
  /**
   * 设置币种的当前价格
   * @param marketIdAddress  币合约地址
   * @param price
   * @return {*}
   */
  setSpotPrice: function (marketIdAddress, price) {
    return this.contract.methods.setSpotPrice(marketIdAddress, price).send();
  },

  /**
   * 获取币种当前价格
   * @param marketIdAddress 币合约地址
   * @return {*}
   */
  getSpotPrice: function (marketIdAddress) {
    return this.contract.methods.getSpotPrice(marketIdAddress).call();
  },

  /**
   * 取消委托
   * @param marketIdAddress
   * @param orderType
   * @param side
   * @param timestamp
   * @return {*}
   */
  cancleOrderedPosition: function(marketIdAddress, orderType, side, timestamp){
    return this.contract.methods.cancleOrderedPosition(marketIdAddress, orderType, side, timestamp).send();
  },
  /**
   * 取消全部委托
   * @param marketIdAddress
   * @return {*}
   */
  cancleAllOrderedPositions: function(marketIdAddress){
    return this.contract.methods.cancleAllOrderedPositions(marketIdAddress).send();
  },
  /**
   * 获取用户最大开仓量
   * @param marketIdAddress
   * @param trader
   * @param openType
   * @param price
   * @param leverage
   * @return {*}
   */
  getTraderOpenUpperBound: function(marketIdAddress, trader, openType, price, leverage){
    return this.contract.methods.getTraderOpenUpperBound(marketIdAddress, trader, openType, price, leverage).call();
  },

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
  getTraderPosition: function (trader, marketIdAddress, side) {
    return this.contract.methods.getTraderPosition(trader, marketIdAddress, side).call();
  },
  /**
   * 获取委托单
   * @param trader
   * @param marketIdAddress
   * @param side
   * @param stopType
   * @return {*}
   */
  getTraderOrderStopPosition: function (trader, marketIdAddress, side, stopType) {
    return this.contract.methods.getTraderOrderStopPosition(trader, marketIdAddress, side, stopType).call();
  },

  /**
   *
   * @param trader
   * @param marketIdAddress
   * @param side
   * @return {*}
   */
  getTraderOrderLimitPositions: function(trader, marketIdAddress, side) {
    return this.contract.methods.getTraderOrderLimitPositions(trader, marketIdAddress, side).call();
  },

  /**
   * 获取动仓费率
   * @param marketIdAddress
   * @return {*}
   */
  getPositionChangeFeeRatio: function(marketIdAddress){
    return this.contract.methods.getPositionChangeFeeRatio(marketIdAddress).call();
  },

  /**
   * 获取系统最大开仓量
   * @param marketIdAddress
   * @param side
   * @return {*}
   */
  getSysOpenUpperBound: function(marketIdAddress, side){
    return this.contract.methods.getSysOpenUpperBound(marketIdAddress).call();
  }
}

export default Contract;
