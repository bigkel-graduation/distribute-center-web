<template>
  <div>
    <el-header style="background-color: #00265f">
      <img
        src="../assets/分布式监测.png"
        style="width: 40px;height: 40px;margin-top: 7px;"
      />
      <span
        style="color:#cecece;font-size: 22px;float:right;margin-right: 1295px;margin-top:13px;"
        >分布式用户中心</span
      >
      <el-avatar
        src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
        style="float:right;margin-top: -40px;margin-right:120px;"
      ></el-avatar>
      <el-button
        @click="quit()"
        style="float:right;margin-top:-40px;margin-right: 4px;"
        >退出登录</el-button
      >
    </el-header>
    <el-container>
      <el-aside style="width:190px;"><side></side></el-aside>
      <el-container class="app_content">
        <!--头部区域-->
        <!--  <el-header style="box-shadow: 0 1px 2px rgba(205,205,205,205);height: 30px;background-color: #00265f;margin-left: -8px;">  &lt;!&ndash;头部导航栏&ndash;&gt;
          <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" style="margin-top: 20px;margin-left: 1180px;"></el-avatar>
           <div style="float:right;margin-top: 30px;margin-right: 0px;">
             <el-dropdown>
              <span class="el-dropdown-link">
                用户名<i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>
              </span>
               <el-dropdown-menu slot="dropdown">
                 <el-dropdown-item>用户名</el-dropdown-item>
                 <el-dropdown-item>电话</el-dropdown-item>
                 <el-dropdown-item @click.native="quit()">退出登录</el-dropdown-item>
               </el-dropdown-menu>
             </el-dropdown>
           </div>
        </el-header>

         内容区域 -->
        <el-main class="main">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import side from "../components/Side.vue";
import tabledata from "../components/Table.vue";
export default {
  name: "all",
  components: {
    side,
    tabledata
  },
  created() {
    document.body.parentNode.style.overflow = "hidden";
  },
  methods: {
    quit() {
      window.localStorage.setItem("token", null);
      window.localStorage.setItem("role", null);
      window.localStorage.setItem("userPhone", null);
      this.$message.success("欢迎您下次登录");
      this.$router.replace("/login");
    }
  }
};
</script>

<style>
.app_content {
  height: 1000px;
  margin-left: 0px;
  border: 1px solid #eee;
  box-sizing: border-box;
}
.main {
  width: 800px;
  background-color: whitesmoke;
}
</style>
