<template>
  <div>
    <!--下拉选择器-->
    <div>
      <span>省份:</span>
      <el-select v-model="value1" placeholder="选择省份" @change="changeProvince()">
        <el-option
          v-for="item in option1"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>

      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>市:</span>
      <el-select v-model="value2" placeholder="选择市" @change="changeCity()">
        <el-option
          v-for="item in option2"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>

      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <span>区:</span>
      <el-select v-model="value3" placeholder="选择区">
        <el-option
          v-for="item in option3"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <span>选择时间:</span>
      <el-select v-model="value4" placeholder="请选择想查询的时间范围" style="width: 200px;">
        <el-option
          v-for="item in option4"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button type="primary" plain style="margin-left: 180px;" @click="query()">确认查询</el-button>
    </div>


    <el-table
      :data="tableData"
      border
      stripe
      style="width: 100%;margin-top: 30px;">
      <el-table-column
        prop="name"
        label="姓名"
        width="240">
      </el-table-column>
      <el-table-column
        prop="mac"
        label="MAC地址"
        width="300">
      </el-table-column>
      <el-table-column
        prop="address"
        label="登录城市">
      </el-table-column>
      <el-table-column
        prop="time"
        label="登录时间">
      </el-table-column>


      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button type="primary" @click="handleEditClick(scope.$index,scope.row)"  size="mini">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="position: absolute;left: 50%;top: 90%;">
      <el-pagination
        background
        layout="prev, pager, next"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :total="total"
        class="pag">
      </el-pagination>
    </div>
  </div>
</template>


<script>
  import axios from 'axios'
  export default {
    name: "loginalllist",
    components:{

    },
    data() {
      return{
        total:0,
        //省份下拉框
        option1: [],
        /*{
        value: '当天',
        label: '当天'
      }, {
        value: '近七天',
        label: '近七天'
      }, {
        value: '三十天',
        label: '三十天'
      }*/
        //市下拉框以及区下拉框
        option2:[],
        option3:[],
        baseUrl:'http://10.11.37.239:8888',
        option4:[
          {
            value: '当天',
            label: '当天'
          }, {
            value: '近七天',
            label: '近七天'
          }, {
            value: '三十天',
            label: '三十天'
          },
          {
            value:'不限',
            label:'不限',
          }
        ],
        value1: '',  /*下拉选择选中的值*/
        value2:'',
        value3:'',
        value4:'不限',

        tableData:[],  //表格数据
        input:'',
        editBox:false,
        user:{},
        editIndex:"",
      }
    },

    //数据初始化
    created(){
      var self=this;
      var address=window.localStorage.getItem('affiliation');
      axios.get(this.baseUrl+'/Login_Data/GetLogin_DataByAddress_one?page=1&address=浙江省').then(res=>{
        self.total=res.data.data.pages*10;
        var personalData=res.data.data.login_data;   //赋值表格信息
        var provinceData=res.data.data.province;
        var cityData=res.data.data.city;
        var area=res.data.data.area;
        var datalist1=[];
        var option1=[];  //定义省份
        var option2=[];  //定义市
        var option3=[];  //定义区
        //将表格数据添加进去
        for(var i=0;i<personalData.length;i++){
          var singledata=new Object();
          singledata.name=personalData[i].user.username;
          singledata.time=personalData[i].datetime;
          singledata.mac=personalData[i].mac;
          singledata.address=personalData[i].address;
          singledata.NameID=personalData[i].access_id;
          datalist1.push(singledata);
        }

        /*添加省份进去*/
        for(var i=0;i<provinceData.length;i++){
          if(provinceData[i].provinceId==0){
            self.value1="不限"
          }else{
            var province=new Object();
            province.value=provinceData[i].provinceName;
            province.label=provinceData[i].provinceName;
            option1.push(province);
          }
        }

        /*添加市进去*/
        for(var i=0;i<cityData.length;i++){
          if(cityData[i].citysId==0){
            self.value2="不限"
          }else{
            var city=new Object();
            city.value=cityData[i].name;
            city.label=cityData[i].name;
            option2.push(city);
          }
        }


        /*添加区进去*/

        //设置省市默认头
        self.value=provinceData[0].provinceName;
        self.tableData=datalist1;
        self.option1=option1;
        self.option2=option2;

      })
    },

    methods:{

      handleEditClick(index,row){
        console.log(row);
        console.log(row.NameID)
        this.editBox = true
        this.user = row
        this.editIndex = index
      },
      // eslint-disable-next-line no-unused-vars
      handleDelClick(index,row){
        this.$confirm('此操作将删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.tableData.splice(index,1)
          this.$message({showClose: true, message: "删除成功", type: 'success'});
        })
      },
      handleEditUser(){
        this.tableData.splice(this.editIndex,1,this.user)
        this.$message({showClose: true, message: "修改成功", type: 'success'});
        this.editBox = false
      },
      handleAddClick(){
        this.addBox = true
      },

      //省份下拉框的选择事件
      changeProvince(){
        var province=this.value1;
        this.value2=''; //选择完新省份后，市名、区名置空一下
        this.value3='';
        var self=this;
        axios.get(this.baseUrl+'/City/GetCityByString?address='+province).then(res =>{
          self.option2=[]
          var cityName=res.data.data.citys;
          for(var i=0;i<cityName.length;i++){
            var city=new Object();
            city.value=cityName[i].name;
            city.label=cityName[i].name;
            self.option2.push(city);
          }
        })
      },

      changeCity(){
        var city=this.value2;
        this.value3="";
        var self=this;
        axios.get(this.baseUrl+'/Area/GetAreaByCityName?address='+city).then(res =>{
          console.log(res.data.data.Area);
          self.option3=[]
          var areaName=res.data.data.Area;
          for(var i=0;i<areaName.length;i++){
            var area=new Object();
            area.value=areaName[i].area_Name;
            area.label=areaName[i].name;
            self.option3.push(area);
          }
        })
      },

      //取得每页对应数据
      getData(val){
        var self=this;
        axios.get(this.baseUrl+'/Login_Data/GetPageAll?page='+val).then(res=>{
          var personalData=res.data.data.login_data;   //赋值
          var datalist=[];
          for(var i=0;i<personalData.length;i++){
            var singledata=new Object();
            singledata.name=personalData[i].user.username;
            singledata.mac=personalData[i].mac;
            singledata.time=personalData[i].datetime;
            singledata.address=personalData[i].address;
            singledata.NameID=personalData[i].access_id;
            datalist.push(singledata);
          }
          self.tableData=datalist;
        })
      },

      //执行查询方法
      query(){
        var self=this;
        var time=this.value4;  //取得时间
        if(this.value1.length!=0&&this.value2==0&&this.value3==0){
          var info=this.value1;
        }else if(this.value1.length!=0&&this.value2!=0&&this.value3==0){
          var info=this.value1+';'+this.value2;
        }else{
          var info=this.value1+';'+this.value2+';'+this.value3;  //取得拼接的省市区字符串
        }
        if(time=="不限"){
          axios.get(this.baseUrl+'/Login_Data/GetLogin_DataByAddress?address='+info+'&page=1').then(res=>{
            console.log(res.data);
            self.total=res.data.data.pages*10;
            var table=res.data.data.login_data;
            var datalist1=[];
            self.total=res.data.data.pages*10;
            for(var i=0;i<table.length;i++){
              var singledata=new Object();
              singledata.name=table[i].user.username;
              singledata.time=table[i].datetime;
              singledata.mac=table[i].mac;
              singledata.address=table[i].address;
              singledata.NameID=table[i].access_id;
              datalist1.push(singledata);
            }
            self.tableData=datalist1;
          })
        }else if(time="当天"){
          axios.get('http://172.20.10.5:8888/Login_Data/GetLogin_DataByAddressNowDay?address=浙江省;杭州市&page=1').then(res=>{
            console.log(res.data);

          })
        }else if(time="近七天"){
          axios.get('http://172.20.10.5:8888/Login_Data/GetLogin_DataByAddressSevenDay?address=浙江省;杭州市&page=1').then(res=>{
            console.log(res.data);

          })
        }else if(time="三十天"){
          axios.get('http://172.20.10.5:8888/Login_Data/GetLogin_DataByAddressOneMonth?address=浙江省;杭州市&page=1').then(res=>{
            console.log(res.data);

          })
        }

      },

      //每页显示的条数
      handleSizeChange(val){
        this.pagesize = 8
        this.getData(1)
        this.currentPage = 1
      },
      //显示第几页
      handleCurrentChange(val){
        this.currentPage = val
        this.getData(val)
      },
    }
  }

</script>

<style scoped>

</style>
