<template v-if="show">
  <div class="home-container page-container">
    <navbar :title="$t('data.Data')" />
    <div class="home-top">
      <div class="classify-div">
        <div class="div1">
          <span class="ify-span"><span class="colory"></span> {{$t('data.TradingVolume')}}（24h）</span>
          <div class="ify-div">
            <span class="num">123456780.12</span>
            <span class="unit">USDT</span>
          </div>
        </div>
        <div class="div1">
          <span class="ify-span"><span class="colorb"></span>{{$t('data.TradFeeEarning')}}（24h）</span>
          <div class="ify-div">
            <span>123456780.12</span>
            <span>USDT</span>
          </div>
        </div>
      </div>
      <!-- K线图 -->
      <div id="myChart" :style="{width: '100%', height: '36.5rem'}"></div>
      <!-- K线图 -->
      <div style="font-weight: 700;color: rgba(255,255,255,0.85);font-size: 1.7rem;margin:2rem 0">交易记录</div>
      <record></record>
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar'
import record from './record/index.vue'
import {options,data0} from '@/utils/kExample'

window.data0 = data0;
const context = {};
export default {
  name: 'Home',
  components: {
    Navbar,
    record
    // theme
  },
  data () {
    return {
      show: true
    }
  },
  mounted () {
    this.drawLine()
  },
  methods: {
    drawLine () {
      if(!this.show){
        return
      }
      // Based on the prepared dom, initialize the echarts instance
      if(!context.myChart) {
        context.myChart = this.$echarts.init(document.getElementById('myChart'))
      }

      // Draw a chart
      context.myChart.setOption({
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
          left: '10%',
          right: '10%',
          bottom: '15%'
        },
        xAxis: {
          type: 'category',
          data: data0.categoryData,
          scale: true,
          boundaryGap: false,
          axisLine: { onZero: false },
          splitLine: { show: false },
          splitNumber: 20
          //min: 'dataMin',
          //max: 'dataMax'
        },
        yAxis: {
          scale: true,
          splitArea: {
            show: true
          }
        },
        dataZoom: [
          // {
          //   type: 'inside',
          //   start: 50,
          //   end: 100
          // },
          // {
          //   show: true,
          //   type: 'slider',
          //   top: '90%',
          //   start: 50,
          //   end: 100
          // }
        ],
        series: [
          {
            name: '日K',
            type: 'candlestick',
            data: data0.values,
            markPoint: {
              label: {
                normal: {
                  formatter: function (param) {
                    return param != null ? Math.round(param.value) : ''
                  }
                }
              },
              tooltip: {
                formatter: function (param) {
                  return param.name + '<br>' + (param.data.coord || '')
                }
              }
            }
          }
        ]
      })
      context.myChart.resize()
    }
  }
}
</script>

<style lang="less" scoped>
.classify-div{
  display: flex;
  margin: 2rem 0;
  .div1{
    flex: 1;
    margin-left: 1rem;
    .ify-span{
      font-size: 1.2rem;
      font-weight: 400;
      color: rgba(255,255,255,0.65);
      .colory ,.colorb{
        display: inline-block;
        width: .8rem;
        height: .8rem;
        border-radius: 50%;
        background-color: #fae247;
        margin-left: -1rem;
        margin-right: .5rem;
      }
      .colorb{
        background-color: #475FFA;
      }
    }
    .ify-div{
      margin-top: .9rem;
      .num{
        font-size: 1.5rem;
        font-weight: 500;
        color: rgba(255,255,255,0.85);
      }
      .unit{
        font-size: 1.2rem;
        font-weight: 400;
        color: rgba(255,255,255,0.45);
      }
    }
  }
}
</style>
