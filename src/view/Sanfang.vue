<template>
  <div class="login-register">
    <div class="contain">
      <div class="big-box">
        <div class="big-contain">
          <div class="btitle">第三方登录</div>
          <div class="bform">
            <input  type="text" placeholder="用户名" v-model="user.requestName" class="input" >
            <input  type="text" placeholder="手机号" v-model="user.requestPhoneNum" class="input">
            <!--                        <select id="select" class="input" style="width:203.65px;height:30px">
                                   <option value='' disabled selected style='display:none;'>请求角色</option>
                                   <option value="1" select='selected'>省级干部</option>
                                   <option value="2">市级干部</option>
                                   <option value="3">同志</option>
                                   </select> -->
            <select name="" id="" @change="chooseCore($event)" style="width:203.65px;height:30px;margin-top:10px;">
              <option :value="item.value"  v-for="(item,index) in msgList" :key="item.value">{{item.label}}</option>
            </select>

            <input  type="text" placeholder="被请求者手机号" v-model="user.responsePhoneNum" @keydown.enter.native="doLogin" class="input">
          </div>
          <div style="display:flex;width:400px;margin-left:220px;">
            <button class="bbutton"  @click="doLogin()" >登录</button>
            &nbsp; &nbsp; &nbsp;
            <button class="bbutton" @click="retu()">返回</button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
<script>
  import axios from 'axios'
  export default {
    name:'sanfang',
    data() {
      //相当于以前的function data(){},这是es5之前的写法，新版本可以省略掉function
      return{
        msgList: [{
          value: '1',
          label: '省级干部'
        }, {
          value: '2',
          label: '市级干部'
        }, {
          value: '3',
          label: '同志'
        }],
        value:'',
        user:{
          requestName:'陈佳宽',
          requestPhoneNum:'123456',
          responsePhoneNum:'15068598954',
          role_Id:0
        }
      }
    },
    methods:{
      chooseCore(event){
        alert(event.target.value);
        this.user.role_Id=event.target.value;
      },


      doLogin(){
        self=this
        if(this.user.requestName.length==0||this.user.requestPhoneNum.length==0||this.user.responsePhoneNum.length==0||this.user.role_Id.length==0){
          this.$message.error("请输入完整信息");
        }else {
          window.localStorage.setItem('Sanfanglogin',JSON.stringify(this.user))  //将三方登录信息存入浏览器
          self=this;
          console.log(this.user)
          axios.post('http://10.11.32.195:7002/provider/request',this.user).then(res=>{
            window.localStorage.setItem('role',"第三方用户");
            window.localStorage.setItem('token','tempory');
            self.$router.replace('/all/demand')
          })

        }
      },

      retu(){
        this.$router.push('/login');
      }
    }
  }
</script>

<style scoped="scoped">

  .input{
    margin-top:15px;
  }
  .login-register{
    width: 100vw;
    height: 100vh;
    box-sizing: border-box;
    background-color: #eeeeee;
  }
  .contain{
    width: 350px;
    height: 450px;
    position: relative;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    background-color: #fff;
    border-radius: 20px;
    box-shadow: 0 0 3px #f0f0f0,
    0 0 6px #f0f0f0;
  }

  .big-contain{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .clonm{
    margin-top: 20px;
  }
  .btitle{
    font-size: 1.5em;
    font-weight: bold;
    margin-top: 50px;
    color: rgb(57,167,176);
  }
  .bform{
    width: 100%;
    padding: 2em 0;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
  }
  .bform .errTips{
    display: block;
    width: 50%;
    text-align: left;
    color: red;
    font-size: 0.7em;
    margin-left: 1em;
  }
  .bform input, .bform select{
    width: 50%;
    height: 30px;
    border: none;
    outline: none;
    border-radius: 10px;
    padding-left: 2em;
    background-color: #f0f0f0;
  }
  .bbutton{
    width: 20%;
    height: 40px;
    border-radius: 24px;
    border: none;
    outline: none;
    background-color: rgb(57,167,176);
    color: #fff;
    font-size: 0.9em;
    cursor: pointer;
  }
  .small-box{
    width: 30%;
    height: 100%;
    background: linear-gradient(135deg,rgb(57,167,176),rgb(56,183,145));
    position: absolute;
    top: 0;
    left: 0;
    transform: translateX(0%);
    transition: all 1s;
    border-top-left-radius: inherit;
    border-bottom-left-radius: inherit;
  }
  .small-contain{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .stitle{
    font-size: 1.5em;
    font-weight: bold;
    color: #fff;
  }
  .scontent{
    font-size: 0.8em;
    color: #fff;
    text-align: center;
    padding: 2em 4em;
    line-height: 1.7em;
  }
</style>
