import * as io from "@/utils/request";
const TRADE_LIST_URL = "http://13.125.43.43:8081/api/trade_records/"
const FUND_LIST_URL = "http://13.125.43.43:8081/api/trader_balance/"
const POSITION_MININ_EVENT_URL = "//13.125.43.43:8081/api/position_mining_events/"
const TOKEN_PRICE_EVENT_URL = "//13.125.43.43:8081/api/token_price_events/"

/**
 *
 * @param trader
 * @returns {Promise<Array<TradeRecord>>}
 */
export async function getTradeList (trader) {
  //TODO mock
  trader = "0xA0F53B952005A57260B19143708Bcd34eB6F78b6"
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
  //TODO mock
  trader = "0xA0F53B952005A57260B19143708Bcd34eB6F78b6"

  const content =  await io.get(FUND_LIST_URL + trader)
  console.log(content)
  if(content) {
    return content.data;
  }

  return [];
}

/**
 * ��ȡ�ڿ�������
 * @param tokenAddr
 * @param callback param PositionMiningRate
 */
export function createTokenMiningFeeEvenet (tokenAddr, callback){

  //TODO mock
  tokenAddr = '0xF3A6679B266899042276804930B3bFBaf807F15b'

  const events = new EventSource(POSITION_MININ_EVENT_URL + tokenAddr);

  events.onmessage = (event) => {
    const parsedData = JSON.parse(event.data)
    callback(tokenAddr, parsedData)
  }

  return events
}

/**
 * ��ȡ�����Ƿ�
 * @param tokenKey
 * @param callback tokenKey,�Ƿ�
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
 * ���׼�¼
 */
export class TradeRecord {
  id;// uuid
  tx;// ���ܺ�Լ�¼�transactionHash
  user;// �û��˻���ַ
  token;// ���׶Ա��ֵ�ַ
  /*
    0-MarketPriceTrade, �м�ί�� & ����
    1-HedgeMarketPriceTrade, �м�ί��(ͨ���Գ忪��) & ����
    2-LimitPriceTrade, �޼�ί�� & ����
    3-StopProfitStopLossTrade, ֹӯֹ�� & ƽ��
    4-AutoDeleveragingTrade, �Զ����� & ƽ��
    5-MandatoryLiquidationTrade, �Զ�ƽ�� & ƽ��
  */
  type;
  side; // 0-LONG-���࣬1-SHORT-����
  size; // �ɽ�����
  price; // �ɽ��۸�
  amount; // �ɽ����ɽ��۸�*�ɽ�������
  trading_fee; // ������
  position_change_fee; // ���ַ�
  pnl_usdt; //ӯ��(USDT�Ƽ۵�λ)
  pnl_bond //��̯������bDRF�Ƽ۵�λ��
  event_time;// ���ܺ�Լ�¼�ʱ�䣨UTC��
  update_time;// ���º�����ݿ�ʱ�䣨UTC��
}

export class TradeBalanceDetail {
  id;// uuid
  tx;// ���ܺ�Լ�¼�transactionHash
  user;// �û��˻���ַ
  amount;// ÿ�ν�������ֵ����Ϊ������Ϊ��
  balance;// �䶯������
  /*
  0-TradingFee, ������
  1-PositionChangeFee, ���ַ�
  2-ProfitAndLoss, ӯ��������amount�����ж�ӯ/����
  3-ProfitAndLossAuto, ӯ�����Զ����ֺ�ǿ��ƽ��ʱ��ӯ����
  4-GasFee, gas��
  5-Liquidation���������
  6-SysCompensation, ϵͳ����
  7-SysLossApportionment, ϵͳ�����̯
  100-Deposit, �ʽ�ת��
  101-Withdraw, �ʽ�ת��
  */
  fee_type;
  event_time;// ���ܺ�Լ�¼�ʱ�䣨UTC��
  update_time;// ���º�����ݿ�ʱ�䣨UTC��
}


export class PositionMiningRate {
  longPmrRate; //�ý��׶����෽��ֲ��ڿ������ʣ�ΪС��ֵ��ǰ�˰��ٷֱ���ʾ��*100��
  shortPmrRate; //�ý��׶����շ���ֲ��ڿ������ʣ�ΪС��ֵ��ǰ�˰��ٷֱ���ʾ��*100��
}
