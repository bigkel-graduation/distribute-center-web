//这份文件是用来拦截的
import axios from "axios";
import { Message } from "element-ui";
import router from "../router/index.js";

//创建一个单例
const service = axios.create({
  baseURL: "http://localhost:8901", // url = base url + request url
  timeout: 5000
});

//拦截器
//请求拦截
service.interceptors.request.use(
  config => {
    var token = window.localStorage.getItem("token");
    console.log(token);
    if (token) {
      config.headers = {
        "X-token": token
      };
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  }
);

//响应拦截
service.interceptors.response.use(
  response => {
    const res = response.data;
    if (res.code === 401 || res.code === 403) {
      Message.error({ message: res.message });
    } else if (res.code === 249) {
      Message.error({ message: res.message });
      router.replace("/login");
      return;
    } else if (res.code === 251) {
      Message.error({ message: res.message });
      router.replace("/login");
      return;
    } else if (res.code === 253) {
      router.replace("/login");
      return;
    } else if (res.code === -211) {
      Message.error({ message: res.message });
      router.replace("/login");
      return;
    } else if (res.code === -200) {
      Message.error({ message: res.message });
      return;
    }
    return res;
  },
  error => {
    console.log("err" + error);
    Message({
      message: error.message,
      type: "error",
      duration: 5 * 1000
    });
    return Promise.reject(error);
  }
);

export default service;
