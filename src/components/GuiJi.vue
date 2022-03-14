<template>
  <div class="brand-container">
    <div class="wrap">
      <section class="mainbox">
        <div class="item center">
          <div class="map">
            <div class="chart" id="chart_map"></div>
            <div class="map1"></div>
            <div class="map2"></div>
            <div class="map3"></div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import "@/assets/js/flexible";
import "@/assets/js/china";
import axios from "axios";
import echarts from "echarts";
export default {
  name: "guiji",
  data() {
    return {
      houtai: {
        // 杭州: [120.153576,30.287459],
        // 上海: [121.4648, 31.2891],
        // 东莞: [113.8953, 22.901],
      },
      XAData: [],
      geoCoordMap: {}
    };
  },
  computed: {},
  created() {},
  mounted() {
    this.getdata();
    this.getEchart();
    /* this.changedata(); */
    /*this.changedata(this.houtai)*/

    /* console.log(this.geoCoordMap) */
  },
  methods: {
    getdata() {
      axios
        .get("http://172.20.10.5:8888/Login_Data/GetLogin_DataById?id=1")
        .then(res => {
          console.log(1221);
          console.log(res);
          var login_data = res.data.data.login_data;
          console.log(1111);
          var len = login_data.length;
          var lujing = [];
          var i;
          var object = {};
          for (i = 0; i < len - 1; i++) {
            object[login_data[i].address] = [
              login_data[i].point_X * 1,
              login_data[i].point_Y * 1
            ];
            console.log(object);
            var lujingdian = [
              { name: login_data[i].address },
              { name: login_data[i + 1].address, vaule: 1 }
            ];
            lujing.push(lujingdian);
          }
          object[login_data[len - 1].address] = [
            login_data[len - 1].point_X * 1,
            login_data[len - 1].point_Y * 1
          ];
          console.log("111111" + object);
          window.localStorage.setItem("point", JSON.stringify(object));
          window.localStorage.setItem("lujing", JSON.stringify(lujing));
          // console.log(res.data.data.login_data[0])
        });
    },
    changedata() {
      // console.log("333")
      // var login_data=JSON.parse(window.localStorage.getItem("res"))
      // console.log("1222")
      // // var city=[]
      // //   for(var i in houtai){
      // //       city.push(i)
      // //   }
      //   var len=login_data.length
      //   var lujing=[]
      //   var i
      //   var object={}
      //   for(i=0;i<len-1;i++){
      //     // object[login_data[i].address]=[login_data[i].point_X*1,login_data[i].point_Y*1]
      //     // console.log(object)
      //     // var lujingdian=([{"name":login_data[i].address},{"name":login_data[i+1].address,"vaule":1}])
      //     // lujing.push(lujingdian)
      //   }
      //   // object[login_data[len-1].address]=[login_data[len].point_X*1,login_data[len].point_Y*1]
      //   console.log("111111"+object)
      //   window.localStorage.setItem("point",JSON.stringify(object))
      //   window.localStorage.setItem("lujing",JSON.stringify(lujing))
      /*  console.log(JSON.stringify(lujing))
         console.log(this.XAData) */
      /* return resdata */
    },
    convertData(data) {
      // 地图数据转换
      let res = [];
      for (let i = 0; i < data.length; i++) {
        let dataItem = data[i];
        let fromCoord = this.geoCoordMap[dataItem[0].name];
        let toCoord = this.geoCoordMap[dataItem[1].name];
        if (fromCoord && toCoord) {
          res.push({
            fromName: dataItem[0].name,
            toName: dataItem[1].name,
            coords: [fromCoord, toCoord],
            value: dataItem[1].value
          });
        }
      }
      return res;
    },
    getEchart() {
      // 初始化地图数据
      this.geoCoordMap = JSON.parse(window.localStorage.getItem("point"));
      this.XAData = JSON.parse(window.localStorage.getItem("lujing"));
      let myChart = echarts.init(document.getElementById("chart_map"));
      /*  东营: [118.7073, 37.5513],
         中山: [113.4229, 22.478],
         临汾: [111.4783, 36.1615],
         临沂: [118.3118, 35.2936],
         丹东: [124.541, 40.4242],
         丽水: [119.5642, 28.1854],
         乌鲁木齐: [87.9236, 43.5883],
         佛山: [112.8955, 23.1097],
         保定: [115.0488, 39.0948],
         兰州: [103.5901, 36.3043],
         包头: [110.3467, 41.4899],
         北京: [116.4551, 40.2539],
         北海: [109.314, 21.6211],
         南京: [118.8062, 31.9208],
         南宁: [108.479, 23.1152],
         南昌: [116.0046, 28.6633],
         南通: [121.1023, 32.1625],
         厦门: [118.1689, 24.6478],
         台州: [121.1353, 28.6688],
         合肥: [117.29, 32.0581],
         呼和浩特: [111.4124, 40.4901],
         咸阳: [108.4131, 34.8706],
         哈尔滨: [127.9688, 45.368],
         唐山: [118.4766, 39.6826],
         嘉兴: [120.9155, 30.6354],
         大同: [113.7854, 39.8035],
         大连: [122.2229, 39.4409],
         天津: [117.4219, 39.4189],
         太原: [112.3352, 37.9413],
         威海: [121.9482, 37.1393],
         宁波: [121.5967, 29.6466],
         宝鸡: [107.1826, 34.3433],
         宿迁: [118.5535, 33.7775],
         常州: [119.4543, 31.5582],
         广州: [113.5107, 23.2196],
         廊坊: [116.521, 39.0509],
         延安: [109.1052, 36.4252],
         张家口: [115.1477, 40.8527],
         徐州: [117.5208, 34.3268],
         德州: [116.6858, 37.2107],
         惠州: [114.6204, 23.1647],
         成都: [103.9526, 30.7617],
         扬州: [119.4653, 32.8162],
         承德: [117.5757, 41.4075],
         拉萨: [91.1865, 30.1465],
         无锡: [120.3442, 31.5527],
         日照: [119.2786, 35.5023],
         昆明: [102.9199, 25.4663],
         杭州: [119.5313, 29.8773],
         枣庄: [117.323, 34.8926],
         柳州: [109.3799, 24.9774],
         株洲: [113.5327, 27.0319],
         武汉: [114.3896, 30.6628],
         汕头: [117.1692, 23.3405],
         江门: [112.6318, 22.1484],
         沈阳: [123.1238, 42.1216],
         沧州: [116.8286, 38.2104],
         河源: [114.917, 23.9722],
         泉州: [118.3228, 25.1147],
         泰安: [117.0264, 36.0516],
         泰州: [120.0586, 32.5525],
         济南: [117.1582, 36.8701],
         济宁: [116.8286, 35.3375],
         海口: [110.3893, 19.8516],
         淄博: [118.0371, 36.6064],
         淮安: [118.927, 33.4039],
         深圳: [114.5435, 22.5439],
         清远: [112.9175, 24.3292],
         温州: [120.498, 27.8119],
         渭南: [109.7864, 35.0299],
         湖州: [119.8608, 30.7782],
         湘潭: [112.5439, 27.7075],
         滨州: [117.8174, 37.4963],
         潍坊: [119.0918, 36.524],
         烟台: [120.7397, 37.5128],
         玉溪: [101.9312, 23.8898],
         珠海: [113.7305, 22.1155],
         盐城: [120.2234, 33.5577],
         盘锦: [121.9482, 41.0449],
         石家庄: [114.4995, 38.1006],
         福州: [119.4543, 25.9222],
         秦皇岛: [119.2126, 40.0232],
         绍兴: [120.564, 29.7565],
         聊城: [115.9167, 36.4032],
         肇庆: [112.1265, 23.5822],
         舟山: [122.2559, 30.2234],
         苏州: [120.6519, 31.3989],
         莱芜: [117.6526, 36.2714],
         菏泽: [115.6201, 35.2057],
         营口: [122.4316, 40.4297],
         葫芦岛: [120.1575, 40.578],
         衡水: [115.8838, 37.7161],
         衢州: [118.6853, 28.8666],
         西宁: [101.4038, 36.8207],
         西安: [109.1162, 34.2004],
         贵阳: [106.6992, 26.7682],
         连云港: [119.1248, 34.552],
         邢台: [114.8071, 37.2821],
         邯郸: [114.4775, 36.535],
         郑州: [113.4668, 34.6234],
         鄂尔多斯: [108.9734, 39.2487],
         重庆: [107.7539, 30.1904],
         金华: [120.0037, 29.1028],
         铜川: [109.0393, 35.1947],
         银川: [106.3586, 38.1775],
         镇江: [119.4763, 31.9702],
         长春: [125.8154, 44.2584],
         长沙: [113.0823, 28.2568],
         长治: [112.8625, 36.4746],
         阳泉: [113.4778, 38.0951],
         青岛: [120.4651, 36.3373],
         韶关: [113.7964, 24.7028] */

      let planePath =
        "path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z";
      let color = ["#fff", "#fff", "#fff"]; //航线的颜色
      let series = [];
      [["qishi", this.XAData]].forEach((item, i) => {
        series.push(
          {
            name: item[0],
            type: "lines",
            zlevel: 10,
            effect: {
              show: true,
              period: 6,
              trailLength: 0.7,
              color: "red", //arrow箭头的颜色
              symbolSize: 3
            },
            lineStyle: {
              normal: {
                color: color[i],
                width: 0,
                curveness: 0.2
              }
            },
            data: this.convertData(item[1])
          },
          {
            name: item[0] + " Top3",
            type: "lines",
            zlevel: 2,
            symbol: ["none", "arrow"],
            symbolSize: 10,
            effect: {
              show: true,
              period: 6,
              trailLength: 0,
              symbol: planePath,
              symbolSize: 15
            },
            lineStyle: {
              normal: {
                color: color[i],
                width: 1,
                opacity: 0.6,
                curveness: 0.2
              }
            },
            data: this.convertData(item[1])
          },
          {
            name: item[0] + " Top3",
            type: "effectScatter",
            coordinateSystem: "geo",
            zlevel: 2,
            rippleEffect: {
              brushType: "stroke"
            },
            label: {
              normal: {
                show: true,
                position: "right",
                formatter: "{b}"
              }
            },
            symbolSize: val => {
              return val[2] / 8;
            },
            itemStyle: {
              normal: {
                color: color[i]
              },
              emphasis: {
                areaColor: "#2B91B7"
              }
            },
            data: item[1].map(dataItem => {
              return {
                /*   name: dataItem[1].name, */
                value: this.geoCoordMap[dataItem[1].name].concat([
                  dataItem[1].value
                ])
              };
            })
          }
        );
      });

      let option = {
        tooltip: {
          trigger: "item",
          formatter: (params, ticket, callback) => {
            if (params.seriesType == "effectScatter") {
              return "线路：" + params.data.name + "" + params.data.value[2];
            } else if (params.seriesType == "lines") {
              return params.data.fromName + ">" + params.data.toName + "<br />";
            } else {
              return params.name;
            }
          }
        },
        geo: {
          map: "china",
          aspectScale: 0.75,
          scaleLimit: {
            // 放大缩小最大比例限制
            min: 0.8,
            max: 4
          },
          label: {
            emphasis: {
              show: true,
              color: "#fff"
            }
          },
          roam: true,
          //   放大我们的地图
          zoom: 1,
          itemStyle: {
            normal: {
              areaColor: "rgba(43, 196, 243, 0.42)",
              borderColor: "rgba(43, 196, 243, 1)",
              borderWidth: 1
            },
            emphasis: {
              areaColor: "#2B91B7"
            }
          }
        },
        series: series
      };

      myChart.setOption(option, true);
      window.addEventListener("resize", () => {
        myChart.resize();
      });
    }
  }
};
</script>

<style scoped>
.brand-container {
  position: absolute;
  width: 100%;
  height: 100%;
  margin-top: -30px;
  margin-left: -22px;
  width: 1350px;
  height: 730px;
  background: #000;
}

.brand-container .wrap {
  background: url(../assets/img/brand/bg.jpg) no-repeat #000;
  background-size: cover;
  -webkit-background-size: cover;
  -o-background-size: cover;
  line-height: 1.15;
}

.brand-container .wrap .mainbox {
  min-width: 1024px;
  max-width: 1920px;
  padding: 0.125rem 0.125rem 0;
  display: flex;
}

.brand-container .wrap .mainbox .item {
  flex: 3;
}

.brand-container .wrap .mainbox .item.center {
  flex: 5;
  margin: 0 0.125rem 0.1rem;
  overflow: hidden;
}

.brand-container .wrap .mainbox .item.center .resume {
  background: rgba(101, 132, 226, 0.1);
  padding: 0.1875rem;
}

.brand-container .wrap .mainbox .item.center .resume .resume-hd {
  position: relative;
  border: 1px solid rgba(25, 186, 139, 0.17);
}

.brand-container .wrap .mainbox .item.center .resume .resume-hd ul {
  display: flex;
}

.brand-container
  .wrap
  .mainbox
  .item.center
  .resume
  .resume-hd
  ul
  li:nth-child(2):before,
.brand-container
  .wrap
  .mainbox
  .item.center
  .resume
  .resume-hd
  ul
  li:nth-child(2):after {
  content: "";
  position: absolute;
  height: 50%;
  width: 1px;
  background: rgba(255, 255, 255, 0.2);
  top: 25%;
}

.brand-container .wrap .mainbox .item.center .resume .resume-hd ul li {
  position: relative;
  flex: 1;
  text-align: center;
  height: 1.2rem;
  line-height: 1.2rem;
  font-size: 0.65rem;
  color: #ffeb7b;
  padding: 0.05rem 0;
  font-family: "DIGITALDREAMFAT";
  font-weight: bold;
}

.brand-container
  .wrap
  .mainbox
  .item.center
  .resume
  .resume-hd
  ul
  li:nth-child(2):after {
  right: 0;
}

.brand-container
  .wrap
  .mainbox
  .item.center
  .resume
  .resume-hd
  ul
  li:nth-child(2):before {
  left: 0;
}

.brand-container .wrap .mainbox .item.center .resume .resume-hd:before {
  content: "";
  position: absolute;
  width: 30px;
  height: 10px;
  border-top: 2px solid #02a6b5;
  border-left: 2px solid #02a6b5;
  top: 0;
  left: 0;
}

.brand-container .wrap .mainbox .item.center .resume .resume-hd:after {
  content: "";
  position: absolute;
  width: 30px;
  height: 10px;
  border-bottom: 2px solid #02a6b5;
  border-right: 2px solid #02a6b5;
  right: 0;
  bottom: 0;
}

.brand-container .wrap .mainbox .item.center .resume .resume-bd ul {
  display: flex;
}

.brand-container .wrap .mainbox .item.center .resume .resume-bd ul li {
  flex: 1;
  height: 0.5rem;
  line-height: 0.5rem;
  text-align: center;
  font-size: 0.225rem;
  color: rgba(255, 255, 255, 0.7);
  padding-top: 0.125rem;
}

.brand-container .wrap .mainbox .item .map .map3,
.brand-container .wrap .mainbox .item .map .map2,
.brand-container .wrap .mainbox .item .map .map1 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 6.475rem;
  height: 6.475rem;
  background: url(../assets/img/brand/map.png) no-repeat;
  background-size: 100% 100%;
  opacity: 0.3;
}

.brand-container .wrap .mainbox .item .map {
  position: relative;
  height: 10.125rem;
}

.brand-container .wrap .mainbox .item .map .chart {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 5;
  height: 10.125rem;
  width: 100%;
}

.brand-container .wrap .mainbox .item .map .map2 {
  width: 8.0375rem;
  height: 8.0375rem;
  background-image: url(../assets/img/brand/lbx.png);
  opacity: 0.6;
  -webkit-animation: rotate 15s linear infinite;
  animation: rotate 15s linear infinite;
  z-index: 2;
}

.brand-container .wrap .mainbox .item .map .map3 {
  width: 7.075rem;
  height: 7.075rem;
  background-image: url(../assets/img/brand/jt.png);
  -webkit-animation: rotate1 10s linear infinite;
  animation: rotate1 10s linear infinite;
}

.brand-container .wrap .mainbox .item .panel {
  position: relative;
  height: 3.875rem;
  border: 1px solid rgba(25, 186, 139, 0.17);
  background: rgba(255, 255, 255, 0.04) url(../assets/img/brand/line.png);
  padding: 0 0.1875rem 0;
  margin-bottom: 0.1875rem;
}

.brand-container .wrap .mainbox .item .panel:before {
  position: absolute;
  top: 0;
  left: 0;
  content: "";
  width: 10px;
  height: 10px;
  border-top: 2px solid #02a6b5;
  border-left: 2px solid #02a6b5;
}

.brand-container .wrap .mainbox .item .panel:after {
  position: absolute;
  top: 0;
  right: 0;
  content: "";
  width: 10px;
  height: 10px;
  border-top: 2px solid #02a6b5;
  border-right: 2px solid #02a6b5;
}

.brand-container .wrap .mainbox .item .panel .panel-footer {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
}

.brand-container .wrap .mainbox .item .panel .panel-footer:before {
  position: absolute;
  bottom: 0;
  left: 0;
  content: "";
  width: 10px;
  height: 10px;
  border-bottom: 2px solid #02a6b5;
  border-left: 2px solid #02a6b5;
}

.brand-container .wrap .mainbox .item .panel .panel-footer:after {
  position: absolute;
  bottom: 0;
  right: 0;
  content: "";
  width: 10px;
  height: 10px;
  border-bottom: 2px solid #02a6b5;
  border-right: 2px solid #02a6b5;
}

.brand-container .wrap .mainbox .item .panel h2 {
  height: 0.6rem;
  line-height: 0.6rem;
  text-align: center;
  color: #fff;
  font-size: 0.225rem;
  font-weight: 400;
}

.brand-container .wrap .mainbox .item .panel h2 a {
  margin: 0 0.1875rem;
  color: #fff;
  text-decoration: none;
}

.brand-container .wrap .mainbox .item .panel .chart {
  height: 3rem;
}
* {
  height: 100%;
  padding: 0px;
  margin: 0px;
}

@-webkit-keyframes rotate {
  from {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

@keyframes rotate {
  from {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

@-webkit-keyframes rotate1 {
  from {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  to {
    transform: translate(-50%, -50%) rotate(-360deg);
  }
}

@keyframes rotate1 {
  from {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  to {
    transform: translate(-50%, -50%) rotate(-360deg);
  }
}

@media screen and (max-width: 1024px) {
  html {
    font-size: 42px !important;
  }
}

@media screen and (min-width: 1920) {
  html {
    font-size: 80px !important;
  }
}
</style>
