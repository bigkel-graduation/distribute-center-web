<template>
  <div>
    <el-header style="background-color: rgb(1 30 73);height: 55px">
      <img
        src="../assets/分布式监测.png"
        style="width: 40px;height: 40px;margin-top: 7px;"
      />
      <span
        style="color:#cecece;font-size: 22px;float:right;margin-right: 1295px;margin-top:12px;"
        >分布式用户中心</span
      >
      <el-avatar
        src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
        style="float:right;margin-top: -42px;margin-right:155px;"
      ></el-avatar>
      <el-badge
        :value="notDealCount"
        :max="99"
        v-if="rolePid == 0 && notDealCount != 0"
        style="float:right;margin-top: -39px;margin-right:67px;"
      >
        <el-button @click="openMessage" type="primary" plain size="small"
          >消息<i class="el-icon-bell el-icon--right"></i
        ></el-button>
      </el-badge>
      <el-badge
        v-if="rolePid == 0 && notDealCount == 0"
        style="float:right;margin-top: -39px;margin-right:67px;"
      >
        <el-button
          @click="openMessage"
          type="primary"
          plain
          size="small"
          :disabled="true"
          >消息<i class="el-icon-bell el-icon--right"></i
        ></el-button>
      </el-badge>
      <el-button
        type="danger"
        plain
        size="small"
        @click="quit()"
        style="float:right;margin-top:-39px;margin-right: -15px;"
        >退出<i class="el-icon-switch-button el-icon--right"></i
      ></el-button>
    </el-header>
    <el-container>
      <el-aside style="width:180px;"><side></side></el-aside>
      <el-container class="app_content">
        <el-main class="main">
          <router-view v-if="isRouterAlive"></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import side from "../components/Side.vue";
import tabledata from "../components/Table.vue";
import pleaseManageApi from "../request/pleaseManageApi";
export default {
  data() {
    return {
      notDealCount: 0,
      rolePid: 0,
      isRouterAlive: true
    };
  },
  name: "all",
  components: {
    side,
    tabledata
  },
  created() {
    document.body.parentNode.style.overflow = "hidden";
    this.rolePid = window.localStorage.getItem("rolePid");
    if (this.rolePid == 0) {
      // 当登录用户为admin，则将admin放入websocket
      this.connectSocket("admin");
    }
    // 获取消息数量，不然单靠websocket，刷新会变成0
    pleaseManageApi.getMessageCount().then(response => {
      this.notDealCount = response;
    });
  },
  methods: {
    quit() {
      window.localStorage.setItem("token", null);
      window.localStorage.setItem("role", null);
      window.localStorage.setItem("userPhone", null);
      this.$message.success("欢迎您下次登录");
      this.$router.replace("/login");
    },
    openMessage() {
      this.reload();
      this.$router.replace("/all/pleaseManage");
    },
    // Side用来代表admin用户接收websocket的消息
    initWebSocket() {
      this.websocket.onerror = this.setErrorMessage;
      this.websocket.onopen = this.setOnopenMessage;
      this.websocket.onmessage = this.setOnmessageMessage;
      this.websocket.onclose = this.setOncloseMessage;
      window.onbeforeunload = this.onbeforeunload;
    },
    setErrorMessage() {
      console.log(
        "WebSocket连接发生错误   状态码：" + this.websocket.readyState
      );
    },
    setOnopenMessage() {
      console.log("WebSocket连接成功    状态码：" + this.websocket.readyState);
    },
    setOnmessageMessage(event) {
      // 根据服务器推送的消息做自己的业务处理
      console.log("admin收到: " + event.data);
      this.notDealCount = parseInt(event.data);
    },
    setOncloseMessage() {
      console.log("WebSocket连接关闭    状态码：" + this.websocket.readyState);
    },
    closeWebSocket() {
      this.websocket.close();
    },

    onbeforeunload() {
      this.closeWebSocket();
    },
    connectSocket(username) {
      // WebSocket
      if ("WebSocket" in window) {
        this.websocket = new WebSocket(
          "ws://localhost:8901/websocket/" + username
        );
        this.initWebSocket();
      } else {
        alert("当前浏览器 Not support websocket");
      }
    },
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(function() {
        this.isRouterAlive = true;
      });
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
