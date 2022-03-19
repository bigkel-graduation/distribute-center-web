<template>
  <div id="main" class="main-box"></div>
</template>

<script>
import * as echarts4 from "echarts4";
import china from "echarts4/map/json/china.json";
import geoCoordMap from "../libs/chinaMap.js";
import trackDisplayApi from "../request/trackDisplayApi.js";

export default {
  data() {
    return {
      fromToName: []
    };
  },

  created() {
    this.getTrackData();
  },

  methods: {
    getTrackData() {
      trackDisplayApi.getTrackData().then(response => {
        this.fromToName = response.data.userTrack;
        this.$nextTick(() => {
          this.getTrack();
        });
      });
    },

    getTrack() {
      var myChart = echarts4.init(document.getElementById("main"));
      echarts4.registerMap("china", china);

      var all = this.fromToName;
      // 小飞机矢量图
      var planePath =
        "path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z";

      // 将from 和 to 两地关联 起来
      var convertData = function(data) {
        // data: { from: "北京", to: "重庆", value: 1 }
        var res = [];
        var fromCoord = geoCoordMap[data.from]; // 出发地的经纬度
        var toCoord = geoCoordMap[data.to]; // 目的地的经纬度
        if (fromCoord && toCoord) {
          res.push({
            fromName: data.from,
            toName: data.to,
            coords: [fromCoord, toCoord],
            value: data.value
          });
        }
        return res;
      };

      // 变量7：color：定义了对指定上述城市用SVG画图时线条的颜色
      var color = ["#a6c84c", "#ffa022", "#46bee9"];
      // 变量8：series：图表的系列，开发时动态填充
      var series = [];
      // 对我们上面定义的空图表系列series进行数据填充
      all.forEach(function(item, i) {
        series.push(
          // 第一组：两地之间的动态轨迹
          {
            name: item.from + "->" + item.to, // 系列的名称
            // lines：用于带有起点和终点信息的线数据的绘制，主要用于路线可视化
            type: "lines",
            zlevel: 1, // 画布的权重，权重大的在最上面
            effect: {
              show: true, // 打开线条特效
              period: 6, // 特效动画时间，单位s
              trailLength: 0.5, // 特效尾迹的长度，值越大越长
              color: "#fff",
              symbolSize: 3 // 特效标记的大小
            },
            // 线条的样式
            lineStyle: {
              normal: {
                color: color[i % 3],
                width: 0,
                curveness: 0.2 // 边的曲度，取值0~1，值越大曲度越大
              }
            },
            data: convertData(item) // 拿到两地关系数据后画尾焰
          },
          // 第二组：两地之间的线条
          {
            name: item.from + "->" + item.to,
            type: "lines",
            zlevel: 2,
            effect: {
              show: true,
              period: 6,
              trailLength: 0,
              symbol: planePath, // 基于SVG矢量图的特效图形标记，用于绘制小飞机的
              symbolSize: 15
            },
            lineStyle: {
              normal: {
                color: color[i % 3],
                width: 1,
                opacity: 0.4, // 图形透明度
                curveness: 0.2
              }
            },
            data: convertData(item) // 拿到两地关系数据后画线条
          },
          // 第三组，显示起点到终点的城市名称和点点大小
          {
            name: item.from + "->" + item.to,
            type: "effectScatter", // 带有涟漪特效的散点图，起到视觉突出的效果
            coordinateSystem: "geo", // 该系列使用的坐标系指定为地理坐标系
            zlevel: 1,
            rippleEffect: {
              brushType: "stroke" // 波纹的绘制方式
            },
            // 展示终点地区名称
            label: {
              normal: {
                show: true,
                position: "right", // 地区名称标签显示位置
                formatter: "{b}" // 格式化显示标签，b指的是系列的名称
              }
            },
            symbolSize: function(val) {
              return val[2] * 1.2; // 目的地涟漪特效的大小
            },
            encode: {
              value: 2
            },
            itemStyle: {
              normal: {
                color: "rgb(158, 186, 248)" // 终点地区名称颜色
              }
            },
            // 为了显示目的地点点大小
            data: all.map(function(dataItem) {
              // dataItem ==> {from: "北京", to: "重庆", value: 1}
              return {
                name: dataItem.to,
                value: geoCoordMap[dataItem.to].concat([dataItem.value])
              };
            })
          }
        );
      });
      // 变量9：option：指定图表的配置项和数据
      var option = {
        title: {
          text: "用户轨迹图",
          subtext: "Track With Distribute User",
          left: "center",
          textStyle: {
            color: "black"
          }
        },
        tooltip: {
          trigger: "item"
        },

        // geo：地理坐标系组件
        geo: {
          itemStyle: {
            emphasis: {
              areaColor: "rgb(231, 231, 231)" // 更改省份鼠标移上去后的颜色
            }
          },
          type: "map",
          map: "china",
          center: [106.54, 28.9], // 启动后，显示正中间的位置

          boundingCoords: [
            // 固定地图刷新后的显示大小
            // 定位左上角经纬度
            [-185, 90],
            // 定位右下角经纬度
            [185, -90]
          ],
          zoom: 5,
          roam: true // 地图能否缩放
        },
        series: series // 调用上面已经填充好的series
      };
      // 5. 使用指定的配置项和数据显示图表
      myChart.setOption(option);
    }
  }
};
</script>

<style scoped>
.main-box {
  width: 1360px;
  height: 960px;
  background-color: whitesmoke;
  margin-top: -20px;
  margin-left: -20px;
}
</style>
