import request from "./request";

export default {
  // 三方用户点击请求后，存储请求信息
  saveRequestMessage(userInfo) {
    return request({
      url: `/api/save/request_message`,
      method: "post",
      data: userInfo
    });
  },

  // 像对应的用户发送消息
  sendOneMessage(username) {
    return request({
      url: `/api/send`,
      method: "get",
      params: { name: username }
    });
  },

  // 获取到所有三方请求列表
  getMessageLists(page, limit, searchObj) {
    return request({
      url: `/api/message/list/${page}/${limit}`,
      method: "get",
      params: searchObj
    });
  },

  // 处置请求消息
  dealRequestMessage(id, flag) {
    return request({
      url: `/api/deal/message/${id}/${flag}`,
      method: "get"
    });
  },

  // 获取消息数量
  getMessageCount() {
    return request({
      url: `/api/message/count`,
      method: "get"
    });
  },

  // 删除请求信息
  deleteMessage(id) {
    return request({
      url: `/api/message/del/${id}`,
      method: "get"
    });
  }
};
