<template>
  <div class="table">
    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="关键字">
        <el-input v-model="searchObj.key" placeholder="手机号/用户名" />
      </el-form-item>

      <el-form-item label="用户状态">
        <el-select v-model="searchObj.status" placeholder="请选择" clearable>
          <el-option label="正常" value="0" />
          <el-option label="锁定" value="1" />
        </el-select>
      </el-form-item>

      <el-button type="primary" icon="el-icon-search" @click="fetchData()">
        查询
      </el-button>
      <el-button type="default" @click="resetData()">清空</el-button>
      <el-button
        type="success"
        plain
        @click="handleAddClick()"
        :disabled="buttonDisable"
        >新增用户</el-button
      >
    </el-form>
    <!--用户列表展示-->
    <!-- :cess-style是更改table的行间距 -->
    <el-table
      v-loading="loading"
      :data="list"
      style="width:100%;margin-top: 10px;"
      class="elTable"
      :cell-style="{ padding: '5px' }"
    >
      <el-table-column label="序号" width="50" align="center">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="username" label="用户名" align="center" />
      <el-table-column prop="phone" label="电话" align="center" />
      <el-table-column prop="userRole" label="用户角色" align="center" />
      <el-table-column label="所属级别" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.rolePid === 0 && scope.row.roleCid === 0">
            总部
          </span>
          <span v-if="scope.row.rolePid !== 0 && scope.row.roleCid === 0">
            省级
          </span>
          <span v-if="scope.row.roleCid !== 0">
            市级
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.isLock"
            type="danger"
            size="mini"
            :disabled="buttonDisable"
            @click="lockOrNot(scope.row.id, 0)"
          >
            解锁
          </el-button>
          <el-button
            v-else
            type="primary"
            size="mini"
            :disabled="buttonDisable"
            @click="lockOrNot(scope.row.id, 1)"
          >
            锁定
          </el-button>
          <el-button
            type="primary"
            icon="el-icon-edit"
            circle
            :disabled="buttonDisable"
            @click="handleEditClick(scope.row)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            circle
            :disabled="buttonDisable"
            @click="handleDelClick(scope.row.id)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="editBox" width="50%">
      <el-form ref="form" label-width="100px" v-model="rowUser">
        <el-form-item label="姓名:">
          <el-input
            placeholder="请输入姓名"
            maxlength="50"
            v-model="rowUser.username"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码:">
          <el-input
            placeholder="请输入密码"
            maxlength="50"
            v-model="rowUser.password"
          ></el-input>
        </el-form-item>
        <el-form-item label="电话:">
          <el-input
            placeholder="请输入电话"
            maxlength="50"
            v-model="rowUser.phone"
          ></el-input>
        </el-form-item>
        <el-form-item label="角色:">
          <el-radio-group v-model="radio">
            <el-radio :label="3" :disabled="pDisable">省级</el-radio>
            <el-radio :label="6" :disabled="cDisable">市级</el-radio>
          </el-radio-group>
          <el-select
            v-if="radio == 3"
            v-model="rowPid"
            :disabled="pDisable"
            placeholder="选择省份"
            style="margin-left:30px"
            @change="handleChange"
          >
            <el-option
              v-for="item in provinceList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
          <el-cascader
            v-if="radio == 6"
            v-model="casValue"
            :disabled="cDisable"
            :options="provinceList"
            :props="casProps"
            style="margin-left:30px"
            @change="handleChange"
            clearable
          >
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleEditUser(rowUser)"
          >确 定</el-button
        >
      </span>
    </el-dialog>

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
import api from "../request/api";
export default {
  name: "tabledata",
  data() {
    return {
      page: 1, //定义页数
      limit: 10, // 每页显示条数
      list: null, // 数据列表
      total: 0, // 数据库中的总记录数
      searchObj: {}, // 查询条件
      loading: true, // 加载状态
      addBox: false,
      editBox: false,
      radio: 3, // 3为选择省级，6为选择市级
      rowUser: {}, // 所选行的用户数据
      rowPid: null,
      rowCid: null,
      rolePid: 0, // 当前登录用户的pid
      roleCid: 0, // 当前登录用户的cid
      pDisable: false, // 省级radio被禁用
      cDisable: false, // 市级radio被禁用
      buttonDisable: false, // 被禁用的按钮
      provinceList: null, // 省份列表
      casValue: [], // 级联选择器数组
      casProps: {
        // 级联选择器显示成员  父和子要有相同的属性id，这样才能选中
        expandTrigger: "hover",
        value: "id",
        label: "name",
        children: "cityList"
      },
      afterChangeRole: null
    };
  },

  created() {
    this.fetchData();
    this.rolePid = window.localStorage.getItem("rolePid");
    this.roleCid = window.localStorage.getItem("roleCid");
    this.getProvince(this.rolePid, this.roleCid);
    if (this.rolePid != 0 && this.roleCid != 0) {
      this.buttonDisable = true;
    }
    if (this.rolePid != 0 && this.roleCid == 0) {
      this.pDisable = true;
    }
  },

  methods: {
    //每页显示的条数
    handleSizeChange(size) {
      this.limit = size;
      this.fetchData();
    },
    //显示第几页
    handleCurrentChange(page) {
      this.page = page;
      this.fetchData();
    },
    // 获取列表
    fetchData() {
      api.getUserList(this.page, this.limit, this.searchObj).then(response => {
        this.list = response.data.userList.list;
        this.total = response.data.userList.total;
      });
      this.loading = false;
    },

    // 清空SearchObj
    resetData() {
      this.searchObj = {};
    },

    // 修改用户
    handleEditClick(row) {
      // 获取到当前登录用户的角色
      this.cDisable = false;
      this.pDisable = false; // 点击编辑按钮时，首先清空之前操作
      this.editBox = true;
      this.rowUser = row; // 将当前被编辑的用户的所有属性给rowUser，rowUser会被传给后端
      // 设置是否可以选择
      // 如果登录用户为省级角色，则当前所选编辑用户省级radio置灰
      if (this.rolePid != 0 && this.roleCid == 0) {
        this.pDisable = true;
      }
      // 设置回显内容
      // 若当前编辑用户为总部，则置灰
      if (row.rolePid == 0 && row.roleCid == 0) {
        this.pDisable = true;
        this.cDisable = true;
        this.rowPid = row.rolePid;
        this.rowCid = row.roleCid;
      }
      if (row.rolePid != 0 && row.roleCid == 0) {
        this.radio = 3;
        this.rowPid = row.rolePid;
        this.rowCid = row.roleCid;
      }
      if (row.rolePid != 0 && row.roleCid != 0) {
        this.radio = 6;
        this.rowPid = row.rolePid;
        this.rowCid = row.roleCid;
        this.casValue[0] = this.rowPid;
        this.casValue[1] = this.rowCid;
      }
      // this.getProvince(this.rolePid, this.roleCid);
    },
    handleChange(val) {
      if (val instanceof Array) {
        this.rowUser.rolePid = val[0];
        this.rowUser.roleCid = val[1];
      } else {
        this.rowUser.rolePid = val;
        this.rowUser.roleCid = 0;
      }
    },
    handleEditUser(editUser) {
      console.log("用户被编辑后", editUser);
      api.createOrUpdate(editUser).then(response => {
        this.$message({
          message: response.message,
          type: "success",
          duration: 1 * 1000 // 弹窗持续时间
        });
        this.fetchData();
      });
      this.editBox = false;
      this.rowUser = {};
    },

    // 删除用户
    handleDelClick(id) {
      this.$confirm("此操作将删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // 点击确定删除时执行
          return api.deleteUser(id);
        })
        .then(response => {
          this.$message({
            message: response.message,
            type: "success",
            duration: 1 * 1000 // 弹窗持续时间
          });
          this.fetchData();
        });
    },

    // 锁定\解锁(用户)
    lockOrNot(id, flag) {
      api.lockOrNot(id, flag).then(() => {
        this.fetchData();
      });
    },

    // 获取省份
    getProvince(rolePid, roleCid) {
      api.getProvince(rolePid, roleCid).then(response => {
        this.provinceList = response.data.province;
      });
    },

    handleAddClick() {
      this.editBox = true;
      this.rowUser = {};
      this.rowPid = null;
      this.rowCid = null;
      this.casValue = [];
    }
  }
};
</script>

<style scoped>
.table {
  height: 1200px;
}
</style>
