"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports[Symbol.toStringTag] = "Module";
var common_vendor = require("./common/vendor.js");
if (!Math) {
  "./pages/login/login.js";
  "./pages/index/index.js";
}
const _sfc_main = {
  onLaunch: function() {
    console.log("App Launch");
    wx.login();
    wx.cloud.init({
      env: "prod-2gsixybr509d60b5",
      traceUser: true
    });
    this.judgePage();
  },
  onShow: function() {
    console.log("App Show");
    wx.hideHomeButton();
  },
  onHide: function() {
    console.log("App Hide");
  },
  methods: {
    judgePage() {
      if (this.isLoggedOrExpiration()) {
        common_vendor.index.redirectTo({
          url: "/pages/index/index"
        });
      } else {
        common_vendor.index.redirectTo({
          url: "/pages/login/login"
        });
      }
    },
    isLoggedOrExpiration() {
      const newTimeStamp = Date.parse(new Date());
      const date_expiration = wx.getStorageSync("expired_time");
      if (date_expiration) {
        if (newTimeStamp > date_expiration) {
          wx.clearStorageSync();
          return false;
        } else {
          return true;
        }
      }
      return false;
    }
  }
};
var App = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/my-project/when-website/App.vue"]]);
function createApp() {
  const app = common_vendor.createSSRApp(App);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
