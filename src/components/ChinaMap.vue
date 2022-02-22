<template>
  <div>
    <div class="echart-map" ref="myEchart" @mousedown="mousedown" @mouseup="mouseup"></div>
    <cakeAndzhu ref="new" :cityname="cityname"/>
  </div>
</template>

<script>
  import echarts from 'echarts';
  import 'echarts/map/js/china.js';
  import textAPI from '../request/api.js';
  import axios from 'axios';
  import cakeAndzhu from '../components/CakeAndZhu.vue'
  import {provinceNameArr, cityNameData, provinceNameChineseToEng, cityNameChineseToEng} from '../libs/geoNameDictionary.js'; // 引入省市对应英文名字

  export default {
    name: 'echarts',
    components:{
      cakeAndzhu,
    },
    data() {
      return {
        dialogVisible: false, //控制dialog对话框的显示与否
        echart: null,
        baseUrl:'http://10.11.37.239:8888',
        // echart地图的配置项
        option: {},
        cityname:'',
        // 地图拖动起止位置（用于拖动不触发返回事件）
        mouse_position: {
          beginX: '',
          beginY: '',
          endX: '',
          endY: '',
        },

        // 地区类型：country, province, city
        placeType: 'country',
        // 当前省
        province: {
          name: '',
          code: '',
        },
        // 当前市
        city: {
          name: '',
          code: '',
        },

        init:[{
          provinceName:"浙江",
          cityName:[
            "绍兴","杭州"
          ]
        },
          {
            provinceName:"江苏",
            cityName:["南京","苏州"]
          }],

        data: [
        ],
        geoCoordMap: {
          '海门市':[121.15,31.89],
          '鄂尔多斯市':[109.781327,39.608266],
          '招远市':[120.38,37.35],
          '舟山市':[122.207216,29.985295],
          '齐齐哈尔市':[123.97,47.33],
          '盐城市':[120.13,33.38],
          '赤峰市':[118.87,42.28],
          '青岛市':[120.33,36.07],
          '乳山市':[121.52,36.89],
          '金昌市':[102.188043,38.520089],
          '泉州市':[118.58,24.93],
          '莱西市':[120.53,36.86],
          '日照市':[119.46,35.42],
          '胶南市':[119.97,35.88],
          '南通市':[121.05,32.08],
          '拉萨市':[91.11,29.97],
          '云浮市':[112.02,22.93],
          '梅州市':[116.1,24.55],
          '文登市':[122.05,37.2],
          '上海市':[121.48,31.22],
          '攀枝花市':[101.718637,26.582347],
          '威海市':[122.1,37.5],
          '承德市':[117.93,40.97],
          '厦门市':[118.1,24.46],
          '汕尾市':[115.375279,22.786211],
          '潮州市':[116.63,23.68],
          '丹东市':[124.37,40.13],
          '太仓市':[121.1,31.45],
          '曲靖市':[103.79,25.51],
          '烟台市':[121.39,37.52],
          '福州市':[119.3,26.08],
          '瓦房店市':[121.979603,39.627114],
          '即墨市':[120.45,36.38],
          '抚顺市':[123.97,41.97],
          '玉溪市':[102.52,24.35],
          '张家口市':[114.87,40.82],
          '阳泉市':[113.57,37.85],
          '莱州市':[119.942327,37.177017],
          '湖州市':[120.1,30.86],
          '汕头市':[116.69,23.39],
          '昆山市':[120.95,31.39],
          '宁波市':[121.56,29.86],
          '湛江市':[110.359377,21.270708],
          '揭阳市':[116.35,23.55],
          '荣成市':[122.41,37.16],
          '连云港市':[119.16,34.59],
          '葫芦岛市':[120.836932,40.711052],
          '常熟市':[120.74,31.64],
          '东莞市':[113.75,23.04],
          '河源市':[114.68,23.73],
          '淮安市':[119.15,33.5],
          '泰州市':[119.9,32.49],
          '南宁市':[108.33,22.84],
          '营口市':[122.18,40.65],
          '惠州市':[114.4,23.09],
          '江阴市':[120.26,31.91],
          '蓬莱市':[120.75,37.8],
          '韶关市':[113.62,24.84],
          '嘉峪关市':[98.289152,39.77313],
          '广州市':[113.23,23.16],
          '延安市':[109.47,36.6],
          '太原市':[112.53,37.87],
          '清远市':[113.01,23.7],
          '中山市':[113.38,22.52],
          '昆明市':[102.73,25.04],
          '寿光市':[118.73,36.86],
          '盘锦市':[122.070714,41.119997],
          '长治市':[113.08,36.18],
          '深圳市':[114.07,22.62],
          '珠海市':[113.52,22.3],
          '宿迁市':[118.3,33.96],
          '咸阳市':[108.72,34.36],
          '铜川市':[109.11,35.09],
          '平度市':[119.97,36.77],
          '佛山市':[113.11,23.05],
          '海口市':[110.35,20.02],
          '江门市':[113.06,22.61],
          '章丘市':[117.53,36.72],
          '肇庆市':[112.44,23.05],
          '大连市':[121.62,38.92],
          '临汾市':[111.5,36.08],
          '吴江市':[120.63,31.16],
          '石嘴山市':[106.39,39.04],
          '沈阳市':[123.38,41.8],
          '苏州市':[120.62,31.32],
          '茂名市':[110.88,21.68],
          '嘉兴市':[120.76,30.77],
          '长春市':[125.35,43.88],
          '胶州市':[120.03336,36.264622],
          '银川市':[106.27,38.47],
          '张家港市':[120.555821,31.875428],
          '三门峡市':[111.19,34.76],
          '锦州市':[121.15,41.13],
          '南昌市':[115.89,28.68],
          '柳州市':[109.4,24.33],
          '三亚市':[109.511909,18.252847],
          '自贡市':[104.778442,29.33903],
          '吉林市':[126.57,43.87],
          '阳江市':[111.95,21.85],
          '泸州市':[105.39,28.91],
          '西宁市':[101.74,36.56],
          '宜宾市':[104.56,29.77],
          '呼和浩特市':[111.65,40.82],
          '成都市':[104.06,30.67],
          '大同市':[113.3,40.12],
          '镇江市':[119.44,32.2],
          '桂林市':[110.28,25.29],
          '张家界市':[110.479191,29.117096],
          '宜兴市':[119.82,31.36],
          '北海市':[109.12,21.49],
          '西安市':[108.95,34.27],
          '金坛市':[119.56,31.74],
          '东营市':[118.49,37.46],
          '牡丹江市':[129.58,44.6],
          '遵义市':[106.9,27.7],
          '绍兴市':[120.58,30.01],
          '扬州市':[119.42,32.39],
          '常州市':[119.95,31.79],
          '潍坊市':[119.1,36.62],
          '重庆市':[106.54,29.59],
          '台州市':[121.420757,28.656386],
          '南京市':[118.78,32.04],
          '滨州市':[118.03,37.36],
          '贵阳市':[106.71,26.57],
          '无锡市':[120.29,31.59],
          '本溪市':[123.73,41.3],
          '克拉玛依市':[84.77,45.59],
          '渭南市':[109.5,34.52],
          '马鞍山市':[118.48,31.56],
          '宝鸡市':[107.15,34.38],
          '焦作市':[113.21,35.24],
          '句容市':[119.16,31.95],
          '北京市':[116.46,39.92],
          '徐州市':[117.2,34.26],
          '衡水市':[115.72,37.72],
          '包头市':[110,40.58],
          '绵阳市':[104.73,31.48],
          '乌鲁木齐市':[87.68,43.77],
          '枣庄市':[117.57,34.86],
          '杭州市':[120.19,30.26],
          '淄博市':[118.05,36.78],
          '鞍山市':[122.85,41.12],
          '溧阳市':[119.48,31.43],
          '库尔勒市':[86.06,41.68],
          '安阳市':[114.35,36.1],
          '开封市':[114.35,34.79],
          '济南市':[117,36.65],
          '德阳市':[104.37,31.13],
          '温州市':[120.65,28.01],
          '九江市':[115.97,29.71],
          '邯郸市':[114.47,36.6],
          '临安市':[119.72,30.23],
          '兰州市':[103.73,36.03],
          '沧州市':[116.83,38.33],
          '临沂市':[118.35,35.05],
          '南充市':[106.110698,30.837793],
          '天津市':[117.2,39.13],
          '富阳市':[119.95,30.07],
          '泰安市':[117.13,36.18],
          '诸暨市':[120.23,29.71],
          '郑州市':[113.65,34.76],
          '哈尔滨市':[126.63,45.75],
          '聊城市':[115.97,36.45],
          '芜湖市':[118.38,31.33],
          '唐山市':[118.02,39.63],
          '平顶山市':[113.29,33.75],
          '邢台市':[114.48,37.05],
          '德州市':[116.29,37.45],
          '济宁市':[116.59,35.38],
          '荆州市':[112.239741,30.335165],
          '宜昌市':[111.3,30.7],
          '义乌市':[120.06,29.32],
          '丽水市':[119.92,28.45],
          '洛阳市':[112.44,34.7],
          '秦皇岛市':[119.57,39.95],
          '株洲市':[113.16,27.83],
          '石家庄市':[114.48,38.03],
          '莱芜市':[117.67,36.19],
          '常德市':[111.69,29.05],
          '保定市':[115.48,38.85],
          '湘潭市':[112.91,27.87],
          '金华市':[119.64,29.12],
          '岳阳市':[113.09,29.37],
          '长沙市':[113,28.21],
          '衢州市':[118.88,28.97],
          '廊坊市':[116.7,39.53],
          '菏泽市':[115.480656,35.23375],
          '合肥市':[117.27,31.86],
          '武汉市':[114.31,30.52],
          '大庆市':[125.03,46.58]
        },
      }
    },

    //初始化地图数据
    created(){
      axios.get(this.baseUrl+'/Login_Data/GetLogin_NumByAddress').then(res=>{
        localStorage.setItem('city', JSON.stringify((res.data.data.city)))
      })

    },

    methods: {
      // 判断一个城市是否在这个省内
      cityIsInclude(provinceEngName, cityName, cityNameEng) {
        let cities = cityNameData[`cityName_${provinceEngName}`]
        for (let city in cities) {
          if ((!cityNameEng && city.indexOf(cityName) !== -1) || (cityNameEng && city.indexOf(cityName) !== -1 && cities[city] === cityNameEng)) {
            return true
          }
        }
        return false
      },

      // 将data在坐标点上展示，同时在省市情况下，过滤掉范围外的点
      convertData(data, provinceEngName, cityNameEng) {
        var res = [];
        for (var i = 0; i < data.length; i++) {
          if (provinceEngName) {
            let ret = this.cityIsInclude(provinceEngName, data[i].name, cityNameEng)
            if (ret) {
              var geoCoord = this.geoCoordMap[data[i].name]
              if (geoCoord) {
                res.push({
                  name: data[i].name,
                  value: geoCoord.concat(data[i].value)
                })
              }
            }
          } else {
            let geoCoord = this.geoCoordMap[data[i].name];
            if (geoCoord) {
              res.push({
                name: data[i].name,
                value: geoCoord.concat(data[i].value)
              });
            }
          }
        }
        return res;
      },

      // 设置地图的option配置项
      setMapOption(place = 'china', center = undefined) {
        this.option = {
          /*backgroundColor: "#0ffbff",  //地图背景颜色 */
          tooltip : { // 鼠标移到图里面的浮动提示框
            trigger: 'item'
          },
          // 图例
          legend: {
            show: false,
            orient: 'vertical', // 排序方式
            y: 'bottom', // y轴位置
            x:'right', // x轴位置
            data:['pm2.5', 'Top 5'], // 图例的数据数组，对应series中的name
            textStyle: { // 文字样式
              color: '#fff'
            },
            icon: 'rect',
            formatter: ``,
          },
          geo: {
            map: place,
            aspectScale: 0.75, // 地图长宽比
            scaleLimit: { // 放大缩小最大比例限制
              min: 0.8,
              max: 4,
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
          series: [
            {
              name: '位置：',
              type: 'scatter',
              coordinateSystem: 'geo',
              data: this.convertData(this.data),
              encode: {
                value: 2
              },
              symbolSize: 4,
              label: {
                normal: {
                  formatter: '{b}',
                  position: 'right',
                  show: false
                },
                emphasis: {
                  show: true
                }
              },
              itemStyle: {
                normal: {
                  color: '#58FA58' //为空的点集的颜色
                }
              }
            },
            {
              name: 'Top 10',
              type: 'effectScatter',
              coordinateSystem: 'geo',
              data: this.convertData(this.data.sort(function (a, b) {
                return b.value - a.value;
              }).slice(0, 10)),
              encode: {
                value: 2
              },
              symbolSize: 8,
              showEffectOn: 'render', // 何时显示特效
              effectType: 'ripple', // 特效类型，暂时只有涟漪类型
              rippleEffect: {
                period: 6,
                scale: 8,
                brushType: 'stroke'
              },
              hoverAnimation: true,
              // label: {
              //   normal: {
              //     formatter: '{b}',
              //     position: 'right',
              //     show: true
              //   }
              // },
              itemStyle: {
                normal: {
                  color: '#58FA58',   //非空点集的颜色
                  // shadowBlur: 10,
                  // shadowColor: '#333'
                }
              },
              zlevel: 1
            }
          ]
        };
      },

      // 鼠标拖动事件（使拖动不触发返回事件）
      mousedown(e) {
        this.mouse_position.beginX = e.clientX;
        this.mouse_position.beginY = e.clientY;
      },
      mouseup(e) {
        this.mouse_position.endX = e.clientX;
        this.mouse_position.endY = e.clientY;
      },

      // 判断是否拖动，当前允许存在4px误差
      isdrag(x1,y1,x2,y2) {
        if(Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2)) <= 4) {
          return false;
        }
        return true;
      },

      // 点击其他区域，返回上一页
      clickOther() {
        console.log(this.mouse_position);

        if (!this.isdrag(this.mouse_position.beginX, this.mouse_position.beginY, this.mouse_position.endX, this.mouse_position.endY)) {
          if (this.placeType == 'city' && this.province.name) {
            // 从市返回省
            this.placeType = 'province';
            this.city.code = '';
            this.city.name = '';
            this.setMapOption(this.province.name);
            this.option.series[0].data = this.convertData(this.data, provinceNameChineseToEng(this.province.name));
            this.option.series[1].data = this.convertData(this.data.sort(function (a, b) {
              return b.value - a.value;
            }).slice(0, 5), provinceNameChineseToEng(this.province.name));
            this.echart.setOption(this.option);
          } else if (this.placeType == 'province') {
            // 从省返回国家
            this.placeType = 'country';
            this.province.code = '';
            this.province.name = '';
            this.city.code = '';
            this.city.name = '';
            this.setMapOption();
            this.echart.setOption(this.option);
          }
        }
      },

      // 渲染echart地图
      chinaConfigure() {
        this.echart = echarts.init(this.$refs.myEchart); //这里是为了获得容器所在位置
        window.onresize = this.echart.resize;
        // echart配置项
        this.setMapOption();
        this.echart.setOption(this.option);


        // 点击事件
        // 使用剪头函数，函数内部的this会指向调用函数时的this，而不是函数体内
        this.echart.on('click',  (params) => {
          event.stopPropagation(); // 阻止冒泡
          this.cityname=params.name;
          self=this;
          //初始化饼图和柱状图数据
          textAPI.CakeAPI(params.name).then(res =>{
            console.log(res)
            window.localStorage.setItem("cake",null);
            window.localStorage.setItem("zhu",null);
            console.log(res.data.data.city);
            console.log(res.data.data.top);
            window.localStorage.setItem("cake",JSON.stringify((res.data.data.city)));
            window.localStorage.setItem("zhu",JSON.stringify((res.data.data.top)));
            self.$refs.new.show(true);
          })

          if (params.componentType === 'series') {
            // 点击了单个停车场， 跳转停车场详情
            alert('跳转详情页');
            return;
          }

          // 对点击的省或者市做不同的处理
          let province = provinceNameArr.find(item => item.chineseName === params.name);
          console.log(province, this.placeType);
          if (this.placeType === 'country' && province) {
            // 点击了省

            // if (province.code.length == '6') {
            // 如果是直辖市，香港澳门台湾，则直接当成省级，进入渲染市级
            // this.setCityMap(province.chineseName, province.code)
            // } else {
            this.setProvinceMap(province.chineseName, province.code);
            // }

          } else if (this.placeType === 'province'
            // Object.keys(obj) --> 能够遍历出该对象所有的key，输出所有key的一个集合; 同理Object.values(obj)输入对象的value集合
            && Object.keys(cityNameData[`cityName_${provinceNameChineseToEng(this.province.name)}`]).find(item => item === params.name)
          ) {
            // 点击了市，跳转到该市
            console.log(this.province.name);
            console.log(provinceNameChineseToEng(this.province.name));
            console.log(`cityName_${provinceNameChineseToEng(this.province.name)}`);
            console.log(Object.keys(cityNameData[`cityName_${provinceNameChineseToEng(this.province.name)}`]).find(item => item === params.name));
            let cityCode = cityNameData[`cityName_${provinceNameChineseToEng(this.province.name)}`][params.name];

            this.setCityMap(params.name, cityCode);

          } else if (this.placeType === 'city') {
            // 点击县，不做处理
          } else if (this.placeType === 'province' && !cityNameData[`cityName_${provinceNameChineseToEng(this.province.name)}`]) {
            // 点击直辖市、香港澳门台湾的内部，不做处理
          } else {
            /*alert('地图资源错误，请联系管理员!');*/
          }

        })
      },

      // 设置省份地图
      setProvinceMap(name, code) {
        axios.get(`/json/geometryProvince/${code}.json`).then(res => {
          this.placeType = 'province';
          this.province.name = name;
          this.province.code = code;
          this.setMapOption(name, res.data.cp);
          this.option.series[0].data = this.convertData(this.data, provinceNameChineseToEng(name));
          this.option.series[1].data = this.convertData(this.data.sort(function (a, b) {
            return b.value - a.value;
          }).slice(0, 5), provinceNameChineseToEng(name));
          echarts.registerMap(name, res.data);
          this.echart.setOption(this.option);
        }).catch(err => {
          /*alert('地图资源错误，请联系管理员!');*/
        })
      },

      // 设置城市地图
      setCityMap(name, code) {
        axios.get(`/json/geometryCouties/${code}.json`).then(res => {
          this.placeType = 'city';
          this.city.name = name;
          this.city.code = code;
          this.setMapOption(name, res.data.cp);
          this.option.series[0].data = this.convertData(this.data, provinceNameChineseToEng(this.province.name), code);
          this.option.series[1].data = this.convertData(this.data.sort(function (a, b) {
            return b.value - a.value;
          }).slice(0, 5), provinceNameChineseToEng(this.province.name), code);
          echarts.registerMap(name, res.data);
          this.echart.setOption(this.option);
        }).catch(err => {
          /*alert('地图资源错误，请联系管理员!');*/
        })
      },
    },
    mounted() {
      this.data = JSON.parse(localStorage.getItem('city'))
      this.chinaConfigure();
    },
    beforeDestroy() {
      if (!this.echart) {
        return;
      }
      this.echart.dispose();
      this.echart = null;
    },
  }
</script>

<style scoped>

  .echart-map {
    background: url(../assets/bg.jpg);
    background-size: cover;
    -webkit-background-size: cover;
    -o-background-size: cover;
    position: absolute;
    right:0px;
    top:60px;
    width: 1350px;
    height: 722px;
  }

  *{
    height:100%;
    padding:0px;
    margin:0px;
  }
</style>
