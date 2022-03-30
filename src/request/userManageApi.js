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
  }
};
