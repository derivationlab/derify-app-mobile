import { getKLineData } from '../api/kdata'

export function buildEchartsOptions ({categoryData = [(new Date()).Format('hh:mm')]
                                       , values = [[0,0,0,0]], curPrice = 0}) {

  return {
    darkMode: true,
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    legend: {
      data: []
    },
    grid: {
      top: '0%',
      left: '0%',
      right: '0%',
      bottom: '10%'
    },
    dataZoom: [],
    xAxis: {
      type: 'category',
      data: categoryData,
      scale: true,
      boundaryGap: false,
      axisLabel: {
        inside: false,
        margin: '10',
        color: 'rgba(255,255,255,0.3)'
      },
      axisLine: { onZero: false },
      splitLine: { show: false },
      splitNumber: 5
    },
    yAxis: {
      scale: true,
      show: true,
      splitNumber: 5,
      boundaryGap: ['0%', '0%'],
      axisLabel: {
        inside: true,
        color: 'rgba(255,255,255,0.3)',
        showMinLabel: false,
        showMaxLabel: false,
      },
      splitLine: {
        show: true,
        lineStyle:{
          color: ['rgba(255,255,255, 0.1)'],
          width: 1
        }
      },
      position: 'right'
    },
    series: [
      {
        name: 'ÈÕK',
        type: 'candlestick',
        data: values,
        itemStyle: {
          color: '#EA446B', //up color
          color0: '#00C49A', //down color
          borderColor: '#EA446B',
          borderColor0: '#00C49A'
        },
        markLine: {
          symbol: ['none', 'none'],
          show: categoryData.length > 1,
          data: [
            [
              {
                name: curPrice+'',
                coord: [0, curPrice],
                symbolSize: 10,
                label: {
                  show: categoryData.length > 1,
                  color: '#fff',
                  backgroundColor:'#EA446B',
                  position: 'end',
                  distance: -(String.valueOf(curPrice).length)*40
                },
                emphasis: {
                  label: {
                    show: false
                  }
                }
              },
              {
                name: curPrice+'',
                coord: [categoryData.length - 1, curPrice],
                symbolSize: 10,
                label: {
                  show: false
                },
                emphasis: {
                  label: {
                    show: false
                  }
                }
              }
            ]
          ]
        }
      }
    ]
  }
}

const tokenInstIdMap = {
  ETH: 'ETH-USDT',
  BTC: 'BTC-USDT',
}

function getTokenInstIdByToken(token) {
  if(tokenInstIdMap.hasOwnProperty(token)){
    return tokenInstIdMap[token]
  }

  return tokenInstIdMap.ETH
}

export default async function getEchartsOptions({token, bar, after, before, limit, curPrice}) {
  const data = await getKLineData({instId: getTokenInstIdByToken(token), bar, after, before, limit})
  return buildEchartsOptions({...splitData(data, bar), curPrice})
}

const barDateFmtMap = {
  '1m': 'hh:mm',
  '5m': 'hh:mm',
  '15m': 'hh:mm',
  '30m': 'hh:mm',
  '1H': 'hh:mm',
  '4H': 'hh:mm',
  '1D': 'MM-dd',
  '1W': 'MM-dd',
  '1M': 'yyyy-MM'
}
function splitData (rawData, bar) {
  const categoryData = []
  const values = []
  rawData.reverse()
  for (let i = 0; i < rawData.length; i++) {
    const date = new Date(parseInt(rawData[i].splice(0, 1)[0]));
    categoryData.push(date.Format(barDateFmtMap[bar]))
    values.push([rawData[i][0],rawData[i][3],rawData[i][1],rawData[i][2]])
  }
  return {
    categoryData: categoryData,
    values: values
  }
}
