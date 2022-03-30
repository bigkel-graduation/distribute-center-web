<template>
  <div class="table">
    <!--查询表单-->
    <el-form :inline="true">
      <el-form-item label="关键字" style="margin-top: 10px;margin-left: 10px">
        <el-input
          size="medium"
          v-model="searchObj.key"
          placeholder="手机号/用户名"
        />
      </el-form-item>

      <el-form-item label="处置状态" style="margin-top: 10px;">
        <el-select
          size="medium"
          v-model="searchObj.status"
          placeholder="请选择"
          clearable
        >
          <el-option label="未处置" value="0" />
          <el-option label="已处置" value="1" />
        </el-select>
      </el-form-item>

      <el-button
        type="primary"
        icon="el-icon-search"
        @click="fetchData(1, limit)"
        style="margin-top: 13px;"
        size="medium"
      >
        查询
      </el-button>
      <el-button
        type="default"
        @click="resetData()"
        style="margin-top: 13px;"
        size="medium"
        >清空</el-button
      >
    </el-form>
    <!--用户列表展示-->
    <!-- :cess-style是更改table的行间距 -->
    <el-table
      :data="list"
      height="450"
      style="width:100%;margin-top: 10px;"
      class="elTable"
      :cell-style="{ padding: '8px' }"
    >
      <el-table-column label="序号" width="55" align="center">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="username" label="用户名" align="center" />
      <el-table-column prop="phone" label="电话" align="center" />
      <el-table-column prop="userRole" label="申请角色" align="center" />
      <el-table-column prop="createTime" label="申请时间" align="center" />
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.stats == true" type="info">已处置</el-tag>
          <el-tag
            v-if="scope.row.action == true && scope.row.stats == true"
            type="success"
            >已同意</el-tag
          >
          <el-tag
            v-if="scope.row.action == false && scope.row.stats == true"
            type="danger"
            >已拒绝</el-tag
          >
          <el-button
            v-if="scope.row.stats == true"
            type="danger"
            icon="el-icon-delete"
            circle
            size="small"
            @click="handleDelClick(scope.row.id)"
          ></el-button>
          <el-button
            v-if="scope.row.stats == false"
            type="primary"
            size="mini"
            @click="dealResult(scope.row.id, 1)"
          >
            同意
          </el-button>
          <el-button
            v-if="scope.row.stats == false"
            type="danger"
            size="mini"
            @click="dealResult(scope.row.id, 0)"
          >
            拒绝
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      align="center"
      :current-page="page"
      :total="total"
      :page-size="limit"
      :page-sizes="[5, 10, 15]"
      style="padding: 30px 0; "
      layout="total, sizes, prev, pager, next, jumper"
    >
    </el-pagination>
  </div>
</template>
<script>
import pleaseManageApi from "../request/pleaseManageApi";
export default {
  name: "pleaseManage",
  data() {
    return {
      page: 1, //定义页数
      limit: 10, // 每页显示条数
      list: [], // 数据列表
      total: 0, // 数据库中的总记录数
      searchObj: {} // 查询条件
    };
  },
  created() {
    this.fetchData(this.page, this.limit);
  },

  methods: {
    //每页显示的条数
    handleSizeChange(size) {
      this.limit = size;
      this.fetchData(1, this.limit);
    },
    //显示第几页
    handleCurrentChange(page) {
      this.page = page;
      this.fetchData(this.page, this.limit);
    },
    // 获取列表
    fetchData(page, limit) {
      this.page = page;
      this.limit = limit;
      pleaseManageApi
        .getMessageLists(this.page, this.limit, this.searchObj)
        .then(response => {
          this.list = response.data.messageList.list;
          this.total = response.data.messageList.count;
        });
    },

    // 清空SearchObj
    resetData() {
      this.searchObj = {};
    },

    // 处置请求消息
    dealResult(id, flag) {
      pleaseManageApi.dealRequestMessage(id, flag).then(response => {
        this.$message({
          message: response.message,
          type: response.code > 0 ? "success" : "error",
          duration: 1 * 1000 // 弹窗持续时间
        });
        this.fetchData(this.page, this.limit);
        // 再次给admin发送消息，更改消息的数量显示
        pleaseManageApi.sendOneMessage("admin").then(response => {
          console.log("response", response);
          if (response.code > 0) {
            console.log("pleaseManage消息发送成功!");
          }
        });
      });
    },

    // 删除信息
    handleDelClick(id) {
      this.$confirm("此操作将删除该请求, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // 点击确定删除时执行
          return pleaseManageApi.deleteMessage(id);
        })
        .then(response => {
          this.$message({
            message: response.message,
            type: "success",
            duration: 1 * 1000 // 弹窗持续时间
          });
          this.fetchData(this.page, this.limit);
        });
    }
  }
};
</script>

<style scoped>
.table {
  height: 612px;
  box-shadow: 25px 25px 20px #ddd;
  background-color: white;
  border-radius: 5px;
}
</style>
