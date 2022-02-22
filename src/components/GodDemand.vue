<template>
  <div>
    <el-table
      :data="tableData"
      border
      style="width: 100%;margin-top:0px;">
      <el-table-column
        prop="requestName"
        label="请求者姓名"
        width="270">
      </el-table-column>
      <el-table-column
        prop="requestPhoneNum"
        label="请求者电话"
        width="240">
      </el-table-column>
      <el-table-column
        prop="invitedrole"
        label="请求角色">
      </el-table-column>

      <el-table-column
        label="操作">
        <el-button type="primary" plain @click="agree()">同意</el-button>
        <el-button type="success" plain @click="disagree()">拒绝</el-button>
      </el-table-column>
    </el-table>
  </div>

</template>

<script>
  import axios from 'axios'
  export default {
    name: 'godemand',
    data () {
      return {
        tableData: [],
        /*          {
            invitedname:'唐海林',
            invitedphone:1312211,
            invitedrole:'省级干部',
          },{
            invitedname:'唐海林',
            invitedphone:1312211,
            invitedrole:'省级干部',
          }*/
      }
    },
    created () {
      var self = this;
      var phone = window.localStorage.getItem('userPhone');
      axios.get('http://10.11.32.195:7001/consumer/getMessage?phoneNum=' + phone).then(res => {
        console.log(res.data)
        var tableData = res.data.data.requestEntities;
        for (var i = 0; i < tableData.length; i++) {
          var singleData = new Object();
 /*         if (tableData[i].role_Id == 1) {
            singleData.invitedrole = "省级干部"
          } else if (tableData[i].role_Id == 2) {
            singleData.invitedrole = "市级干部"
          } else {
            singleData.invitedrole = "同志"
          }*/
          singleData.invitedrole = "省级干部"
          singleData.requestName = tableData[i].requestName;
          singleData.requestPhoneNum = tableData[i].requestPhoneNum;
          singleData.responsePhoneNum = tableData[i].responsePhoneNum;
          singleData.startTime = tableData[i].startTime;
          self.tableData.push(singleData);
        }
      })
    },

    methods: {
      agree () {
        var token = window.localStorage.getItem('token')
        this.$axios({
          method: "get", //请求类型 get post
          url: "http://10.11.32.195:7001/consumer/success",   //后台接口地址
          //请求头（一般用于存放token等用户信息）
          headers: {
            'token': token
            //键值对方式，前面是键，后面是token，也可以存放固定的token
          },
          //给后台传的数据
        }).then(res => {
          this.$message.success(res.data.message)
          console.log(res)
        })
      },

      disagree () {
        var token = window.localStorage.getItem('token')
        this.$axios({
          method: "get", //请求类型 get post
          url: "http://10.11.32.195:7001/consumer/failed",   //后台接口地址
          //请求头（一般用于存放token等用户信息）
          headers: {
            'token': token
            //键值对方式，前面是键，后面是token，也可以存放固定的token
          },
          //给后台传的数据
        }).then(res => {
          this.$message(res.data.message)
        })

      }

    }
  }
</script>
