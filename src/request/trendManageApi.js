import request from "./request";

export default {
  // 获取服务类型趋势
  getTrendByType() {
    return request({
      url: `/api/trend/type`,
      method: "get"
    });
  },

  // 获取服务名称趋势
  getTrendByName(flag) {
    return request({
      url: `/api/trend/name`,
      method: "get",
      params: { key: flag }
    });
  },

  // 获取和当前服务同一个类型的所有服务进行比较
  getTrendByNameCompare(flag) {
    return request({
      url: `/api/trend/name/compare`,
      method: "get",
      params: { key: flag }
    });
  },

  // 获取级联选择框列表
  getCasList() {
    return request({
      url: `/api/casca/list`,
      method: "get"
    });
  },

  // 根据级联查询趋势
  getTrendByCas(flag) {
    return request({
      url: `/api/trend/casda/${flag}`,
      method: "get"
    });
  }
};
