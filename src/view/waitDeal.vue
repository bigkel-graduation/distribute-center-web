<template>
  <div class="login-register">
    <div class="contain">
      <div class="big-box">
        <div class="big-contain">
          <div class="span">
            <span id="span">您的申请已被管理员{{ dealMessage }}</span>
          </div>
          <div class="button">
            <el-button
              v-if="dealAction == true"
              type="primary"
              plain
              @click="intoSystem"
              >进入系统</el-button
            >
            <el-button type="success" plain @click="pleaseAgain"
              >重新申请</el-button
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import pleaseManageApi from "../request/pleaseManageApi";
export default {
  name: "waitdeal",
  data() {
    return {
      userInfo: null, // 当前请求者信息
      dealAction: false, // 对当前请求者的处置
      dealMessage: "接收,等待处理",
      pleaseToken: ""
    };
  },
  created() {
    this.userInfo = JSON.parse(window.localStorage.getItem("userInfo"));
    // 将当前请求者放入websocket，并给admin发送消息，表示自己等待响应中
    this.connectSocket(this.userInfo.username);
    this.sendOneMessage();
  },

  // 页面关闭之前中断连接
  beforeDestroy() {
    this.onbeforeunload();
  },

  methods: {
    sendOneMessage() {
      pleaseManageApi.sendOneMessage("admin").then(response => {
        console.log("response", response);
        if (response.code > 0) {
          console.log("waitDeal消息发送成功!");
        }
      });
    },
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
      console.log("请求者收到: " + event.data);
      if (event.data != "0") {
        this.dealAction = true;
        this.dealMessage = "同意";
        this.pleaseToken = event.data;
        document.getElementById("span").style.color = "rgb(57, 167, 176)";
      } else {
        this.dealMessage = "拒绝";
        document.getElementById("span").style.color = "red";
      }
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
    pleaseAgain() {
      this.$router.push("/sanfang");
    },
    intoSystem() {
      window.localStorage.setItem("token", this.pleaseToken);
      var userInfo = JSON.parse(window.localStorage.getItem("userInfo"));
      window.localStorage.setItem("rolePid", userInfo.rolePid);
      window.localStorage.setItem("roleCid", userInfo.roleCid);
      this.$router.replace("/all");
    }
  }
};
</script>

<style scoped="scoped">
.login-register {
  width: 100vw;
  height: 100vh;
  box-sizing: border-box;
  background-color: #eeeeee;
}
.contain {
  width: 650px;
  height: 400px;
  position: relative;
  top: 48%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  border-radius: 20px;
  box-shadow: 0 0 3px #f0f0f0, 0 0 6px #f0f0f0;
}
.big-contain {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.span {
  margin-top: 100px;
  color: rgb(107, 110, 241);
  font-size: 2.5em;
  font-weight: bold;
}
.button {
  margin-top: 120px;
}
</style>
