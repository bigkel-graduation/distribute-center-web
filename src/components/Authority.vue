<template>
  <div>
    <el-table
      :data="tableData"
      border
      style="width: 1290px;margin-top: 30px;">
      <el-table-column
        prop="role_Id"
        label="角色ID"
        width="400">
      </el-table-column>
      <el-table-column
        prop="role_Name"
        label="角色名"
        width="400">
      </el-table-column>
      <el-table-column label="操作" width="480">
        <template slot-scope="scope">
          <el-button type="primary" @click="handleEditClick(scope.$index,scope.row)"  size="mini">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleDelClick(scope.$index,scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import axios from 'axios'
  export default {
    name:'authority',
    data(){
      return{
        tableData:[],

      }
    },

    created(){
      var self=this;
      axios.get('http://10.11.47.145:8081/Role/GetRoleAll').then(res=>{
        console.log(res.data)
        var tableData=res.data.data.roles;
        for(var i=0;i<tableData.length;i++){
          var singledata=new Object();
          singledata.role_Name=tableData[i].role_Name;
          singledata.role_Id=i+1;
          self.tableData.push(singledata);
        }
      })
    },

    mounted(){

    },
    methods:{
      //登录事件
      loadBtn(){
        // 我暂时就不模拟了，直接取
        /* console.log(returnCitySN);*/
        if(this.info.phone.length==0||this.info.password.length==0){
          this.$message.error("请输入完整用户名和密码");
        }else{
          var self=this;
          axios.post('http://10.11.47.145:8081/User/login',this.info).then(res=>{
            console.log(res)
            if(res.data.code==200){
              this.$message.success(res.data.message);
              var token = res.data.data.token;
              var role="老板";
              window.localStorage.setItem('token',token)
              window.localStorage.setItem('role',role);
              window.localStorage.setItem('userPhone',self.info.phone)
              window.localStorage.setItem('affiliation',res.data.affiliation)
              setTimeout(function (){
                self.$router.replace('/all');
              }, 800);
            }else{
              this.$message.error(res.data.message);
            }
          })

        }
      },

      //阻止表单提交
      onSubmit(){
        return false;
      },

      changelong(){
        this.$refs.line.style.width='183px';
      },

      changeshort(){
        this.$refs.line.style.width='0px';
      },

      transfer(){
        this.$router.push('/sanfang');
      }
    },
  };

</script>

<style scoped>

</style>
