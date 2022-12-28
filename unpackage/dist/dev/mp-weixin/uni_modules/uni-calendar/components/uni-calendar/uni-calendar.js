"use strict";
var uni_modules_uniCalendar_components_uniCalendar_util = require("./util.js");
var common_vendor = require("../../../../common/vendor.js");
var uni_modules_uniCalendar_components_uniCalendar_i18n_index = require("./i18n/index.js");
require("./calendar.js");
const calendarItem = () => "./uni-calendar-item.js";
const swiperDirectCom = () => "../../../../componment/swiper-direct-com/swiper-direct-com.js";
const {
  t
} = common_vendor.initVueI18n(uni_modules_uniCalendar_components_uniCalendar_i18n_index.messages);
const _sfc_main = {
  components: {
    calendarItem,
    swiperDirectCom
  },
  emits: ["close", "confirm", "change", "monthSwitch"],
  props: {
    date: {
      type: String,
      default: ""
    },
    selected: {
      type: Array,
      default() {
        return [];
      }
    },
    trip: {
      type: Array,
      default() {
        return [];
      }
    },
    lunar: {
      type: Boolean,
      default: false
    },
    startDate: {
      type: String,
      default: ""
    },
    endDate: {
      type: String,
      default: ""
    },
    range: {
      type: Boolean,
      default: false
    },
    insert: {
      type: Boolean,
      default: true
    },
    showMonth: {
      type: Boolean,
      default: true
    },
    clearDate: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      show: false,
      weeks: [],
      calendar: {},
      nowDate: "",
      aniMaskShow: false
    };
  },
  computed: {
    okText() {
      return t("uni-calender.ok");
    },
    cancelText() {
      return t("uni-calender.cancel");
    },
    todayText() {
      return t("uni-calender.today");
    },
    monText() {
      return t("uni-calender.MON");
    },
    TUEText() {
      return t("uni-calender.TUE");
    },
    WEDText() {
      return t("uni-calender.WED");
    },
    THUText() {
      return t("uni-calender.THU");
    },
    FRIText() {
      return t("uni-calender.FRI");
    },
    SATText() {
      return t("uni-calender.SAT");
    },
    SUNText() {
      return t("uni-calender.SUN");
    }
  },
  watch: {
    date(newVal) {
      this.init(newVal);
    },
    startDate(val) {
      this.cale.resetSatrtDate(val);
      this.cale.setDate(this.nowDate.fullDate);
      this.weeks = this.cale.weeks;
    },
    endDate(val) {
      this.cale.resetEndDate(val);
      this.cale.setDate(this.nowDate.fullDate);
      this.weeks = this.cale.weeks;
    },
    selected(newVal) {
      this.cale.setSelectInfo(this.nowDate.fullDate, newVal);
      this.weeks = this.cale.weeks;
    },
    trip(newVal) {
      this.cale.setTripInfo(this.nowDate.fullDate, newVal);
      this.weeks = this.cale.weeks;
    }
  },
  created() {
    this.cale = new uni_modules_uniCalendar_components_uniCalendar_util.Calendar({
      selected: this.selected,
      trip: this.trip,
      startDate: this.startDate,
      endDate: this.endDate,
      range: this.range
    });
    this.init(this.date);
  },
  methods: {
    clean() {
    },
    bindDateChange(e) {
      const value = e.detail.value + "-1";
      console.log(this.cale.getDate(value));
      this.setDate(value);
    },
    init(date) {
      this.cale.setDate(date);
      this.weeks = this.cale.weeks;
      this.nowDate = this.calendar = this.cale.getInfo(date);
    },
    open() {
      if (this.clearDate && !this.insert) {
        this.cale.cleanMultipleStatus();
        this.init(this.date);
      }
      this.show = true;
      this.$nextTick(() => {
        setTimeout(() => {
          this.aniMaskShow = true;
        }, 50);
      });
    },
    close() {
      this.aniMaskShow = false;
      this.$nextTick(() => {
        setTimeout(() => {
          this.show = false;
          this.$emit("close");
        }, 300);
      });
    },
    confirm() {
      this.setEmit("confirm");
      this.close();
    },
    change() {
      if (!this.insert)
        return;
      this.setEmit("change");
    },
    monthSwitch() {
      let {
        year,
        month
      } = this.nowDate;
      this.$emit("monthSwitch", {
        year,
        month: Number(month)
      });
    },
    setEmit(name) {
      let {
        year,
        month,
        date,
        fullDate,
        lunar,
        extraInfo
      } = this.calendar;
      this.$emit(name, {
        range: this.cale.multipleStatus,
        year,
        month,
        date,
        fulldate: fullDate,
        lunar,
        extraInfo: extraInfo || {}
      });
    },
    choiceDate(weeks) {
      if (weeks.disable)
        return;
      this.calendar = weeks;
      this.cale.setMultiple(this.calendar.fullDate);
      this.weeks = this.cale.weeks;
      this.change();
    },
    backtoday() {
      console.log(this.cale.getDate(new Date()).fullDate);
      let date = this.cale.getDate(new Date()).fullDate;
      this.init(date);
      this.change();
    },
    pre() {
      const preDate = this.cale.getDate(this.nowDate.fullDate, -1, "month").fullDate;
      this.setDate(preDate);
      this.monthSwitch();
    },
    next() {
      const nextDate = this.cale.getDate(this.nowDate.fullDate, 1, "month").fullDate;
      this.setDate(nextDate);
      this.monthSwitch();
    },
    setDate(date) {
      this.cale.setDate(date);
      this.weeks = this.cale.weeks;
      this.nowDate = this.cale.getInfo(date);
    },
    Month2Eng(month) {
      const num = parseInt(month);
      const monthList = t("month").split(",");
      return monthList[num - 1];
    },
    scrollL() {
      this.next();
    },
    scrollR() {
      this.pre();
    }
  }
};
if (!Array) {
  const _component_calendar_item = common_vendor.resolveComponent("calendar-item");
  const _component_swiper_direct_com = common_vendor.resolveComponent("swiper-direct-com");
  (_component_calendar_item + _component_swiper_direct_com)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: !$props.insert && $data.show
  }, !$props.insert && $data.show ? {
    b: $data.aniMaskShow ? 1 : "",
    c: common_vendor.o((...args) => $options.clean && $options.clean(...args))
  } : {}, {
    d: $props.insert || $data.show
  }, $props.insert || $data.show ? common_vendor.e({
    e: !$props.insert
  }, !$props.insert ? {
    f: common_vendor.t($options.cancelText),
    g: common_vendor.o((...args) => $options.close && $options.close(...args)),
    h: common_vendor.t($options.okText),
    i: common_vendor.o((...args) => $options.confirm && $options.confirm(...args))
  } : {}, {
    j: common_vendor.t($options.Month2Eng($data.nowDate.month) || ""),
    k: common_vendor.t($data.nowDate.year || ""),
    l: $props.date,
    m: common_vendor.o((...args) => $options.bindDateChange && $options.bindDateChange(...args)),
    n: common_vendor.o((...args) => $options.pre && $options.pre(...args)),
    o: common_vendor.o((...args) => $options.next && $options.next(...args)),
    p: $props.showMonth
  }, $props.showMonth ? {
    q: common_vendor.t($data.nowDate.month)
  } : {}, {
    r: common_vendor.t($options.SUNText),
    s: common_vendor.t($options.monText),
    t: common_vendor.t($options.TUEText),
    v: common_vendor.t($options.WEDText),
    w: common_vendor.t($options.THUText),
    x: common_vendor.t($options.FRIText),
    y: common_vendor.t($options.SATText),
    z: common_vendor.f($data.weeks, (item, weekIndex, i0) => {
      return {
        a: common_vendor.f(item, (weeks, weeksIndex, i1) => {
          return {
            a: "0682a296-1-" + i0 + "-" + i1 + ",0682a296-0",
            b: common_vendor.p({
              weeks,
              calendar: $data.calendar,
              trip: $props.trip,
              selected: $props.selected,
              lunar: $props.lunar
            }),
            c: weeksIndex
          };
        }),
        b: weekIndex
      };
    }),
    A: common_vendor.o($options.choiceDate),
    B: !$props.insert ? 1 : "",
    C: $data.aniMaskShow ? 1 : ""
  }) : {}, {
    D: common_vendor.o($options.scrollL),
    E: common_vendor.o($options.scrollR),
    F: common_vendor.p({
      lrDistance: 5,
      leftMed: "scrollL",
      rightMed: "scrollR"
    })
  });
}
var Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-0682a296"], ["__file", "D:/my-project/when-website/uni_modules/uni-calendar/components/uni-calendar/uni-calendar.vue"]]);
wx.createComponent(Component);
