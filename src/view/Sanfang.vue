<template>
  <div class="login-register">
    <div class="contain">
      <div class="big-box">
        <div class="big-contain">
          <div class="btitle">第三方登录</div>
          <div class="bform">
            <el-input
              placeholder="用户名"
              v-model="userInfo.username"
              clearable
              class="input"
            >
            </el-input>
            <el-input
              placeholder="手机号"
              v-model="userInfo.phone"
              clearable
              class="input"
            >
            </el-input>
            <el-radio-group v-model="radio" class="input">
              <el-radio :label="3">省级</el-radio>
              <el-radio :label="6">市级</el-radio>
            </el-radio-group>
            <el-select
              v-if="radio == 3"
              v-model="selectPid"
              placeholder="选择省份"
              @change="handleChange"
              style="margin-left:0px"
              class="select"
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
              v-model="select"
              placeholder="选择城市"
              :options="provinceList"
              :props="casProps"
              style="margin-left:0px"
              @change="handleChange"
              clearable
              class="select"
            >
            </el-cascader>
          </div>
          <div style="display:flex;width:400px;margin-left:-110px">
            <button class="bbutton" @click="please()">申请</button>
            <button class="bbutton" @click="cancel()">返回</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import userManageApi from "../request/userManageApi";
import pleaseManageApi from "../request/pleaseManageApi";
export default {
  name: "sanfang",
  data() {
    return {
      userInfo: {
        username: "三方用户",
        phone: "123456",
        rolePid: 0,
        roleCid: 0
      },
      selectPid: null, // 选择器会根据此值来显示，和val一样
      select: [], // 存放级联选择器选择后的数组，和val一样
      radio: 3,
      provinceList: null, // 省份列表
      casProps: {
        // 级联选择器显示成员  父和子要有相同的属性id，这样才能选中
        expandTrigger: "hover",
        value: "id",
        label: "name",
        children: "cityList"
      }
    };
  },
  created() {
    this.getProvince();
  },

  methods: {
    handleChange(val) {
      if (val instanceof Array) {
        this.userInfo.rolePid = val[0];
        this.userInfo.roleCid = val[1]; // 选择了市级权限
        this.selectPid = val[0];
      } else {
        this.userInfo.rolePid = val;
        this.selectPid = val;
      }
    },

    getProvince() {
      userManageApi.getProvince(0, 0).then(response => {
        this.provinceList = response.data.province;
      });
    },

    please() {
      if (this.userInfo.username == "" || this.userInfo.phone == "") {
        this.$message.error("请输入完整信息");
      } else if (this.userInfo.rolePid == 0 && this.userInfo.roleCid == 0) {
        this.$message.error("请选择请求角色");
      } else {
        window.localStorage.setItem("userInfo", JSON.stringify(this.userInfo));
        pleaseManageApi.saveRequestMessage(this.userInfo).then(response => {
          this.$message({
            message: response.message,
            type: response.code > 0 ? "success" : "error",
            duration: 1 * 1000 // 弹窗持续时间
          });
          if (response.code > 0) {
            this.$router.push("/waitdeal");
          }
        });
      }
    },
    cancel() {
      this.$router.push("/login");
    }
  }
};
</script>

<style scoped="scoped">
.input {
  margin-top: 15px;
  width: 50%;
}
.select {
  margin-top: 15px;
  width: 50%;
  margin-left: -110px;
}
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
.clonm {
  margin-top: 20px;
}
.btitle {
  font-size: 1.5em;
  font-weight: bold;
  margin-top: 50px;
  color: rgb(57, 167, 176);
}
.bform {
  width: 100%;
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
.bform input,
.bform select {
  width: 50%;
  height: 30px;
  border: none;
  outline: none;
  border-radius: 10px;
  padding-left: 2em;
  background-color: #f0f0f0;
}
.bbutton {
  width: 40%;
  height: 40px;
  border-radius: 24px;
  border: none;
  outline: none;
  background-color: rgb(57, 167, 176);
  color: #fff;
  font-size: 1.2em;
  cursor: pointer;
  margin-left: 28%;
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
</style>
