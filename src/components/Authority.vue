<template>
  <div class="back-box">
    <div class="side-box">
      <div class="group-button">
        <el-button
          type="success"
          plain
          @click="handleAddClick()"
          size="medium"
          style="margin-top: 18px; margin-left: 19px; width: 124px"
          :disabled="addRoleButton"
          >添加角色</el-button
        >
        <el-button
          type="danger"
          plain
          @click="handleDelClick()"
          size="medium"
          style="margin-top: 18px; width: 124px;"
          :disabled="delRoleButton"
          >删除角色</el-button
        >
      </div>

      <el-input
        placeholder="输入关键字进行过滤"
        prefix-icon="el-icon-search"
        v-model="filterText"
        class="filter-text"
        clearable
        size="medium"
      >
      </el-input>
      <el-tree
        :data="roleList"
        :props="treeRole"
        @node-click="handleNodeClick"
        class="tree"
        ref="tree"
        default-expand-all
        :filter-node-method="filterNode"
      ></el-tree>
      <div class="side-divider">
        <el-divider></el-divider>
      </div>
      <div class="find-box">
        <el-button
          type="primary"
          plain
          style="width: 88%"
          @click="findUserByRole(click_pid, click_cid)"
          >查找关联用户</el-button
        >
      </div>
    </div>
    <div class="table">
      <div class="table-divider">
        <span style="float: right"> 共计结果: {{ userTotal }}条</span>
        <el-divider></el-divider>
      </div>
      <div class="box-card">
        <template v-for="(item, index) in userList">
          <el-card class="card" :key="index">
            <div slot="header" class="card-header">
              <span style="font-size: 20px">{{ item.username }}</span>
              <el-button
                style="float: right; padding: 3px 0;font-size: 16px; color: red"
                type="text"
                @click="delUser(item)"
                :disabled="delButton"
                >删除</el-button
              >
            </div>
            <div style="margin-bottom:12px" class="text item">
              <span style="color: rgb(16, 119, 255)">当前所在地: </span>
              {{ item.toAddress }}
            </div>
            <div style="margin-bottom:12px" class="text item">
              <span style="color: rgb(16, 119, 255)">联系方式: </span>
              {{ item.phone }}
            </div>
            <div class="text item">
              <span style="color: rgb(16, 119, 255)">用户描述: </span>
              {{ item.description == null ? "暂无" : item.description }}
            </div>
          </el-card>
        </template>
      </div>
    </div>

    <el-dialog :visible.sync="addBox" width="50%">
      <el-form ref="form" label-width="100px" v-model="role">
        <el-form-item label="级别:">
          <el-radio-group v-model="radio">
            <el-radio :label="3" :disabled="pDisable">省级</el-radio>
            <el-radio :label="6" :disabled="cDisable">市级</el-radio>
          </el-radio-group>
          <el-select
            v-if="radio == 3"
            v-model="role.pid"
            :disabled="pDisable"
            placeholder="选择省份"
            style="margin-left:30px"
            @change="handleChange"
          >
            <el-option
              v-for="item in canAddRoleList"
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
            :options="canAddRoleList"
            :props="casProps"
            style="margin-left:30px"
            @change="handleChange"
            clearable
          >
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleAddRole(role)">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog :visible.sync="delBox" width="50%">
      <el-form ref="form" label-width="100px" v-model="role">
        <el-form-item label="级别:">
          <el-radio-group v-model="radio">
            <el-radio :label="3" :disabled="pDisable">省级</el-radio>
            <el-radio :label="6" :disabled="cDisable">市级</el-radio>
          </el-radio-group>
          <el-select
            v-if="radio == 3"
            v-model="role.pid"
            :disabled="pDisable"
            placeholder="选择省份"
            style="margin-left:30px"
            @change="handleChange"
          >
            <el-option
              v-for="item in roleList"
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
            :options="roleList"
            :props="casProps"
            style="margin-left:30px"
            @change="handleChange"
            clearable
          >
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleDelRole(role)">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import roleManageApi from "../request/roleManageApi";
import userManageApi from "../request/userManageApi";
export default {
  name: "authority",
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  data() {
    return {
      roleList: [],
      // 1, 2, 3, 4, 5, 6, 7, 8, 9, 4, 5, 6, 1, 2, 3
      userList: [],
      filterText: "",
      userTotal: 0,
      treeRole: {
        id: "id",
        children: "cityList",
        label: "name"
      },
      role_pid: 0,
      role_cid: 0,
      click_pid: 0,
      click_cid: 0,
      delButton: false,
      addRoleButton: false,
      delRoleButton: false,
      pDisable: false, // 省级radio
      cDisable: false, // 市级radio
      radio: 3,
      role: {
        pid: null,
        cid: null
      },
      canAddRoleList: [], // 能够添加的角色列表
      casValue: [], // 级联选择器数组
      casProps: {
        // 级联选择器显示成员  父和子要有相同的属性id，这样才能选中
        expandTrigger: "hover",
        value: "id",
        label: "name",
        children: "cityList"
      },
      addBox: false,
      delBox: false
    };
  },

  created() {
    this.role_pid = window.localStorage.getItem("rolePid");
    this.role_cid = window.localStorage.getItem("roleCid");
    if (this.role_cid != 0) {
      this.addRoleButton = true;
      this.delRoleButton = true;
    }
    if (this.role_pid != 0 && this.role_cid == 0) {
      this.pDisable = true;
    }
    this.fetchData();
  },

  methods: {
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },

    // 初始化列表
    fetchData() {
      userManageApi.getProvince(this.role_pid, this.role_cid).then(response => {
        this.roleList = response.data.province;
      });
      this.findUserByRole(this.click_pid, this.click_cid);
      roleManageApi.canAddRole(this.role_pid, this.role_cid).then(response => {
        this.canAddRoleList = response.data.canAddRole;
      });
    },

    // 点击树形后，准备查询数据
    handleNodeClick(val) {
      if (val.pid == null) {
        // 所选是省，id就是pid
        this.click_pid = val.id;
        this.click_cid = 0;
      } else {
        // 所选是市，id市cid，pid是pid
        this.click_pid = val.pid;
        this.click_cid = val.id;
      }
    },

    // 查询
    findUserByRole(click_pid, click_cid) {
      this.delButton = false;
      roleManageApi.getUserListByRole(click_pid, click_cid).then(response => {
        this.userList = response.data.userList;
        this.userTotal = response.data.total;
        let index;
        for (index in this.userList) {
          if (
            this.userList[index].rolePid == 0 &&
            this.userList[index].roleCid == 0 // 总部角色卡片永远不能被删除
          ) {
            this.delButton = true;
          } else if (this.role_cid != 0) {
            this.delButton = true; // 市级用户不能删除任何用户卡片
          } else if (
            this.role_pid != 0 &&
            this.role_cid == 0 &&
            this.userList[index].roleCid == 0 // 省级用户不能删除同为省级的角色卡片
          ) {
            this.delButton = true;
          }
        }
      });
    },

    // 删除用户卡片
    delUser(val) {
      console.log("当前被删除的用户", val.id);
      this.$confirm("此操作将删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // 点击确定删除时执行
          return roleManageApi.delUser(val.id);
        })
        .then(response => {
          this.$message({
            message: response.message,
            type: response.code > 0 ? "success" : "error",
            duration: 1 * 1000 // 弹窗持续时间
          });
          this.fetchData();
        });
    },

    // 新增角色
    handleAddClick() {
      this.addBox = true;
    },
    handleChange(val) {
      if (val instanceof Array) {
        this.role.pid = val[0];
        this.role.cid = val[1];
      } else {
        this.role.pid = val;
        this.role.cid = 0;
      }
      console.log("当前选择的角色", val);
    },
    handleAddRole(role) {
      console.log("用户新增的角色", role);
      roleManageApi.addRole(role.pid, role.cid).then(response => {
        this.$message({
          message: response.message,
          type: response.code > 0 ? "success" : "error",
          duration: 1 * 1000 // 弹窗持续时间
        });
        this.fetchData();
      });
      this.addBox = false;
      this.role.pid = null;
      this.role.cid = null;
    },

    // 删除角色
    handleDelClick() {
      this.delBox = true;
    },
    handleDelRole(role) {
      console.log("当前删除的角色", role);
      let tip = "";
      if (role.cid == 0) {
        tip = "以及其下级角色及其用户,";
      }
      this.$confirm(`此操作将删除: 该角色及其用户,${tip} 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // 点击确定删除时执行
          return roleManageApi.delRole(role.pid, role.cid);
        })
        .then(response => {
          this.$message({
            message: response.message,
            type: response.code > 0 ? "success" : "error",
            duration: 1 * 1000 // 弹窗持续时间
          });
          this.fetchData();
          this.role.pid = null;
          this.role.cid = null;
        });
      this.delBox = false;
    }
  }
};
</script>

<style scoped>
.back-box {
  height: 612px;
  background-color: whitesmoke;
  display: flex;
}
.side-box {
  width: 22%;
  height: 100%;
  box-shadow: 10px 10px 10px #ddd;
  border-radius: 5px;
  background-color: white;
}
.group-button >>> .el-button {
  margin-left: -7px;
}
.tree {
  margin-top: 21px;
  margin-left: 19px;
  margin-right: 19px;
  height: 66%;
  background-color: white;
  overflow: auto;
}
.table {
  width: 78%;
  height: 100%;
  box-shadow: -10px 10px 10px #ddd;
  border-radius: 5px;
  background-color: white;
  margin-left: 20px;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  align-content: flex-start;
}
.filter-text {
  margin-top: 20px;
  margin-left: 19px;
  margin-right: 20px;
  width: 87%;
}
.find-box {
  margin-top: 13px;
  margin-left: 30px;
}
.side-divider >>> .el-divider {
  margin-top: 13px;
  margin-bottom: 13px;
  width: 91%;
  margin-left: 12px;
}
.table-divider {
  margin-bottom: -33px;
  margin-left: 19px;
  width: 96%;
  height: 9%;
  margin-top: 30px;
}
.table-divider >>> .el-divider {
  margin: 21px 0;
}

.card {
  width: 30%;
  height: 30%;
  margin-top: 12px;
  margin-left: 23px;
}
.box-card {
  width: 100%;
  margin-left: 3px;
  height: 560px;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  align-content: flex-start;
  overflow: auto;
}
.card >>> .el-card__header {
  padding: 8px 14px;
  border-bottom: 1px solid #ebeef5;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
</style>
