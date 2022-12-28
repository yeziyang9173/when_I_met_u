"use strict";
var common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      name: "",
      password: "",
      showerr: false,
      titletext1: "\u8FD8\u60F3\u548C\u4F60\u8BA8\u8BBA\u5B87\u5B99\u548C\u5929\u7A7A\n",
      titletext2: "\u6216\u662F\u6C99\u6EE9\u4E0A\u7684\u788E\u77F3\u548C\u4EBA\u751F"
    };
  },
  onReady() {
    if (this.isLoggedOrExpiration()) {
      common_vendor.index.redirectTo({
        url: "/pages/index/index"
      });
    }
  },
  methods: {
    verify() {
      let param = {
        user_name: this.name,
        user_password: this.password
      };
      return wx.cloud.callContainer({
        "config": {
          "env": "prod-0gtp8p5s0b7bf59c"
        },
        "path": "/v1/diary/verify",
        "header": {
          "X-WX-SERVICE": "meet1021",
          "content-type": "application/json"
        },
        "method": "GET",
        "data": param
      });
    },
    login() {
      this.verify().then((res) => {
        if (res.data.result) {
          wx.setStorageSync("session_key", res.data.session_key);
          wx.setStorageSync("expired_time", Date.parse(new Date()) + 60 * 60 * 24 * 7 * 1e3);
          common_vendor.index.redirectTo({
            url: "/pages/index/index"
          });
        } else {
          this.showerr = true;
        }
      });
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
if (!Array) {
  const _easycom_uni_easyinput2 = common_vendor.resolveComponent("uni-easyinput");
  _easycom_uni_easyinput2();
}
const _easycom_uni_easyinput = () => "../../uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.js";
if (!Math) {
  _easycom_uni_easyinput();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($data.titletext1),
    b: common_vendor.t($data.titletext2),
    c: common_vendor.o(($event) => $data.name = $event),
    d: common_vendor.p({
      placeholder: "Username",
      modelValue: $data.name
    }),
    e: common_vendor.o(($event) => $data.password = $event),
    f: common_vendor.p({
      type: "password",
      placeholder: "Password",
      styles: "margin-top:20px;border: 2px solid #537189 !important;",
      modelValue: $data.password
    }),
    g: $data.showerr
  }, $data.showerr ? {} : {}, {
    h: common_vendor.o((...args) => $options.login && $options.login(...args))
  });
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/my-project/when-website/pages/login/login.vue"]]);
wx.createPage(MiniProgramPage);
