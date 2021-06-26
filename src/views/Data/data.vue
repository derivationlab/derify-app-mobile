<template>
  <div class="home-container page-container">
    <navbar title="数据" />
    <div class="home-top">
      <div class="classify-div">
        <div class="div1">
          <span class="ify-span"><span class="colory"></span> 交易量（24h）</span>
          <div class="ify-div">
            <span class="num">123456780.12</span>
            <span class="unit">USDT</span>
          </div>
        </div>
        <div class="div1">
          <span class="ify-span"><span class="colorb"></span>手续费收入（24h）</span>
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

export default {
  name: 'Home',
  components: {
    Navbar,
    record
    // theme
  },
  data () {
    return {
      show: false
    }
  },
  mounted () {
    this.drawLine()
  },
  methods: {
    drawLine () {
      // 基于准备好的dom，初始化echarts实例
      const myChart = this.$echarts.init(document.getElementById('myChart'))
      // 绘制图表
      myChart.setOption({
        // title: { text: '在Vue中使用echarts' },
        // link:"https://www.baidu.com/" ,
        // textStyle:{},//设置标题的样式
        tooltip: { // 信息提示
          trigger: 'item', // 触发类型
          // triggerOn:"click", //触发时机
          formatter: '{b} 交易量为{c}' // 提示格式化
          // formatter: function(arg){
          //   console.log(arg)
          //   return arg.seriesName
          // }
        },
        xAxis: {
          type: 'category', // X轴
          // data: ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],
          data: ['1M', '2M', '3M', '4M', '5M', '6M', '7M', '8M', '9M', '10M', '11M', '12M'],
          boundaryGap: false
        },
        yAxis: {
          type: 'value', // Y轴
          scale: true
        },
        series: [{
          name: '',
          type: 'line',
          barWidth: '10%',
          data: [8, 12, 13, 14, 15, 16, 12, 13, 14, 16, 18, 12],
          // smooth: true, // 平缓显示
          lineStyle: {
            color: '#0a5533',
            type: 'solid'
          }, // 折线样式
          areaStyle: {
            color: {
              colorStops: [{
                offset: 0, color: '#0a5533' // 0% 处的颜色
              }, {
                offset: 1, color: '#FAE247' // 100% 处的颜色
              }]
              // global: false // 缺省为 false
            }
          }
          // areaStyle: {
          //   color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
          //     offset: 0,
          //     color: '#0a5533'
          //   }, {
          //     offset: 1,
          //     color: '#112023'
          //   }])
          // }
        }]
      })
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
