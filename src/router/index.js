import Vue from "vue";
import Router from "vue-router";
import login from "../components/Login.vue";
import all from "../components/All.vue";
import NotFound from "../view/Error.vue";
import tabledata from "../components/Table.vue";
import dataAnalysis from "../components/DataAnalysis.vue";
import alldata from "../view/Alldata.vue";
import persondata from "../view/PersonData.vue";
import demand from "../components/Demand.vue";
import sanfang from "../view/Sanfang.vue";
import guiji from "../components/GuiJi.vue";
import godemand from "../components/GodDemand.vue";
import loginalllist from "../components/LoginAllList.vue";
import loginperlist from "../components/LoginPerList.vue";
import authority from "../components/Authority.vue";
import trendprediction from "../components/trendprediction";
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
          path: "/all/loginalllist",
          name: "loginalllist",
          component: loginalllist
        },
        {
          path: "/all/loginperlist",
          name: "loginperlist",
          component: loginperlist
        },
        {
          path: "/all/alldata",
          name: "alldata",
          component: alldata
        },
        {
          path: "/all/persondata",
          name: "persondata",
          component: persondata
        },
        {
          path: "/all/Godemand",
          name: "Godemand",
          component: godemand
        },
        {
          path: "/all/demand",
          name: "demand",
          component: demand
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
          path: "/all",
          redirect: "/all/dataAnalysis"
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
