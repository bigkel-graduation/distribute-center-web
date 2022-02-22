<template>
  <div>
    <el-table
      :data="tableData"
      border
      style="width: 100%;margin-top:0px;">
      <el-table-column
        prop="invitedname"
        label="请求者姓名"
        width="270">
      </el-table-column>
      <el-table-column
        prop="invitedphone"
        label="请求者电话"
        width="240">
      </el-table-column>
      <el-table-column
        prop="invitedrole"
        label="请求角色">
      </el-table-column>
      <el-table-column
        prop="isAgree"
        label="同意状态">
      </el-table-column>

      <el-table-column
        label="操作">
        <el-button type="primary" @click="LoginIn()" :disabled="disabled">是否允许登入</el-button>
      </el-table-column>
    </el-table>
  </div>
</template>


<script>
  import axios from 'axios'
  import Sanfang from '../view/Sanfang'
  export default {
    name: "demand",
    data() {
      return{
        radio: 3,
        disabled:true,
        tableData:[],
          /*{
          invitedname:'唐海林',
          invitedphone:1312211,
          invitedrole:'海南海口',
        },{
          invitedname:'唐海林',
          invitedphone:1312211,
          invitedrole:'海南海口',
        }*/
        input:'',
        addBox : false,
        editBox:false,
        user:{},
        editIndex:"",
        addUserData:{
          date : "",
          name : "",
          address : ""
        }
      }
    },

    created(){
      var i=setInterval(this.isAgree, 2000);
      var Sanfanguser=JSON.parse(window.localStorage.getItem('Sanfanglogin'));
      var tab=new Object();
      tab.invitedname=Sanfanguser.requestName;
      tab.invitedphone=Sanfanguser.requestPhoneNum;
      tab.isAgree="待同意";
      tab.invitedrole="省级干部"
      this.tableData.push(tab);
    },
    methods:{
      //判断是否获得通过请求
      isAgree(){
        var self=this;
        console.log(this.tableData[0].isAgree)
        axios.get('http://10.11.32.195:7002/provider/response?requestPhoneNum='+this.tableData[0].invitedphone).then(res =>{
               if(res.data.code==200){
                  self.tableData[0].isAgree="已同意";
                  self.disabled=false
                  window.localStorage.setItem('token',res.data.data.token)
                  window.localStorage.setItem('role',"老板");
               }else if(res.data.code==-200){
                  self.tableData[0].isAgree="已拒绝"
               }else if(res.data.code==444){
                 self.tableData[0].isAgree="待同意"
               }
        })

      },
      LoginIn(){
        window.localStorage.setItem('role','老板');
        location.reload();
        this.$router.replace('/all')
      },
      handleEditClick(index,row){
        console.log(row);
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
      handleClose(done) {
        done();
      },
      handleEditUser(){
        this.tableData.splice(this.editIndex,1,this.user)
        this.$message({showClose: true, message: "修改成功", type: 'success'});
        this.editBox = false
      },
      handleAddClick(){
        this.addBox = true
      },
      handleAddUser(){
        let strDate = dateFormat("YYYY-mm-dd",this.addUserData.date)
        this.addUserData.date = strDate
        this.tableData.push(this.addUserData)
        this.addBox = false
        this.addUserData = {}
        this.$message({showClose: true, message: "添加成功", type: 'success'});
      },
    }
  }

</script>

<style scoped>

</style>
