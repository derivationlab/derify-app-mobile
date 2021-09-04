import * as io from "@/utils/request";
import * as configUtil from '../config'
const serverEndPoint = configUtil.getCurrentServerEndPoint()

/**
 * get trader's brokerId
 * @param trader
 * @return {Promise<String>} brokerId
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
 * bind broker code
 * @param trader
 * @param brokerId
 * @return {Promise<{msg: string, success: boolean}>}
 */
export async function bindBroker({trader,brokerId}) {
  const content =  await io.post('/api/bind_broker', {brokerId,trader})

  if(content && content.msg) {
    return {success: true, msg: content.msg}
  }else if(content && content.error){
    return {success: false, msg: content.error}
  }

  return {success: false, msg: 'unknown'};
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
