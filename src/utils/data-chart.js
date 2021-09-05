/**
 * generateDataEchartsOptions
 * @param {array} colors
 * @param {array} xaxisDta
 * @param {stack: string, data:array}seriesData
 * @return {{yAxis: [{type: string}], xAxis: [{data, type: string, boundaryGap: boolean}], color, grid: {left: string, bottom: string, right: string, containLabel: boolean}, series: *[], tooltip: {axisPointer: {label: {backgroundColor: string}, type: string}, trigger: string}, toolbox: {feature: {saveAsImage: {}}}}}
 */
export default function generateDataEchartsOptions(colors, xaxisDta, seriesData) {

  const seriers = [];
  seriesData.forEach((data, index) => {
    seriers.push({
      name: 'Line 1',
      type: 'line',
      stack: data.stack,
      smooth: false,
      lineStyle: {
        width: 0
      },
      showSymbol: false,
      areaStyle: {
        opacity: 0.8,
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
          offset: 0,
          color: 'rgba(128, 255, 165)'
        }, {
          offset: 1,
          color: 'rgba(1, 191, 236)'
        }])
      },
      emphasis: {
        focus: 'series'
      },
      data: data.data
    })
  })

  return {
    color: colors,
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },

    toolbox: {
      feature: {
        saveAsImage: {}
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: xaxisDta
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: seriers
  }
}
