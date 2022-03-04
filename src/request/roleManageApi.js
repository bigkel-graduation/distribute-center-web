import request from "./request";

export default {
  // 根据角色获取到用户卡片
  getUserListByRole(pid, cid) {
    return request({
      url: `/api/role/get_user_list/${pid}/${cid}`,
      method: "get"
    });
  },

  // 删除用户卡片
  delUser(id) {
    return request({
      url: `/api/role/del_user/${id}`,
      method: "delete"
    });
  },

  // 拿到能够新增的角色列表
  canAddRole(pid, cid) {
    return request({
      url: `/api/role/can_add_role_list/${pid}/${cid}`,
      method: "get"
    });
  },

  // 新增角色
  addRole(pid, cid) {
    return request({
      url: `/api/role/add_role/${pid}/${cid}`,
      method: "put"
    });
  },

  // 删除角色
  delRole(pid, cid) {
    return request({
      url: `/api/role/del_role/${pid}/${cid}`,
      method: "delete"
    });
  }
};
