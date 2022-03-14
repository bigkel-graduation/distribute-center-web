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
            v-for="item in menuList1"
            :key="item.path"
          >
            <i :class="item.icon"></i>
            <span slot="title" class="MenuText">{{ item.name }}</span>
          </el-menu-item>
          <el-submenu
            :index="item.path"
            v-for="item in menuList2"
            :key="item.path"
          >
            <template slot="title">
              <i :class="item.icon"></i>
              <span class="MenuText">{{ item.name }}</span>
            </template>
            <el-menu-item-group>
              <el-menu-item
                :index="item.path"
                v-for="it in item.sub"
                :key="it.path"
                ><span class="MenuText">{{ it.name }}</span></el-menu-item
              >
            </el-menu-item-group>
          </el-submenu>
          <!-- <el-button plain @click.native="quit()" style="margin-top: 80px;margin-left: 40px;"><i class="el-icon-switch-button"></i><span style="margin-left: 10px;">退出登录</span></el-button>-->
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
      menuList1: [], //一级菜单渲染
      menuList2: [], //二级菜单渲染
      role: ""
    };
  },

  created() {
    this.role = window.localStorage.getItem("role");
    this.getMenuList();
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
      if (this.role != "第三方用户") {
        //渲染一级菜单
        (this.menuList1 = [
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
            name: "数据分析",
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
          },
          {
            name: "登录数据列表",
            path: "/all/loginalllist",
            icon: "el-icon-s-check"
          },
          {
            name: "请求管理",
            path: "/all/Godemand",
            icon: "el-icon-s-data"
          }
        ]),
          //渲染包含二级菜单的项
          (this.menuList2 = [
            {
              name: "访问数据列表",
              path: "3",
              icon: "el-icon-setting",
              sub: [
                {
                  name: "个人数据列表",
                  path: "/all/persondata",
                  icon: ""
                },
                {
                  name: "整体数据列表",
                  path: "/all/alldata",
                  icon: ""
                }
              ]
            }
          ]);
      } else if (this.role == "第三方用户") {
        this.menuList1 = [
          {
            name: "请求管理",
            path: "/all/demand",
            icon: "el-icon-s-data"
          }
        ];
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
