<template>
  <div>
    <h1 style="margin-left:520px;font-size: 27px;font-weight: normal">访问整体数据列表</h1>
    <el-table
      :data="tableData"
      border
      stripe
      style="width: 100%;margin-top: 30px;">
      <el-table-column
        prop="provinceName"
        label="省份"
        width="280">
      </el-table-column>
      <el-table-column
        prop="minvalue"
        label="最低"
        width="280">
      </el-table-column>
      <el-table-column
        prop="middlevalue"
        label="中位数">
      </el-table-column>
      <el-table-column
        prop="frequentmodule"
        label="访问频率最高模块">
      </el-table-column>
    </el-table>

    <div style="position: absolute;left: 50%;top: 72%;">
      <el-pagination
        background
        layout="prev, pager, next"
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
    name: "alldata",
    data() {
      return{
        radio: 3,
        tableData:[],
        /*{
        name:'唐海林',
        minvalue:1312211,
        middlevalue:'海南海口',
        frequentmodule:'电脑城'
      },{
        name:'唐海林',
        minvalue:1312211,
        middlevalue:'海南海口',
        frequentmodule:'电脑城'
      }*/
        input:'',
        value:'',
        value2:'',
        value3:'',
        total:0,

        option:[],
        option2:[],
        option3:[],

        addBox : false,
        editBox:false,
        user:{},
      }
    },

    created(){
      var self=this;
      axios.get('http://10.11.37.68:8081/data_list/population?page=1').then(res=>{
        console.log(res.data);
        self.total=res.data.data.totalPage*10;
        var tableData=res.data.data.listMsg;
        for(var i=0;i<tableData.length;i++){
          var singleData=new Object();
          singleData.provinceName=tableData[i].province;
          singleData.minvalue=tableData[i].WeekLow;
          singleData.middlevalue=tableData[i].WeekMiddle;
          singleData.frequentmodule=tableData[i].WeekHigh;
          self.tableData.push(singleData);
        }
      })
    },
    methods:{

      //显示第几页
      handleCurrentChange(val){
        this.getData(val)
      },

      getData(val){
        var self=this;
        axios.get('http://10.11.37.68:8081/data_list/population/'+val).then(res=>{
          var personalData=res.data.data.listMsg;   //赋值
          var datalist=[];
          for(var i=0;i<personalData.length;i++){
            var singleData=new Object();
            singleData.provinceName=personalData[i].provinces;
            singleData.minvalue=personalData[i].WeekLow;
            singleData.middlevalue=personalData[i].WeekMiddle;
            singleData.frequentmodule=personalData[i].WeekHigh;
            datalist.push(singleData);
          }
          self.tableData=datalist;
        })
      }
    }
  }
</script>

<style scoped>

</style>


