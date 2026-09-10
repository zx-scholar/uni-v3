<template>
  <view class="calendar">
    <!-- 标题栏 -->
    <view class="calendar__title">
      <text class="calendar__title-text">{{ title }}</text>
      <text
        v-if="closeable"
        class="iconfont icon-cuowu2 calendar__close"
        @click="$emit('close')"
      ></text>
    </view>

    <!-- 年月导航 -->
    <view class="calendar__nav">
      <text
        class="iconfont icon-zuo calendar__nav-arrow"
        @click="prevMonth"
      ></text>
      <text class="calendar__nav-title">{{ year }}年{{ month }}月</text>
      <text
        class="iconfont icon-you calendar__nav-arrow"
        @click="nextMonth"
      ></text>
    </view>

    <!-- 星期表头 -->
    <view class="calendar__weekdays">
      <text
        v-for="(w, idx) in weekdays"
        :key="idx"
        class="calendar__weekday"
      >{{ w }}</text>
    </view>

    <!-- 日期网格 -->
    <view class="calendar__days">
      <view
        v-for="(day, idx) in days"
        :key="idx"
        class="calendar__day"
        :class="{
          'is-other-month': day.otherMonth,
          'is-selected': day.isSelected,
          'is-today': day.isToday
        }"
        @click="selectDay(day)"
      >
        <view class="calendar__day-inner">
          <text class="calendar__day-text">{{ day.text }}</text>
        </view>
        <text v-if="day.isToday" class="calendar__day-today">今</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'Calendar',
  props: {
    title: { type: String, default: '选择日期' },
    closeable: { type: Boolean, default: true },
    // 当前选中的日期字符串,格式 YYYY-MM-DD
    modelValue: { type: String, default: '' },
  },
  emits: ['update:modelValue', 'select', 'close'],
  data() {
    return {
      year: 0,
      month: 0,
      weekdays: ['日', '一', '二', '三', '四', '五', '六'],
    };
  },
  computed: {
    // 当前选中的日期,优先用 modelValue,否则取今天
    selectedDate() {
      if (this.modelValue) return this.modelValue;
      return this.todayStr;
    },
    todayStr() {
      const t = new Date();
      return this.formatDate(t.getFullYear(), t.getMonth() + 1, t.getDate());
    },
    days() {
      // 当月第一天星期几（0=周日）
      const firstDay = new Date(this.year, this.month - 1, 1);
      const startWeekday = firstDay.getDay();
      // 当月总天数
      const daysInMonth = new Date(this.year, this.month, 0).getDate();
      // 上月最后一天
      const prevMonthLastDay = new Date(this.year, this.month - 1, 0).getDate();

      const days = [];

      // 上月填充
      for (let i = startWeekday - 1; i >= 0; i--) {
        days.push({
          text: prevMonthLastDay - i,
          otherMonth: true,
          isSelected: false,
          isToday: false,
          date: '',
        });
      }

      // 当月
      for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = this.formatDate(this.year, this.month, d);
        days.push({
          text: d,
          otherMonth: false,
          isSelected: this.selectedDate === dateStr,
          isToday: this.isRealToday(d),
          date: dateStr,
        });
      }

      // 下月填充（补齐到 6 行 = 42 格）
      const totalCells = 42;
      const remaining = totalCells - days.length;
      for (let d = 1; d <= remaining; d++) {
        days.push({
          text: d,
          otherMonth: true,
          isSelected: false,
          isToday: false,
          date: '',
        });
      }

      return days;
    },
  },
  mounted() {
    // 初始化年份/月份:如果 modelValue 有值,定位到 modelValue 所在月份;否则定位到今天
    const refDate = this.modelValue
      ? this.parseDate(this.modelValue)
      : new Date();
    this.year = refDate.getFullYear();
    this.month = refDate.getMonth() + 1;
  },
  methods: {
    formatDate(y, m, d) {
      return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    },
    parseDate(str) {
      // 解析 'YYYY-MM-DD' 为 Date 对象(本地时区)
      if (!str) return new Date();
      const [y, m, d] = str.split('-').map(Number);
      return new Date(y, m - 1, d);
    },
    isRealToday(d) {
      const today = new Date();
      return today.getFullYear() === this.year
        && today.getMonth() + 1 === this.month
        && today.getDate() === d;
    },
    prevMonth() {
      if (this.month === 1) {
        this.year -= 1;
        this.month = 12;
      } else {
        this.month -= 1;
      }
    },
    nextMonth() {
      if (this.month === 12) {
        this.year += 1;
        this.month = 1;
      } else {
        this.month += 1;
      }
    },
    selectDay(day) {
      if (day.otherMonth) return;
      // 1. v-model 双向绑定:通知父级更新选中日期
      this.$emit('update:modelValue', day.date);
      // 2. select 事件:通知父级执行后续动作（如关闭弹层）
      this.$emit('select', day.date);
    },
  },
};
</script>

<style lang="scss" scoped>
.calendar {
  width: 100%;
  background-color: #ffffff;
  box-sizing: border-box;
}

/* ---- 标题栏 ---- */
.calendar__title {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 88px;
  border-bottom: 1px solid #f1f5f9;
}

.calendar__title-text {
  font-size: 32px;
  font-weight: 600;
  color: #1c1f1e;
}

.calendar__close {
  position: absolute;
  right: 24px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 28px;
  color: #94a3b8;
}

/* ---- 年月导航 ---- */
.calendar__nav {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
}

.calendar__nav-arrow {
  font-size: 32px;
  color: #1c1f1e;
}

.calendar__nav-title {
  font-size: 32px;
  font-weight: 500;
  color: #1c1f1e;
}

/* ---- 星期表头 ---- */
.calendar__weekdays {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 24px;
}

.calendar__weekday {
  flex: 1;
  text-align: center;
  font-size: 26px;
  font-weight: 400;
  color: #6b7370;
  line-height: 1;
  padding: 16px 0;
}

/* ---- 日期网格 ---- */
.calendar__days {
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
  padding: 0 24px 24px;
}

.calendar__day {
  position: relative;
  flex: 0 0 calc(100% / 7);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 88px;
  font-size: 28px;
  color: #1c1f1e;
  box-sizing: border-box;
}

.calendar__day-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 68px;
  height: 68px;
  border-radius: 34px;
  background-color: transparent;
}

.calendar__day.is-selected .calendar__day-inner {
  background-color: #167a4a;
}

.calendar__day.is-selected .calendar__day-text {
  color: #ffffff;
  font-size: 34px;
  font-weight: 400;
}

.calendar__day.is-other-month .calendar__day-text {
  color: #cbd1d8;
}

.calendar__day-today {
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 16px;
  color: #159a62;
  line-height: 1;
}

.calendar__day.is-selected .calendar__day-today {
  color: #ffffff;
}

.calendar__day-text {
  line-height: 1;
}
</style>
