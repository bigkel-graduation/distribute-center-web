<template>
  <div id="main" class="main-box">
    <div id="map" class="map-box"></div>
    <div id="cake" class="cake-box"></div>
  </div>
</template>

<script>
import * as echarts4 from "echarts4";
import * as echarts from "echarts";
import china from "echarts4/map/json/china.json";
import geoCoordMap from "../libs/chinaMap.js";
import trackDisplayApi from "../request/trackDisplayApi.js";

export default {
  data() {
    return {
      displayData: []
    };
  },
  created() {
    this.getDisplayData();
  },
  methods: {
    getDisplayData() {
      trackDisplayApi.getDisplayData().then(response => {
        this.displayData = response.data.userDisplay;
        this.$nextTick(() => {
          this.getChinaMap();
          this.getChinaMapCake();
        });
      });
    },
    getChinaMap() {
      var chartDom = document.getElementById("map");
      var myChart = echarts4.init(chartDom);
      echarts4.registerMap("china", china);
      var option;

      var data = this.displayData;

      var convertData = function(data) {
        var res = [];
        for (var i = 0; i < data.length; i++) {
          var geoCoord = geoCoordMap[data[i].name];
          if (geoCoord) {
            res.push({
              name: data[i].name,
              value: geoCoord.concat(data[i].value)
            });
          }
        }
        return res;
      };

      option = {
        backgroundColor: "transparent",
        tooltip: {
          trigger: "item"
        },
        geo: {
          itemStyle: {
            emphasis: {
              areaColor: "rgb(231, 231, 231)" // 更改省份鼠标移上去后的颜色
            }
          },
          type: "map",
          map: "china",
          center: [102.71, 26.97], // 启动后，显示正中间的位置   x越大越往左，y越大越往下
          boundingCoords: [
            // 固定地图刷新后的显示大小
            // 定位左上角经纬度    x绝对值越小，地图越大
            [-140, 80],
            // 定位右下角经纬度
            [140, -80]
          ],
          zoom: 5,
          roam: true // 地图能否缩放
        },
        series: [
          {
            name: "人员分布",
            type: "scatter",
            coordinateSystem: "geo",
            data: convertData(data),
            // 让点有大有小的显示
            symbolSize: function(val) {
              return val[2] * 10;
            },
            encode: {
              value: 2 //标识geocoord列表中的索引2数据显示，默认为索引1
            }, // 用来将当前位置的用户数量显示出来，不写这个默认显示坐标纬度
            itemStyle: {
              color: "rgb(158, 186, 248)" // 点的颜色
            }
          },
          {
            name: "人员分布-Top5",
            type: "effectScatter",
            coordinateSystem: "geo",
            data: convertData(
              data
                .sort(function(a, b) {
                  return b.value - a.value;
                })
                .slice(0, 6)
            ),
            encode: {
              value: 2
            },
            symbolSize: function(val) {
              return val[2] * 10;
            },
            // showEffectOn: "emphasis", // 不一直显示波浪
            hoverAnimation: true, // 是否光标移动上去时，有凸显动画
            rippleEffect: {
              brushType: "stroke"
            }, // 有波浪

            itemStyle: {
              color: "rgb(130, 140, 230)", // 前五大的点的颜色
              shadowColor: "whitesmoke" // 前五大的点的阴影，默认是黑色
            },
            // 展示地区名称, 只有top5展示
            label: {
              normal: {
                show: true,
                position: "center", // 地区名称标签显示位置
                formatter: "{b}", // 格式化显示标签，b指的是系列的名称
                color: "black" // 终点地区名称颜色
              }
            },
            zlevel: 1
          }
        ]
      };
      option && myChart.setOption(option);
    },
    getChinaMapCake() {
      var chartDom = document.getElementById("cake");
      var myChart = echarts.init(chartDom);
      var option;
      option = {
        tooltip: {
          trigger: "item" // 移动到饼图上的提示  item为series中的data(name:value)
        },

        // 配置饼图旁边的图例
        legend: {
          top: "13%", // 离顶高度
          right: "5%", // 位置
          orient: "horization" // 垂直排列(不加这个就是默认的顶部水平排列)
        },
        series: [
          {
            name: "访问次数", // 移动到饼图上提示的名称
            type: "pie", // 饼图类型
            radius: ["35%", "55%"], // [饼图中心空白半径    饼图半径]
            center: [170, 300], // 饼图位置
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
            data: this.displayData
          }
        ]
      };
      option && myChart.setOption(option);
    }
  }
};
</script>

<style>
.main-box {
  width: 1360px;
  height: 960px;
  background-color: whitesmoke;
  margin-top: -20px;
  margin-left: -20px;
  display: flex;
}
.map-box {
  background-color: whitesmoke;
  width: 68%;
}
.cake-box {
  background-color: whitesmoke;
  width: 32%;
}
</style>
