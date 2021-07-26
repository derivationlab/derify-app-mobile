import * as io from "@/utils/request";
const TRADE_LIST_URL = "http://13.125.43.43:8081/api/trade_records/"
const FUND_LIST_URL = "http://13.125.43.43:8081/api/trader_balance/"
//用户债券bDRF流水明细
const TRADER_BOND_BALANCE_URL = "http://13.125.43.43:8081/api/trader_bond_balance/"
//用户持仓挖矿收益流水明细
const TRADER_PMR_BALANCE_URL = "http:13.125.43.43:8081/api/trader_pmr_balance/"
const POSITION_MININ_EVENT_URL = "//13.125.43.43:8081/api/position_mining_events/"
const TOKEN_PRICE_EVENT_URL = "//13.125.43.43:8081/api/token_price_events/"

/**
 *
 * @param trader
 * @returns {Promise<Array<TradeRecord>>}
 */
export async function getTradeList (trader) {
  //TODO mock
  // trader = "0xA0F53B952005A57260B19143708Bcd34eB6F78b6"
  const content = await io.get(TRADE_LIST_URL + trader)

  if(content) {
    return content.data;
  }

  return [];
}

/**
 *
 * @param trader
 * @returns {Promise<Array<TradeBalanceDetail>>}
 */
export async function getTradeBalanceDetail (trader) {
  const content =  await io.get(FUND_LIST_URL + trader)
  console.log(content)
  if(content) {
    return content.data;
  }

  return [];
}

export async function getTraderBondBalance (trader) {
  const content =  await io.get(TRADER_BOND_BALANCE_URL + trader)
  console.log(content)
  if(content) {
    return content.data;
  }

  return [];
}

export async function getTraderPMRBalance (trader) {
  const content =  await io.get(TRADER_BOND_BALANCE_URL + trader)
  console.log(content)
  if(content) {
    return content.data;
  }

  return [];
}

/**
 * 获取挖矿收益率
 * @param tokenAddr
 * @param callback param PositionMiningRate
 */
export function createTokenMiningFeeEvenet (tokenAddr, callback){
  const events = new EventSource(POSITION_MININ_EVENT_URL + tokenAddr);

  events.onmessage = (event) => {
    const parsedData = JSON.parse(event.data)
    callback(tokenAddr, parsedData)
  }

  return events
}

/**
 * 获取币种涨幅
 * @param tokenKey
 * @param callback tokenKey,涨幅
 * @return {EventSource}
 */
export function createTokenPriceChangeEvenet (tokenKey, callback){

  const events = new EventSource(TOKEN_PRICE_EVENT_URL + tokenKey);

  events.onmessage = (event) => {
    const parsedData = JSON.parse(event.data)
    callback(tokenKey, parsedData)
  }

  return events
}


/**
 * 交易记录
 */
export class TradeRecord {
  id;// uuid
  tx;// 智能合约事件transactionHash
  user;// 用户账户地址
  token;// 交易对币种地址
  /*
    0-MarketPriceTrade, 市价委托 & 开仓
    1-HedgeMarketPriceTrade, 市价委托(通过对冲开仓) & 开仓
    2-LimitPriceTrade, 限价委托 & 开仓
    3-StopProfitStopLossTrade, 止盈止损 & 平仓
    4-AutoDeleveragingTrade, 自动减仓 & 平仓
    5-MandatoryLiquidationTrade, 自动平仓 & 平仓
  */
  type;
  side; // 0-LONG-做多，1-SHORT-做空
  size; // 成交数量
  price; // 成交价格
  amount; // 成交金额（成交价格*成交数量）
  trading_fee; // 手续费
  position_change_fee; // 动仓费
  pnl_usdt; //盈亏(USDT计价单位)
  pnl_bond //分摊补偿（bDRF计价单位）
  event_time;// 智能合约事件时间（UTC）
  update_time;// 更新后端数据库时间（UTC）
}

export class TradeBalanceDetail {
  id;// uuid
  tx;// 智能合约事件transactionHash
  user;// 用户账户地址
  amount;// 每次进出的数值，进为正，出为负
  balance;// 变动后的余额
  /*
  0-TradingFee, 手续费
  1-PositionChangeFee, 动仓费
  2-ProfitAndLoss, 盈亏（根据amount正负判断盈/亏）
  3-ProfitAndLossAuto, 盈亏（自动减仓和强制平仓时的盈亏）
  4-GasFee, gas费
  5-Liquidation，清算费用
  6-SysCompensation, 系统补偿
  7-SysLossApportionment, 系统亏损分摊
  100-Deposit, 资金转入
  101-Withdraw, 资金转出
  */
  fee_type;
  event_time;// 智能合约事件时间（UTC）
  update_time;// 更新后端数据库时间（UTC）
}


export class PositionMiningRate {
  longPmrRate; //该交易对做多方向持仓挖矿收益率（为小数值，前端按百分比显示需*100）
  shortPmrRate; //该交易对做空方向持仓挖矿收益率（为小数值，前端按百分比显示需*100）
}

/**
 * bDRF收益明细
 */
export class TraderBondBalance {
  id;//uuid
  tx;//智能合约事件transactionHash
  user;//用户账户地址
  amount;//每次进出的数值，进为正，出为负
  balance;//变动后的余额
  /**
   0-Income, 收入（增发）
   1-Withdraw, 提取
   2-Exchange, 兑换
   3-TransferFromBank, 存入（收益计划）
   4-TransferToBank, 赎回（收益计划）
   5-Interest, 收入（利息）
   */
  bond_update_type;
  event_time;//智能合约事件时间（UTC）
  update_time;//更新后端数据库时间（UTC）
}

/**
 * 持仓挖矿收益明细
 */
export class TradePMRBalance {
  id; //uuid
  tx;//智能合约事件transactionHash
  user;//用户账户地址
  amount;//每次进出的数值，进为正，出为负
  balance;//变动后的余额
  /**
   0-Income, 收入
   1-Withdraw, 提取
   */
  pmr_update_type;

  event_time;//智能合约事件时间（UTC）

  update_time;//更新后端数据库时间（UTC）
}
