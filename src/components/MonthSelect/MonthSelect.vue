<template>
  <view v-if="visible" class="ms-mask" @click="onMaskClick">
    <view class="ms-panel" :class="{ 'ms-panel--hidden': !showPanel }" @click.stop>
      <!-- 标题栏 -->
      <view class="ms-header">
        <text class="ms-title">筛选时间</text>
        <text class="iconfont icon-cuowu2 ms-close" @click="onClose"></text>
      </view>

      <!-- 滚轮选择区 -->
      <view class="ms-picker-wrap">
        <picker-view
          class="ms-picker"
          indicator-style="height: 50px;"
          :value="wheelValue"
          @change="onWheelChange"
        >
          <picker-view-column>
            <view
              v-for="(item, index) in yearList"
              :key="`y-${index}`"
              class="ms-item"
            >{{ item }}年</view>
          </picker-view-column>
          <picker-view-column>
            <view
              v-for="(item, index) in monthList"
              :key="`m-${index}`"
              class="ms-item"
            >{{ item }}月</view>
          </picker-view-column>
        </picker-view>
      </view>

      <!-- 底部确定按钮 -->
      <view class="ms-confirm" @click="onConfirm">确定</view>
    </view>
  </view>
</template>

<script>
// 滚轮可选的年份范围：当前年起 5 年回溯
const currentYear = new Date().getFullYear();
const yearList = [];
for (let i = currentYear - 5; i <= currentYear; i++) {
  yearList.push(i);
}
const monthList = [];
for (let i = 1; i <= 12; i++) {
  monthList.push(i);
}

export default {
  name: 'MonthSelect',

  props: {
    visible: { type: Boolean, default: false },
    // 初始选中的年份（不传则默认当前年）
    defaultYear: { type: Number, default: 0 },
    // 初始选中的月份（1~12，不传则默认当前月）
    defaultMonth: { type: Number, default: 0 },
  },

  emits: ['update:visible', 'confirm', 'close'],

  data() {
    return {
      yearList,
      monthList,
      // picker-view 的 value 必须是 [年索引, 月索引]
      wheelValue: [0, 0],
      // 控制面板进出场动画
      showPanel: false,
    };
  },

  watch: {
    visible(val) {
      if (val) {
        this.open();
      } else {
        this.showPanel = false;
      }
    },
  },

  mounted() {
    this.resetToDefault();
  },

  methods: {
    // 根据 defaultYear / defaultMonth 初始化 wheelValue，未传则默认当前年月
    resetToDefault() {
      const y = this.defaultYear || currentYear;
      const m = this.defaultMonth || new Date().getMonth() + 1;
      const yIdx = Math.max(0, this.yearList.indexOf(y));
      const mIdx = Math.max(0, Math.min(this.monthList.length - 1, m - 1));
      this.wheelValue = [yIdx, mIdx];
    },

    open() {
      this.resetToDefault();
      // 等一帧再加 showPanel，触发动画
      setTimeout(() => {
        this.showPanel = true;
      }, 50);
    },

    onWheelChange(e) {
      // picker-view 的 change 事件 detail.value 才是数组
      const value = e.detail && e.detail.value ? e.detail.value : e.target.value;
      this.wheelValue = value;
    },

    onMaskClick() {
      this.$emit('update:visible', false);
      this.$emit('close');
    },

    onClose() {
      this.$emit('update:visible', false);
      this.$emit('close');
    },

    onConfirm() {
      const [yIdx, mIdx] = this.wheelValue;
      const yearIndex = yIdx >= this.yearList.length ? this.yearList.length - 1 : yIdx;
      const year = this.yearList[yearIndex];
      const monthNum = this.monthList[mIdx];
      const month = monthNum < 10 ? '0' + monthNum : '' + monthNum;
      this.$emit('confirm', { year, month, monthNum });
      this.$emit('update:visible', false);
    },
  },
};
</script>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

.ms-mask {
  position: fixed;
  inset: 0;
  z-index: 999;
  background-color: rgba(0, 0, 0, 0.5);
}

.ms-panel {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  padding-top: 32px;
  height: 600px;
  background-color: #ffffff;
  border-radius: 20px 20px 0 0;
  box-sizing: border-box;
  transform: translateY(0);
  transition: transform 0.25s ease;
  padding-bottom: calc(34px + constant(safe-area-inset-bottom, 0px));
  padding-bottom: calc(34px + env(safe-area-inset-bottom, 0px));

  &--hidden {
    transform: translateY(100%);
  }
}

.ms-header {
  position: relative;
  padding-bottom: 38px;
  text-align: center;
}

.ms-title {
  font-size: 34px;
  font-weight: 500;
  color: #333333;
  line-height: 1.4;
}

.ms-close {
  position: absolute;
  right: 30px;
  top: 0;
  font-size: 28px;
  color: #666666;
  padding: 10px;
}

.ms-picker-wrap {
  flex: 1;
  overflow: hidden;
}

.ms-picker {
  width: 100%;
  height: 100%;
}

.ms-item {
  line-height: 50px;
  text-align: center;
  font-size: 30px;
  color: #333333;
}

.ms-confirm {
  width: 690px;
  height: 90px;
  margin: 0 auto 34px;
  line-height: 90px;
  text-align: center;
  font-size: 34px;
  font-weight: 500;
  color: #ffffff;
  background: $color-gradient-btn;
  border-radius: 45px;
}
</style>
