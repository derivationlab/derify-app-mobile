<template>
  <div class="home-container page-container">
    <navbar title="数据" />
    <div class="home-top">
      <!-- K线图 -->
      <div id="myChart" :style="{width: '100%', height: '35rem'}"></div>
      <!-- K线图 -->
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar'
// 自定义主题折线图
// import theme from '@/js/themeEcharts.js'
export default {
  name: 'Home',
  components: {
    Navbar
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
        title: { text: '在Vue中使用echarts',
          link:"https://www.baidu.com/" ,
          textStyle:{},//设置标题的样式
        },
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
          name: '销量',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20]
        }]
      })
    }
    // drawLine () {
    //   // 基于准备好的dom，初始化echarts实例 参数2设置主题
    //   const myChart = this.$echarts.init(document.getElementById('myChart'), theme)
    //   // 绘制图表
    //   myChart.setOption({
    //     // title: { text: '在Vue中使用echarts',
    //     //   link:"https://www.baidu.com/" ,
    //     //   textStyle:{},//设置标题的样式
    //     // },
    //     tooltip: { // 信息提示
    //       trigger: 'item', // 触发类型
    //       // triggerOn:"click", //触发时机
    //       formatter: '{b} 交易量为{c}' // 提示格式化
    //       // formatter: function(arg){
    //       //   console.log(arg)
    //       //   return arg.seriesName
    //       // }
    //     },
    //     toolbox: { // 工具箱
    //       feature: {
    //         // saveAsImage: {},//保存图片
    //         // dataView:{}, //数据视图工具，可以展现当前图表所用的数据，编辑后可以动态更新。
    //         // restore:{}, //配置项还原
    //         // dataZoom:{},//数据区域缩放
    //         // magicType: { //动态类型切换
    //         //   type: ['line', 'bar', 'stack', 'tiled']
    //         // }
    //       }
    //     },
    //     xAxis: {
    //       type: 'category', // X轴
    //       // data: ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],
    //       data: ['1M', '2M', '3M', '4M', '5M', '6M', '7M', '8M', '9M', '10M', '11M', '12M'],
    //       boundaryGap: false
    //     },
    //     yAxis: {
    //       type: 'value', // Y轴
    //       scale: true
    //     },
    //     // legend:{
    //     //   data:["销量","name"]
    //     // },
    //     series: [ // 系列列表
    //       {
    //         name: '销量',
    //         type: 'line', // 控制图表类型
    //         barWidth: '10%',
    //         data: [8, 12, 33, 44, 5, 61, 21, 32, 40, 56, 68, 12],
    //         markPoint: { // 显示最大最小值
    //           // data:[
    //           //   {type:'max'},
    //           //   {type:'min'}
    //           // ]
    //         },
    //         markLine: {// 显示平均值
    //           // data:[
    //           //   {type:"average"}
    //           // ]
    //         },
    //         markArea: { // 标注区间
    //           // data:[
    //           //   [{
    //           //     xAxis:'2月'
    //           //   },{
    //           //     xAxis:'3月'
    //           //   }]
    //           // ]
    //         },
    //         smooth: true, // 平缓显示
    //         lineStyle: {
    //           color: '#0a5533',
    //           type: 'solid'
    //         }, // 折线样式
    //         areaStyle: {
    //           color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
    //             offset: 0,
    //             color: '#0a5533'
    //           }, {
    //             offset: 1,
    //             color: '#112023'
    //           }])
    //         }
    //       }]
    //   })
    // }
  }
}
</script>

<style lang="less" scoped>
</style>
