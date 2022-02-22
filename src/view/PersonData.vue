<template>
  <div>
    <h1 style="margin-left:520px;font-size: 27px;font-weight: normal">访问个人数据列表</h1>
    <el-table
      :data="tableData"
      border
      stripe
      style="width: 100%;margin-top: 30px;">
      <el-table-column
        prop="userName"
        label="姓名"
        width="370">
      </el-table-column>
      <el-table-column
        prop="moduleNames"
        label="坐标"
        width="370">
      </el-table-column>
      <el-table-column
        prop="Affiliation"
        label="近一个星期访问模块">
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
    name: "personaldata",
    data() {
      return{
        radio: 3,
        tableData:[],
        total:0,
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
      //表格的数据初始化
      axios.get('http://10.11.37.68:8081/data_list/person?page=1').then(res=>{
        var tableData=res.data.data.listMsg;
        self.total=res.data.data.totalPage*10;
        for(var i=0;i<tableData.length;i++){
          var singleData=new Object();
          singleData.userName=tableData[i].userName;
          singleData.Affiliation=tableData[i].moduleNames;
          singleData.moduleNames=tableData[i].Affiliation;
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
        axios.get('http://10.11.37.68:8081/data_list/person?page='+val).then(res=>{
          console.log(res.data)
          var personalData=res.data.data.listMsg;   //赋值
          var datalist=[];
          for(var i=0;i<personalData.length;i++){
            var singleData=new Object();
            singleData.userName=personalData[i].userName;
            singleData.moduleNames=personalData[i].moduleNames;
            singleData.Affiliation=personalData[i].Affiliation;
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


