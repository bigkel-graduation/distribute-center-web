<template>
  <div class="login-register">
    <div class="contain">
      <div class="big-box">
        <div class="big-contain">
          <div class="btitle">分布式用户中心</div>
          <div class="bform">
            <el-input
              class="input"
              v-model="info.phone"
              placeholder="请输入电话号码"
            ></el-input>
            <el-input
              type="password"
              class="input"
              v-model="info.password"
              placeholder="请输入密码"
            ></el-input>
          </div>
          <button class="bbutton" @click="loadBtn()">登录</button>
          <a @click="transfer()" style="margin-top: 30px;"
            >还没账号?请求第三方登录</a
          >
        </div>
      </div>
      <div class="small-box">
        <div class="small-contain">
          <div class="stitle">欢迎回来!</div>
          <p class="scontent">与我们保持联系，请登录你的账户</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import userManageApi from "../request/userManageApi";
export default {
  name: "login",
  data() {
    return {
      info: {
        phone: "66666666666",
        password: "admin"
      }
    };
  },
  methods: {
    //登录事件
    loadBtn() {
      if (this.info.phone.length == 0 || this.info.password.length == 0) {
        this.$message.error("请输入完整用户名和密码");
      } else {
        self = this;
        userManageApi.login(this.info).then(res => {
          if (res.code == 200) {
            this.$message.success(res.message);
            var data = res.data;
            var token = data.userInformation.token;
            var rolePid = data.userInformation.rolePid;
            var roleCid = data.userInformation.roleCid;
            window.localStorage.setItem("token", token);
            window.localStorage.setItem("rolePid", rolePid);
            window.localStorage.setItem("roleCid", roleCid);
            setTimeout(function() {
              self.$router.replace("/all");
            }, 400);
          } else {
            this.$message.error(res.message);
          }
        });
      }
    },

    transfer() {
      this.$router.push("/sanfang");
    }
  }
};
</script>

<style scoped>
.input {
  width: 300px;
}
.login-register {
  width: 100vw;
  height: 100vh;
  box-sizing: border-box;
  background-color: #eeeeee;
}
.contain {
  width: 60%;
  height: 60%;
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  border-radius: 20px;
  box-shadow: 0 0 3px #f0f0f0, 0 0 6px #f0f0f0;
}
.big-box {
  width: 70%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 30%;
  transform: translateX(0%);
  transition: all 1s;
}
.big-contain {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.btitle {
  font-size: 1.5em;
  font-weight: bold;
  color: rgb(57, 167, 176);
}
.bform {
  width: 100%;
  height: 40%;
  padding: 2em 0;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}
.bform .errTips {
  display: block;
  width: 50%;
  text-align: left;
  color: red;
  font-size: 0.7em;
  margin-left: 1em;
}
.bform input {
  width: 50%;
  height: 30px;
  border: none;
  outline: none;
  border-radius: 10px;
  padding-left: 2em;
  background-color: #f0f0f0;
}
.bbutton {
  width: 20%;
  height: 40px;
  border-radius: 24px;
  border: none;
  outline: none;
  background-color: rgb(57, 167, 176);
  color: #fff;
  font-size: 0.9em;
  cursor: pointer;
}
.small-box {
  width: 30%;
  height: 100%;
  background: linear-gradient(135deg, rgb(57, 167, 176), rgb(56, 183, 145));
  position: absolute;
  top: 0;
  left: 0;
  transform: translateX(0%);
  transition: all 1s;
  border-top-left-radius: inherit;
  border-bottom-left-radius: inherit;
}
.small-contain {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.stitle {
  font-size: 1.5em;
  font-weight: bold;
  color: #fff;
}
.scontent {
  font-size: 0.8em;
  color: #fff;
  text-align: center;
  padding: 2em 4em;
  line-height: 1.7em;
}
.sbutton {
  width: 60%;
  height: 40px;
  border-radius: 24px;
  border: 1px solid #fff;
  outline: none;
  background-color: transparent;
  color: #fff;
  font-size: 0.9em;
  cursor: pointer;
}

.big-box.active {
  left: 0;
  transition: all 0.5s;
}
.small-box.active {
  left: 100%;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-top-right-radius: inherit;
  border-bottom-right-radius: inherit;
  transform: translateX(-100%);
  transition: all 1s;
}
</style>
