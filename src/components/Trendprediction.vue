<template>
  <!--为echarts准备一个具备大小的容器dom-->
  <div>
    <h1 class="title">趋势预测分析图</h1>
    <div id='main'></div>
  </div>
</template>
<script>
  import echarts from 'echarts'
  import axios from 'axios'
  export default {
    name: 'trendprediction',
    data() {
      return {
        charts: '',
        /*  opinion: ["1", "3", "3", "4", "5"],"55", "35", "35", "45", "55"*/
        opinionData:[],
        opinionData1:[]
      }
    },
    methods: {
      getpassdata(){
        self=this
        axios.get("http://10.11.37.68:8081/data_list/passDay").then(res=>{
          var length=res.data.data.passDays.length
          var list=[]
          for(var i=length-1;i>=0;i--){
            console.log(res.data.data.passDays[i].value)
            list.push(res.data.data.passDays[i].value.toString())
          }
          console.log(list)

          window.localStorage.setItem('passDays',list)

          /*   self.opinionData=res.data. */
        })
        /*   console.log("1111111"+window.localStorage.getItem('passDays')) */
        self.opinionData=window.localStorage.getItem('passDays').split(',');
        //    console.log(self.opinionData)
      },
      getfuturedata(){
        self=this
        axios.get("http://10.11.37.68:8081/data_list/futureData").then(res=>{
          var length=res.data.data.futureDatas.length
          var list=[]
          for(var i=length-1;i>=0;i--){
            console.log(res.data.data.futureDatas[i].value)
            list.push(res.data.data.futureDatas[i].value.toString())
          }
          console.log(list)

          window.localStorage.setItem('futureDays',list)

          /*   self.opinionData=res.data. */
        })
        /*   console.log("1111111"+window.localStorage.getItem('passDays')) */
        self.opinionData1=window.localStorage.getItem('futureDays').split(',');
        //    console.log(self.opinionData)
      },
      drawLine(id) {
        this.charts = echarts.init(document.getElementById(id))
        this.charts.setOption({
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: ['过去15天活跃度']
              ['未来15天活跃度']
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },

          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15"],

          },
          yAxis: {
            type: 'value'
          },

          series: [{
            name: '过去15天活跃度',
            type: 'line',
            stack: '总量',
            data: this.opinionData
          },
            {
              name: '未来15天活跃度',
              type: 'line',
              stack1: '总量',
              data: this.opinionData1
            }]
        })
      }
    },
    //调用
    mounted() {

      this.$nextTick(function() {
        this.drawLine('main')
      })

      this.getpassdata()
      this.getfuturedata()
    }
  }
</script>
<style scoped>
  * {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .title{
    text-align: center;
    margin-top: 30px;
    font-size: 150%;
  }
  #main{
    width: 1200px;height: 500px; margin-top:40px
  }
</style>
