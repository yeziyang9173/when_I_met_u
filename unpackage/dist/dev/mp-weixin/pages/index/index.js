"use strict";
var common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  components: {},
  data() {
    return {
      showCalendar: false,
      info: {
        lunar: true,
        range: true,
        insert: false,
        selected: [],
        trip: [],
        endDate: "2023 - 5 - 27",
        startDate: "2022 - 5 - 27"
      },
      allTrip: "",
      cometimes: "",
      tripNum: "",
      selectedDate: common_vendor.hooks(new Date()).format("YYYY-MM-DD"),
      remark: "",
      isWrited: false,
      isTripWrited: false,
      dayInfo: "",
      dayTrip: "",
      flag: false,
      showPanel: true
    };
  },
  onReady() {
    if (this.isLoggedOrExpiration()) {
      Promise.all([this.QueryAll(), this.QueryAllTrip(), this.QuerySum()]).then((res) => {
        this.$nextTick(() => {
          this.showCalendar = true;
          res[0].data.forEach((item) => {
            this.info.selected.push({
              date: common_vendor.hooks(item.date).format("YYYY-MM-DD")
            });
          });
          res[1].data.forEach((item) => {
            this.info.trip.push({
              date: common_vendor.hooks(item.date).format("YYYY-MM-DD")
            });
          });
          this.cometimes = res[2].data[0]["count(*)"];
          this.allTrip = res[2].data[0]["sum(trip)"];
          this.Judge();
          if (this.isWrited) {
            this.QueryByDate(common_vendor.hooks(new Date()).format("YYYY-MM-DD")).then((response) => {
              this.dayInfo = response.data;
            });
          }
          this.JudgeTrip();
          if (this.isTripWrited) {
            this.QueryTripByDate(common_vendor.hooks(new Date()).format("YYYY-MM-DD")).then((response) => {
              this.dayTrip = response.data;
            });
          }
        });
      });
    } else {
      common_vendor.index.redirectTo({
        url: "/pages/login/login"
      });
    }
  },
  computed: {
    placeholderText() {
      return "Just type in what happened today or tell me how much you love me today.";
    }
  },
  methods: {
    open() {
      this.$refs.calendar.open();
    },
    change(e) {
      this.isWrited = false;
      this.isTripWrited = false;
      this.selectedDate = e.fulldate;
      this.Judge();
      this.JudgeTrip();
      this.SearchInfo(e.fulldate);
      this.QueryTrip(e.fulldate);
      this.showPanel = true;
    },
    confirm(e) {
    },
    monthSwitch(e) {
      const selectDateMonth = common_vendor.hooks(this.selectedDate).month() + 1;
      if (selectDateMonth !== e.month) {
        this.showPanel = false;
      } else {
        this.showPanel = true;
      }
    },
    deleteCard(value) {
      common_vendor.index.showModal({
        title: "\u63D0\u793A",
        content: "\u786E\u8BA4\u5220\u9664\u8BE5\u6761\u4FE1\u606F\u5417\uFF1F",
        cancelText: "\u53D6\u6D88",
        confirmText: "\u5220\u9664",
        confirmColor: "red",
        cancelColor: "#000000",
        success: (response) => {
          if (response.confirm) {
            const _this = this;
            this.Delete(value, _this).then((res) => {
              this.$nextTick(() => {
                common_vendor.index.showToast({
                  title: "\u6210\u529F\u5220\u9664",
                  icon: "success",
                  duration: 2e3
                }).then((res2) => {
                  this.InitData();
                });
              });
            });
          }
        }
      });
    },
    async QueryAll() {
      return wx.cloud.callContainer({
        "config": {
          "env": "prod-0gtp8p5s0b7bf59c"
        },
        "path": "/v1/diary/queryAll",
        "header": {
          "X-WX-SERVICE": "meet1021",
          "content-type": "application/json"
        },
        "method": "GET",
        "data": ""
      });
    },
    async QueryAllTrip() {
      return wx.cloud.callContainer({
        "config": {
          "env": "prod-0gtp8p5s0b7bf59c"
        },
        "path": "/v1/diary/queryAllTrip",
        "header": {
          "X-WX-SERVICE": "meet1021",
          "content-type": "application/json"
        },
        "method": "GET",
        "data": ""
      });
    },
    async QuerySum() {
      return wx.cloud.callContainer({
        "config": {
          "env": "prod-0gtp8p5s0b7bf59c"
        },
        "path": "/v1/diary/sum",
        "header": {
          "X-WX-SERVICE": "meet1021",
          "content-type": "application/json"
        },
        "method": "GET",
        "data": ""
      });
    },
    async QueryByDate(date) {
      const formateData = common_vendor.hooks(date).format("YYYY-MM-DD HH:mm:ss");
      let param = {
        date: formateData
      };
      return wx.cloud.callContainer({
        "config": {
          "env": "prod-0gtp8p5s0b7bf59c"
        },
        "path": "/v1/diary/query",
        "header": {
          "X-WX-SERVICE": "meet1021",
          "content-type": "application/json"
        },
        "method": "GET",
        "data": param
      });
    },
    async QueryTripByDate(date) {
      const formateData = common_vendor.hooks(date).format("YYYY-MM-DD");
      let param = {
        date: formateData
      };
      return wx.cloud.callContainer({
        "config": {
          "env": "prod-0gtp8p5s0b7bf59c"
        },
        "path": "/v1/diary/queryTripByDate",
        "header": {
          "X-WX-SERVICE": "meet1021",
          "content-type": "application/json"
        },
        "method": "GET",
        "data": param
      });
    },
    QueryTrip(date) {
      this.QueryTripByDate(date).then((res) => {
        if (res.data.length === 0) {
          this.isTripWrited = false;
        } else {
          this.dayTrip = res.data;
          this.isTripWrited = true;
        }
      });
    },
    async AddDiary() {
      let param = {
        date: this.selectedDate,
        remark: this.remark
      };
      return wx.cloud.callContainer({
        "config": {
          "env": "prod-0gtp8p5s0b7bf59c"
        },
        "path": "/v1/diary/addDiary",
        "header": {
          "X-WX-SERVICE": "meet1021",
          "content-type": "application/json"
        },
        "method": "GET",
        "data": param
      });
    },
    async AddTrip() {
      let param = {
        date: this.selectedDate,
        trip: this.tripNum
      };
      return wx.cloud.callContainer({
        "config": {
          "env": "prod-0gtp8p5s0b7bf59c"
        },
        "path": "/v1/diary/addTrip",
        "header": {
          "X-WX-SERVICE": "meet1021",
          "content-type": "application/json"
        },
        "method": "GET",
        "data": param
      });
    },
    async Delete(thisDaymark, that) {
      const formateData = common_vendor.hooks(this.selectedDate).format("YYYY-MM-DD HH:mm:ss");
      if (that.dayInfo.length == 1) {
        let param = {
          date: formateData
        };
        return wx.cloud.callContainer({
          "config": {
            "env": "prod-0gtp8p5s0b7bf59c"
          },
          "path": "/v1/diary/deleteDiary",
          "header": {
            "X-WX-SERVICE": "meet1021",
            "content-type": "application/json"
          },
          "method": "GET",
          "data": param
        });
      } else {
        let targetIndex = -1;
        let i;
        for (i = 0; i < that.dayInfo.length; i = i + 1) {
          console.log(that.dayInfo[i]);
          if (that.dayInfo[i].value === thisDaymark) {
            targetIndex = i;
          }
        }
        that.dayInfo.splice(targetIndex, 1);
        let param = {
          date: formateData,
          remark: JSON.stringify(that.dayInfo)
        };
        return wx.cloud.callContainer({
          "config": {
            "env": "prod-0gtp8p5s0b7bf59c"
          },
          "path": "/v1/diary/update",
          "header": {
            "X-WX-SERVICE": "meet1021",
            "content-type": "application/json"
          },
          "method": "GET",
          "data": param
        });
      }
    },
    Submit() {
      common_vendor.index.showLoading({
        title: "\u52A0\u8F7D\u4E2D..."
      });
      this.remark = this.remark.trim();
      if (this.remark.length !== 0) {
        this.AddDiary().then((res) => {
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({
            title: "\u6DFB\u52A0\u6210\u529F",
            icon: "success",
            duration: 2e3
          }).then((res2) => {
            this.InitData();
          });
        });
      } else {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "\u4E0D\u80FD\u4E3A\u7A7A",
          icon: "error",
          duration: 2e3
        });
      }
    },
    InitData() {
      this.remark = "";
      Promise.all([this.QueryAll(), this.QueryAllTrip(), this.QuerySum()]).then((res) => {
        this.$nextTick(() => {
          res[0].data.forEach((item) => {
            this.info.selected.push({
              date: common_vendor.hooks(item.date).format("YYYY-MM-DD")
            });
          });
          res[1].data.forEach((item) => {
            this.info.trip.push({
              date: common_vendor.hooks(item.date).format("YYYY-MM-DD")
            });
          });
          this.cometimes = res[2].data[0]["count(*)"];
          this.allTrip = res[2].data[0]["sum(trip)"];
          this.Judge();
          if (this.isWrited) {
            this.QueryByDate(common_vendor.hooks(this.selectedDate).format("YYYY-MM-DD")).then((response) => {
              this.dayInfo = response.data;
            });
          }
          this.JudgeTrip();
          if (this.isTripWrited) {
            this.QueryTripByDate(common_vendor.hooks(this.selectedDate).format("YYYY-MM-DD")).then((response) => {
              this.dayTrip = response.data;
            });
          }
        });
      });
    },
    Judge() {
      this.info.selected.forEach((item) => {
        if (item.date == this.selectedDate) {
          this.isWrited = true;
        }
      });
    },
    JudgeTrip() {
      this.info.trip.forEach((item) => {
        if (item.date == this.selectedDate) {
          this.isTripWrited = true;
        }
      });
    },
    SearchInfo(date) {
      this.QueryByDate(date).then((res) => {
        if (res.length != 0) {
          this.dayInfo = res.data;
        }
      });
    },
    refresh() {
      common_vendor.index.redirectTo({
        url: "/pages/index/index"
      });
    },
    Logout() {
      wx.clearStorageSync();
      common_vendor.index.redirectTo({
        url: "/pages/login/login"
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
    },
    SubmitTrip() {
      common_vendor.index.showLoading({
        title: "\u52A0\u8F7D\u4E2D..."
      });
      this.tripNum = this.tripNum.trim();
      if (this.tripNum.length !== 0) {
        this.AddTrip().then((res) => {
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({
            title: "\u6DFB\u52A0\u6210\u529F",
            icon: "success",
            duration: 2e3
          }).then((res2) => {
            this.InitData();
            this.isTripWrited = false;
          });
        });
      } else {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "\u91CC\u7A0B\u6570\u4E0D\u80FD\u4E3A\u7A7A",
          icon: "error",
          duration: 2e3
        });
      }
    }
  }
};
if (!Array) {
  const _easycom_uni_calendar2 = common_vendor.resolveComponent("uni-calendar");
  const _easycom_uni_easyinput2 = common_vendor.resolveComponent("uni-easyinput");
  (_easycom_uni_calendar2 + _easycom_uni_easyinput2)();
}
const _easycom_uni_calendar = () => "../../uni_modules/uni-calendar/components/uni-calendar/uni-calendar.js";
const _easycom_uni_easyinput = () => "../../uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.js";
if (!Math) {
  (_easycom_uni_calendar + _easycom_uni_easyinput)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($data.allTrip),
    b: common_vendor.t($data.cometimes),
    c: $data.showCalendar
  }, $data.showCalendar ? {
    d: common_vendor.o($options.change),
    e: common_vendor.o($options.monthSwitch),
    f: common_vendor.p({
      showMonth: true,
      selected: $data.info.selected,
      trip: $data.info.trip
    })
  } : {}, {
    g: $data.showPanel
  }, $data.showPanel ? common_vendor.e({
    h: common_vendor.f($data.dayInfo, (daymark, k0, i0) => {
      return {
        a: common_vendor.o(($event) => $options.deleteCard(daymark.value)),
        b: common_vendor.t(daymark.value)
      };
    }),
    i: $data.isWrited,
    j: $data.selectedDate
  }, $data.selectedDate ? {
    k: common_vendor.o(($event) => $data.remark = $event),
    l: common_vendor.p({
      type: "textarea",
      placeholder: $options.placeholderText,
      modelValue: $data.remark
    })
  } : {}, {
    m: common_vendor.o((...args) => $options.Submit && $options.Submit(...args)),
    n: common_vendor.t($data.dayTrip),
    o: $data.isTripWrited,
    p: common_vendor.o(($event) => $data.tripNum = $event),
    q: common_vendor.p({
      type: "number",
      modelValue: $data.tripNum
    }),
    r: common_vendor.o((...args) => $options.SubmitTrip && $options.SubmitTrip(...args)),
    s: !$data.isTripWrited
  }) : {}, {
    t: common_vendor.o(($event) => $options.Logout())
  });
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/my-project/when-website/pages/index/index.vue"]]);
wx.createPage(MiniProgramPage);
