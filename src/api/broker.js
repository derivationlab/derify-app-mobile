import * as io from "@/utils/request";
import * as configUtil from '../config'
const serverEndPoint = configUtil.getCurrentServerEndPoint()

/**
 * get trader's brokerId
 * @param trader
 * @return {String} brokerId
 */
export async function getBrokerIdByTrader(trader) {
  const content =  await io.get("/api/brokerId_of_trader/" + trader)
  if(content && content.data && content.data.length > 0) {
    return content.data[0].brokerId;
  }

  return null;
}

export async function getBrokerList(page = 0, size = 10) {
  const content =  await io.get(`/api/brokers_list/${page}/${size}`)
  if(content && content.data) {
    return content.data.records;
  }

  return [];
}

/**
 * brokerInfo
 */
class BrokerInfo {

  /**
   * invite code
   */
  id;
  /**
   * brokerAccount
   */
  broker;
  name;
  logo;
  update_time;
}
