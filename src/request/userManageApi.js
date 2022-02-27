import request from "./request";

//按需导出每个请求
export default {
  // 登录接口
  login(body) {
    return request({
      url: `/api/user/login`,
      method: "post",
      data: body
    });
  },

  // 用户信息接口
  getUserList(page, limit, searchObj) {
    return request({
      url: `/api/user/list/${page}/${limit}`,
      method: "get",
      params: searchObj
    });
  },

  // 用户新增\修改
  createOrUpdate(editUser) {
    return request({
      url: `/api/user/update`,
      method: "put",
      data: editUser
    });
  },

  // 用户删除
  deleteUser(id) {
    return request({
      url: "/api/user/delete/" + id,
      method: "delete"
    });
  },

  // 用户锁定\解锁
  lockOrNot(id, flag) {
    return request({
      url: `/api/user/lock_or_unlock/${id}/${flag}`,
      method: "put"
    });
  },

  // 获取省份信息
  getProvince(rolePid, roleCid) {
    return request({
      url: `/api/user/province/${rolePid}/${roleCid}`,
      method: "get"
    });
  },

  //第三方登录请求
  SanfangLoginAPI(params) {
    const req = request({
      method: "post",
      url: "/sanfang",
      data: params
    });
    return req;
  },

  //初始化地图数据
  MapAPI() {
    const req = request({
      method: "get",
      url: "/Login_Data/GetLogin_NumByAddress"
    });
    return req;
  },

  //对接饼图数据
  CakeAPI(params) {
    // console.log(params);
    const req = request({
      method: "get",
      url:
        "http://10.11.37.239:8888/Login_Data/GetLogin_NumByAddressAndProvince?address=" +
        params,
      params
    });
    return req;
  },

  //单个用户登录记录
  DandianAPI() {
    const req = request({
      method: "get",
      url: "http://172.20.10.5:8888/Login_Data/GetLogin_DataAll"
    });
    return req;
  },

  GuijiAPI() {
    const req = request({
      method: "get",
      url: "/Login_Data/GetLogin_DataById?id=1"
    });
    return req;
  }

  /* PersonalAPI(params){
    const req=request({
      method:'get',
      url:'/Login_Data/GetPageAll?page='+params,
    })
    return req
  }*/
};
