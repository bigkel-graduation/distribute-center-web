import request from "./request";

export default {
  getDisplayData() {
    return request({
      url: `/api/display`,
      method: "get"
    });
  },

  getTrackData() {
    return request({
      url: `/api/track`,
      method: "get"
    });
  }
};
