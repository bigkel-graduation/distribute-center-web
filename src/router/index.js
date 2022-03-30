import Vue from "vue";
import Router from "vue-router";
import login from "../components/Login.vue";
import all from "../components/All.vue";
import NotFound from "../view/Error.vue";
import tabledata from "../components/Table.vue";
import dataAnalysis from "../components/DataAnalysis.vue";
import sanfang from "../view/Sanfang.vue";
import guiji from "../components/GuiJi.vue";
import authority from "../components/Authority.vue";
import trendprediction from "../components/trendprediction";
import waitdeal from "../view/waitDeal.vue";
import pleaseManage from "../components/PleaseManage.vue";
Vue.use(Router);

const router = new Router({
  mode: "history",
  routes: [
    {
      path: "/login",
      name: "login",
      component: login
    },
    {
      path: "/sanfang",
      name: "sanfang",
      component: sanfang
    },
    {
      path: "/waitdeal",
      name: "waitDeal",
      component: waitdeal
    },
    {
      path: "/all",
      name: "all",
      component: all,
      children: [
        {
          path: "/all/table",
          name: "table",
          component: tabledata
        },
        {
          path: "/all/authority",
          name: "authority",
          component: authority
        },
        {
          path: "/all/dataAnalysis",
          name: "dataAnalysis",
          component: dataAnalysis
        },

        {
          path: "/all/guiji",
          name: "guiji",
          component: guiji
        },
        {
          path: "/all/trendprediction",
          name: "trendprediction",
          component: trendprediction
        },
        {
          path: "/all/pleaseManage",
          name: "pleaseManage",
          component: pleaseManage
        },
        {
          path: "/all",
          redirect: "/all/trendprediction" // 登陆后默认页
        }
      ]
    },
    {
      path: "/",
      redirect: "/login"
    },
    {
      path: "*",
      component: NotFound
    }
  ]
});

router.beforeEach((to, from, next) => {
  if (to.path === "/login") {
    next();
  } else if (to.path === "/sanfang") {
    next();
  } else if (to.path === "/waitdeal") {
    next();
  } else {
    let token = localStorage.getItem("token");
    if (token === "null" || token === "") {
      next("/login");
    } else {
      next();
    }
  }
});
export default router;
