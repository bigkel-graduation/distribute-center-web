// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import router from "./router";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import axios from "axios";
import * as echarts from "echarts";
import * as echarts4 from "echarts4";

Vue.use(ElementUI);
Vue.prototype.$axios = axios;
Vue.config.productionTip = false;
Vue.prototype.$axios = axios;
Vue.prototype.$echarts = echarts;
Vue.prototype.$echarts4 = echarts4;

new Vue({
  el: "#app",
  router,
  components: { App },
  template: "<App/>"
});
