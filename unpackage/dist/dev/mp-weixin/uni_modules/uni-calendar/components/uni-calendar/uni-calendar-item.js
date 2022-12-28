"use strict";
var common_vendor = require("../../../../common/vendor.js");
var uni_modules_uniCalendar_components_uniCalendar_i18n_index = require("./i18n/index.js");
const {
  t
} = common_vendor.initVueI18n(uni_modules_uniCalendar_components_uniCalendar_i18n_index.messages);
const _sfc_main = {
  emits: ["change"],
  props: {
    weeks: {
      type: Object,
      default() {
        return {};
      }
    },
    calendar: {
      type: Object,
      default: () => {
        return {};
      }
    },
    selected: {
      type: Array,
      default: () => {
        return [];
      }
    },
    trip: {
      type: Array,
      default: () => {
        return [];
      }
    },
    lunar: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    todayText() {
      return t("uni-calender.today");
    }
  },
  methods: {
    choiceDate(weeks) {
      this.$emit("change", weeks);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.selected && $props.weeks.extraInfo
  }, $props.selected && $props.weeks.extraInfo ? {} : {}, {
    b: $props.trip && $props.weeks.tripExtraInfo
  }, $props.trip && $props.weeks.tripExtraInfo ? {} : {}, {
    c: common_vendor.t($props.weeks.date),
    d: $props.weeks.isDay ? 1 : "",
    e: $props.calendar.fullDate === $props.weeks.fullDate && $props.weeks.isDay ? 1 : "",
    f: $props.calendar.fullDate === $props.weeks.fullDate && !$props.weeks.isDay ? 1 : "",
    g: $props.weeks.beforeMultiple ? 1 : "",
    h: $props.weeks.multiple ? 1 : "",
    i: $props.weeks.afterMultiple ? 1 : "",
    j: $props.weeks.disable ? 1 : "",
    k: !$props.lunar && !$props.weeks.extraInfo && $props.weeks.isDay
  }, !$props.lunar && !$props.weeks.extraInfo && $props.weeks.isDay ? {
    l: common_vendor.t($options.todayText),
    m: $props.weeks.isDay ? 1 : "",
    n: $props.calendar.fullDate === $props.weeks.fullDate && $props.weeks.isDay ? 1 : "",
    o: $props.calendar.fullDate === $props.weeks.fullDate && !$props.weeks.isDay ? 1 : "",
    p: $props.weeks.beforeMultiple ? 1 : "",
    q: $props.weeks.multiple ? 1 : "",
    r: $props.weeks.afterMultiple ? 1 : ""
  } : {}, {
    s: $props.lunar && !$props.weeks.extraInfo
  }, $props.lunar && !$props.weeks.extraInfo ? {
    t: common_vendor.t($props.weeks.isDay ? $options.todayText : $props.weeks.lunar.IDayCn === "\u521D\u4E00" ? $props.weeks.lunar.IMonthCn : $props.weeks.lunar.IDayCn),
    v: $props.weeks.isDay ? 1 : "",
    w: $props.calendar.fullDate === $props.weeks.fullDate && $props.weeks.isDay ? 1 : "",
    x: $props.calendar.fullDate === $props.weeks.fullDate && !$props.weeks.isDay ? 1 : "",
    y: $props.weeks.beforeMultiple ? 1 : "",
    z: $props.weeks.multiple ? 1 : "",
    A: $props.weeks.afterMultiple ? 1 : "",
    B: $props.weeks.disable ? 1 : ""
  } : {}, {
    C: $props.weeks.extraInfo && $props.weeks.extraInfo.info
  }, $props.weeks.extraInfo && $props.weeks.extraInfo.info ? {
    D: common_vendor.t($props.weeks.extraInfo.info),
    E: $props.weeks.extraInfo.info ? 1 : "",
    F: $props.weeks.isDay ? 1 : "",
    G: $props.calendar.fullDate === $props.weeks.fullDate && $props.weeks.isDay ? 1 : "",
    H: $props.calendar.fullDate === $props.weeks.fullDate && !$props.weeks.isDay ? 1 : "",
    I: $props.weeks.beforeMultiple ? 1 : "",
    J: $props.weeks.multiple ? 1 : "",
    K: $props.weeks.afterMultiple ? 1 : "",
    L: $props.weeks.disable ? 1 : ""
  } : {}, {
    M: $props.weeks.disable ? 1 : "",
    N: $props.calendar.fullDate === $props.weeks.fullDate && $props.weeks.isDay ? 1 : "",
    O: $props.calendar.fullDate === $props.weeks.fullDate && !$props.weeks.isDay ? 1 : "",
    P: $props.weeks.beforeMultiple ? 1 : "",
    Q: $props.weeks.multiple ? 1 : "",
    R: $props.weeks.afterMultiple ? 1 : "",
    S: common_vendor.o(($event) => $options.choiceDate($props.weeks))
  });
}
var Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-6097fd5b"], ["__file", "D:/my-project/when-website/uni_modules/uni-calendar/components/uni-calendar/uni-calendar-item.vue"]]);
wx.createComponent(Component);
