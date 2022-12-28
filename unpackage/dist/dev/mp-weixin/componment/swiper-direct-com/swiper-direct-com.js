"use strict";
var common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  name: "swipe-direct-com",
  data() {
    return {
      startData: {
        clientX: "",
        clientY: ""
      }
    };
  },
  props: {
    updDistance: {
      type: Number,
      default: 100
    },
    lrDistance: {
      type: Number,
      default: 50
    },
    topMed: {
      type: String,
      default: ""
    },
    bottomMed: {
      type: String,
      default: ""
    },
    leftMed: {
      type: String,
      default: ""
    },
    rightMed: {
      type: String,
      default: ""
    }
  },
  mounted() {
  },
  methods: {
    fingerstart(e) {
      this.startData.clientX = e.changedTouches[0].clientX;
      this.startData.clientY = e.changedTouches[0].clientY;
    },
    fingerend(e) {
      const subX = e.changedTouches[0].clientX - this.startData.clientX;
      const subY = e.changedTouches[0].clientY - this.startData.clientY;
      if (subY > this.updDistance || subY < -this.updDistance) {
        if (subY > this.updDistance) {
          this.bottomscroll(subY);
        } else if (subY < -this.updDistance) {
          this.topscroll(subY);
        }
      } else {
        if (subX > this.lrDistance) {
          this.rightscroll(subX);
        } else if (subX < -this.lrDistance) {
          this.leftscroll(subX);
        } else {
          console.log("\u65E0\u6548\u64CD\u4F5C");
        }
      }
    },
    topscroll(dista) {
      this.topMed ? this.$emit(`${this.topMed}`, dista) : null;
      console.log("\u89E6\u53D1\u4E86\u4E0A\u6ED1\u65B9\u6CD5!");
    },
    bottomscroll(dista) {
      this.bottomMed ? this.$emit(`${this.bottomMed}`, dista) : null;
      console.log("\u89E6\u53D1\u4E86\u4E0B\u6ED1\u65B9\u6CD5!");
    },
    rightscroll(dista) {
      this.rightMed ? this.$emit(`${this.rightMed}`, dista) : null;
      console.log("\u89E6\u53D1\u4E86\u53F3\u6ED1\u65B9\u6CD5!");
    },
    leftscroll(dista) {
      this.leftMed ? this.$emit(`${this.leftMed}`, dista) : null;
      console.log("\u89E6\u53D1\u4E86\u5DE6\u6ED1\u65B9\u6CD5!");
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.fingerstart && $options.fingerstart(...args)),
    b: common_vendor.o((...args) => $options.fingerend && $options.fingerend(...args))
  };
}
var Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/my-project/when-website/componment/swiper-direct-com/swiper-direct-com.vue"]]);
wx.createComponent(Component);
