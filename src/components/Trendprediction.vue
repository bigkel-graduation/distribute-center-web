<template>
  <!--为echarts准备一个具备大小的容器dom-->
  <div class="back-box">
    <div class="top-bar">
      <el-input placeholder="请输入内容" v-model="key" class="select">
      </el-input>
      <el-cascader
        v-model="casValue"
        :options="casList"
        :props="casProps"
        style="margin-left:8px; margin-top: -1px"
        @change="handleChange"
        clearable
      >
      </el-cascader>
      <el-button
        class="search-button"
        icon="el-icon-search"
        @click="select()"
        type="primary"
        plain
        >搜索</el-button
      >
    </div>
    <div class="side">
      <div class="side-cake" id="cake"></div>
      <div class="side-line" id="line"></div>
    </div>
    <div class="center">
      <div class="center-left" id="left"></div>
      <div class="center-right" id="right"></div>
    </div>
  </div>
</template>
<script>
import * as echarts from "echarts";
import trendManageApi from "../request/trendManageApi.js";
export default {
  name: "trendprediction",
  data() {
    return {
      key: null, // 输入框输入的参数
      cakeData: [], // 饼状图数据
      lineData: [], // 折线图数据   折线图和饼图都是服务类型趋势
      nameTrendBar: [], // 服务名称趋势信息柱状图
      nameTrendCake: [], // 服务名称饼状图
      trendTitle: null, // 服务柱状图和饼状图的标题
      casList: [], // 级联选择器列表
      casValue: [], // 级联选择器数组
      casProps: {
        // 级联选择器显示成员  父和子要有相同的属性id，这样才能选中
        expandTrigger: "hover",
        value: "id",
        label: "name",
        children: "childList"
      }
    };
  },
  created() {
    this.getSideCakeData();
    this.getSideLineData();
    this.getCenterBarData(this.key);
    this.getCenterCakeData(this.key);
    this.getCasList();
  },

  methods: {
    getCasList() {
      trendManageApi.getCasList().then(response => {
        this.casList = response.data.list;
      });
    },
    // 级联选择后自动调接口查询数据
    handleChange(val) {
      console.log("val", val);
      if (val.length != 0) {
        trendManageApi.getTrendByCas(this.casValue[1]).then(response => {
          // 把名称给key，此时就相当与搜索框搜索key
          this.key = response.data.modelName;
          this.getCenterBarData(this.key);
          this.getCenterCakeData(this.key);
        });
      }
    },
    select() {
      this.casValue = [];
      this.getCenterBarData(this.key);
      this.getCenterCakeData(this.key);
    },
    getSideCakeData() {
      trendManageApi.getTrendByType().then(response => {
        let trend = response.data.trend;
        for (var i = 0; i < trend.length; i++) {
          let data = {};
          data.name = trend[i].modelType;
          data.value = trend[i].count;
          this.cakeData.push(data);
        }
        this.$nextTick(() => {
          this.sideCake();
        });
      });
    },

    getSideLineData() {
      trendManageApi.getTrendByType().then(response => {
        let trend = response.data.trend;
        for (var i = 0; i < trend.length; i++) {
          let seriesData = {};
          seriesData.name = trend[i].modelType;
          seriesData.data = trend[i].countTrend.split(",");
          seriesData.type = "line";
          this.lineData.push(seriesData);
        }
        this.$nextTick(() => {
          this.sideLine();
        });
      });
    },

    getCenterBarData(flag) {
      this.nameTrendBar = [];
      trendManageApi.getTrendByName(flag).then(response => {
        let trend = response.data.trend;
        this.trendTitle = trend.modelType + "->" + trend.modelName;
        console.log("title", this.trendTitle);
        let seriesData = {};
        seriesData.data = trend.countTrend.split(",");
        seriesData.type = "bar";
        this.nameTrendBar.push(seriesData);
        this.$nextTick(() => {
          this.centerBar();
        });
      });
    },

    getCenterCakeData(flag) {
      this.nameTrendCake = [];
      trendManageApi.getTrendByNameCompare(flag).then(response => {
        let trend = response.data.trend;
        for (var i = 0; i < trend.length; i++) {
          let data = {};
          data.name = trend[i].modelName;
          data.value = trend[i].count;
          this.nameTrendCake.push(data);
        }
        this.$nextTick(() => {
          this.centerCake();
        });
      });
    },

    sideCake() {
      var chartDom = document.getElementById("cake");
      var myChart = echarts.init(chartDom);
      var option;
      option = {
        tooltip: {
          trigger: "item" // 移动到饼图上的提示  item为series中的data(name:value)
        },

        // 配置饼图旁边的图例
        legend: {
          top: "11%", // 离顶高度
          right: "5%", // 位置
          orient: "horization" // 垂直排列(不加这个就是默认的顶部水平排列)
        },
        series: [
          {
            name: "访问次数", // 移动到饼图上提示的名称
            type: "pie", // 饼图类型
            radius: ["40%", "75%"], // [饼图中心空白半径    饼图半径]
            center: [123, 130], // 饼图位置
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: "#fff",
              borderWidth: 2 // 饼图每段间隔的距离
            },
            label: {
              // 饼图中间显示的字样
              show: false, // true为所有字样一直显示在中间，false为不一直显示
              position: "center" // 居中显示
            },
            emphasis: {
              label: {
                show: true, // 鼠标移动上去显示，false为不显示
                fontSize: "20", // 字样显示大小
                fontWeight: "bold" // 字样是否加粗
              }
            },
            labelLine: {
              show: false // 引导线
            },
            data: this.cakeData
          }
        ]
      };
      option && myChart.setOption(option);
    },

    sideLine() {
      var chartDom = document.getElementById("line");
      var myChart = echarts.init(chartDom);
      var option;

      option = {
        // 线段指示(图例)
        legend: {
          top: "6%" // 离顶高度
        },
        tooltip: {
          trigger: "axis"
        },
        grid: {
          left: "1%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },

        xAxis: {
          type: "category",
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        },
        yAxis: {
          type: "value"
        },
        series: this.lineData
      };
      option && myChart.setOption(option);
    },

    centerBar() {
      var chartDom = document.getElementById("left");
      var myChart = echarts.init(chartDom);
      var option;

      option = {
        title: [
          {
            text: "当前服务一星期访问数量",
            subtext: this.trendTitle,
            left: "center",
            top: "3%"
          }
        ],
        grid: {
          left: "2%",
          right: "4%",
          bottom: "3%",
          top: "15%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        },
        yAxis: {
          type: "value",
          padding: [20, 20, 20, 15]
        },
        series: this.nameTrendBar
      };
      option && myChart.setOption(option);
    },

    centerCake() {
      var chartDom = document.getElementById("right");
      var myChart = echarts.init(chartDom);
      var option;

      option = {
        title: {
          text: "当前服务与同类型服务的比较",
          subtext: this.trendTitle,
          left: "center",
          top: "3%"
        },
        tooltip: {
          trigger: "item"
        },
        // 配置饼图旁边的图例
        legend: {
          top: "13%", // 离顶高度
          left: "5%", // 位置
          orient: "horization" // 垂直排列(不加这个就是默认的顶部水平排列)
        },
        series: [
          {
            name: "访问次数",
            type: "pie",
            radius: "50%",
            center: [225, 300], // 饼图位置
            data: this.nameTrendCake,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      };

      option && myChart.setOption(option);
    }
  }
};
</script>
<style scoped>
.back-box {
  width: 100%;
  height: 612px;
  border-radius: 5px;
  display: flex;
  flex-wrap: wrap;
}
.top-bar {
  width: 100%;
  height: 6%;
  border-radius: 5px;
  background-color: whitesmoke;
  display: flex;
}
.side-cake {
  width: 100%;
  height: 49%;
  border-radius: 5px;
  background-color: rgb(255, 255, 255);
}
.side-line {
  margin-top: 12px;
  width: 100%;
  height: 50%;
  border-radius: 5px;
  background-color: white;
}
.side {
  width: 29%;
  height: 90%;
  border-radius: 5px;
  background-color: whitesmoke;
  margin-top: 7px;
}
.center {
  margin-left: 1%;
  margin-top: 7px;
  width: 70%;
  height: 557px;
  border-radius: 5px;
  background-color: whitesmoke;
  display: flex;
}
.center-left {
  height: 100%;
  width: 470px;
  border-radius: 5px;
  background-color: white;
}
.center-right {
  margin-left: 10px;
  height: 100%;
  width: 470px;
  border-radius: 5px;
  background-color: white;
}
.select {
  width: 100%;
}
.search-button {
  margin-left: 8px;
  height: 40px;
  width: 9%;
}
</style>
