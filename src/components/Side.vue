<template>
  <div style="height: 100%">
    <el-row class="tac" style="height: 100%">
      <el-col :span="4" style="height: 100%">
        <el-menu
          :default-active="$route.path"
          router
          class="el-menu-vertical-demo"
          background-color="#00265f"
          @open="handleOpen"
          @close="handleClose"
        >
          <el-menu-item
            :index="item.path"
            v-for="item in menuList"
            :key="item.path"
          >
            <i :class="item.icon"></i>
            <span slot="title" class="MenuText">{{ item.name }}</span>
          </el-menu-item>
        </el-menu>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "side",
  data() {
    return {
      fixList: [
        {
          name: "用户管理",
          path: "/all/table",
          icon: "el-icon-s-custom"
        },
        {
          name: "角色管理",
          path: "/all/authority",
          icon: "el-icon-s-data"
        },
        {
          name: "用户分布",
          path: "/all/dataAnalysis",
          icon: "el-icon-map-location"
        },
        {
          name: "轨迹图",
          path: "/all/guiji",
          icon: "el-icon-place"
        },
        {
          name: "服务趋势",
          path: "/all/trendprediction",
          icon: "el-icon-menu"
        }
      ], // 固定菜单
      menuList: [], //菜单渲染
      rolePid: 0,
      roleCid: 0,
      notDealCount: 0
    };
  },

  created() {
    this.rolePid = window.localStorage.getItem("rolePid");
    this.roleCid = window.localStorage.getItem("roleCid");
    this.getMenuList();
  },

  // 页面关闭之前中断连接
  beforeDestroy() {
    this.onbeforeunload();
  },

  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },

    quit() {
      window.localStorage.setItem("token", null);
      window.localStorage.setItem("role", null);
      window.localStorage.setItem("userPhone", null);
      this.$message.success("欢迎您下次登录");
      this.$router.replace("/login");
    },
    getMenuList() {
      //高级用户渲染
      if (this.rolePid == 0) {
        //渲染一级菜单
        this.menuList = this.fixList.concat([
          {
            name: "请求管理",
            path: "/all/pleaseManage",
            icon: "el-icon-s-data"
          }
        ]);
      } else {
        this.menuList = this.fixList;
      }
    }
  }
};
</script>

<style scoped>
.el-menu-vertical-demo {
  height: 722px;
  width: 195px;
}

.MenuText {
  color: rgb(191, 203, 217);
}

.el-menu-item.is-active {
  color: #5560f4 !important;
}
</style>
