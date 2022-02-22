<template>
  <el-dialog
    title="提示"
    :visible.sync="dialogVisible"
    width="1000px"
    height="1000px"
    @open="open()"
    :before-close="handleClose">
    <div slot="title" class="header-title">
      <span>{{ cityname }}省的城市信息</span>
    </div>
    <div style="display:flex">
      <div ref="pieChart" style="width: 550px; height: 350px;"></div>
      <div id="zhuChart"  style="width: 550px; height: 350px;"></div>
    </div>
    <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  </span>
  </el-dialog>
</template>

<script>
  export default {
    name: 'cakeAndzhu',
    props:{
      cityname:String,
    },
    data(){
      return{
        dialogVisible:false,
        chartInstance: null,
        option1: {},

        /*折线图图表格*/
        option2:{
          title: {
            text: 'Top5城市活跃度柱状图',
            subtext: '',
            left: 'center'
          },
          xAxis: {
            type: 'category',
            data: [],/*'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'*/
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            data: [],/*120, 200, 150, 80, 70, 110, 130*/
            type: 'bar',
            showBackground: true,
            backgroundStyle: {
              color: 'rgba(180, 180, 180, 0.2)'
            }
          }]
        },

        //饼图的数据源
        data1 : [],
      }
    },
    methods: {

      open() {
        this.$nextTick(() => {
          this.option2.xAxis.data=[]
          this.option2.series[0].data=[]
          this.data1=JSON.parse(window.localStorage.getItem("cake"));
          var zhuzhuangtu=JSON.parse(window.localStorage.getItem("zhu"));
          console.log(zhuzhuangtu.length)
          for(var i=0;i<zhuzhuangtu.length;i++){
            console.log(zhuzhuangtu.name);
            this.option2.xAxis.data.push(zhuzhuangtu[i].name);
            this.option2.series[0].data.push(zhuzhuangtu[i].value);
          }
          this.initPieChart()
          this.updatePieChart()
          this.drawMap()
          window.addEventListener('resize', this.handleResize)
        })
      },

      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            this.data1=[];
            done();
          })
          .catch(_ => {});
      },

      show(visible = true) {
        this.dialogVisible = visible
      },

      initPieChart () {
        this.chartInstance = this.$echarts.init(this.$refs.pieChart)
      },
      updatePieChart () {
        this.option1 = {
          title: {
            text: '各市活跃度饼图',
            subtext: '',
            left: 'center'
          },
          tooltip: {
            trigger: 'item'
          },
          legend: {
            orient: 'vertical',
            left: 'left',
          },
          series: [
            {
              name: '访问来源',
              type: 'pie',
              radius: '50%',
              data: this.data1,
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        }
        this.chartInstance.setOption(this.option1)
      },

      //构建柱状图
      drawMap() {
        var chinaChart = this.$echarts.init(
          document.getElementById("zhuChart")
        );
        chinaChart.setOption(this.option2);
      }
    },


  };

</script>

<style>


</style>
