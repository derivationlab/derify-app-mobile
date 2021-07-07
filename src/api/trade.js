import * as io from "@/utils/request";
const TRADE_LIST_URL = "http://app.derify.finance/api/trade_list"

/**
 *
 * @param trader
 * @returns {Promise<Array<TradeRecord>>}
 */
export async function getTradeList (trader) {
  return io.post(TRADE_LIST_URL, {user: trader})
}

/**
 * 交易记录
 */
export class TradeRecord {
  token;// 合约对
  side;// LONG-做多，SHORT-做空
  realizedPnl;//盈亏
  actionType;// OPEN-开仓，CLOSE-平仓
  tradeType;// MarketPriceTrade-市价委托, LimitPriceTrade-限价委托, StopProfitStopLossTrade-止盈止损, AutoReduceTrade-自动减仓, AutoCloseTrade-自动平仓
  price;// 成交价格
  size;// 成交数量
  amount;// 成交金额（成交价格*成交数量）
  tradingFee;// 手续费
  positionChangeFee;// 动仓费
  shareCompensation;// 分摊补偿
  timestamp;// 成交时间
}
