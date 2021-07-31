import * as io from "@/utils/request";
const TRADE_LIST_URL = "http://13.125.43.43:8081/api/trade_records/"
const FUND_LIST_URL = "http://13.125.43.43:8081/api/trader_balance/"

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

