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
 * ���׼�¼
 */
export class TradeRecord {
  token;// ��Լ��
  side;// LONG-���࣬SHORT-����
  realizedPnl;//ӯ��
  actionType;// OPEN-���֣�CLOSE-ƽ��
  tradeType;// MarketPriceTrade-�м�ί��, LimitPriceTrade-�޼�ί��, StopProfitStopLossTrade-ֹӯֹ��, AutoReduceTrade-�Զ�����, AutoCloseTrade-�Զ�ƽ��
  price;// �ɽ��۸�
  size;// �ɽ�����
  amount;// �ɽ����ɽ��۸�*�ɽ�������
  tradingFee;// ������
  positionChangeFee;// ���ַ�
  shareCompensation;// ��̯����
  timestamp;// �ɽ�ʱ��
}
