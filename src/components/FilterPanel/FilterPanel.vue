<template>
  <view class="filter-panel">
    <!-- 顶部 -->
    <view class="filter-panel__header">
      <view class="filter-panel__date">
        <text>日期</text>
        <text class="iconfont icon-paixuxia filter-panel__date-icon"></text>
      </view>
      <view class="filter-panel__date-options">
        <view
          v-for="opt in dateOptions"
          :key="opt.value"
          class="filter-panel__date-option"
          :class="{ 'is-selected': modelValue.date === opt.value }"
          @click="select('date', opt.value)"
        >{{ opt.text }}</view>
      </view>
      <view class="filter-panel__filter" @click="$emit('filter')">
        <text>筛选</text>
        <text class="iconfont icon-shaixuan1 filter-panel__filter-icon"></text>
      </view>
    </view>

    <!-- 主体 -->
    <view class="filter-panel__body">
      <view
        v-for="group in groups"
        :key="group.key"
        class="filter-panel__group"
      >
        <text class="filter-panel__group-title">{{ group.title }}</text>
        <view class="filter-panel__group-options">
          <view
            v-for="opt in group.options"
            :key="opt.value"
            class="filter-panel__chip"
            :class="{ 'is-selected': modelValue[group.key] === opt.value }"
            @click="select(group.key, opt.value)"
          >{{ opt.text }}</view>
        </view>
      </view>
    </view>

    <!-- 底部 -->
    <view class="filter-panel__footer">
      <view
        class="filter-panel__btn filter-panel__btn--reset"
        @click="handleReset"
      >重置</view>
      <view
        class="filter-panel__btn filter-panel__btn--confirm"
        @click="handleConfirm"
      >确定</view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'FilterPanel',
  props: {
    modelValue: {
      type: Object,
      default: () => ({
        date: '',
        handicap: '',
        gender: '',
        smoking: '',
      }),
    },
    dateOptions: {
      type: Array,
      default: () => [
        { text: '今天', value: 'today' },
        { text: '明天', value: 'tomorrow' },
      ],
    },
    groups: {
      type: Array,
      default: () => [
        {
          key: 'handicap',
          title: '差点要求',
          options: [
            { text: '不限', value: '' },
            { text: '差点18以内', value: '18' },
            { text: '差点20以内', value: '20' },
          ],
        },
        {
          key: 'gender',
          title: '性别',
          options: [
            { text: '不限', value: '' },
            { text: '男士', value: 'male' },
            { text: '女士', value: 'female' },
          ],
        },
        {
          key: 'smoking',
          title: '抽烟',
          options: [
            { text: '不限', value: '' },
            { text: '室内禁烟', value: 'no_smoking' },
          ],
        },
      ],
    },
  },
  emits: ['update:modelValue', 'confirm', 'reset', 'filter'],
  methods: {
    select(key, value) {
      const next = { ...this.modelValue, [key]: value };
      this.$emit('update:modelValue', next);
    },
    handleReset() {
      const reset = {};
      for (const group of this.groups) {
        reset[group.key] = '';
      }
      reset.date = '';
      this.$emit('update:modelValue', reset);
      this.$emit('reset');
    },
    handleConfirm() {
      this.$emit('confirm', this.modelValue);
    },
  },
};
</script>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

.filter-panel {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 750px;
  margin: 0 auto;
  // padding: 24px;
  // border-radius: 16px;
  background-color: #ffffff;
  box-sizing: border-box;
}

/* ---- 顶部 ---- */
.filter-panel__header {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 24px;
  padding: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid #ececec;
}

.filter-panel__date {
  flex-shrink: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 26px;
  font-weight: 400;
  color: #6b7370;
  line-height: 1;
}

.filter-panel__date-icon {
  margin-left: 6px;
  font-size: 22px;
  color: #6b7370;
  line-height: 1;
}

.filter-panel__date-options {
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 24px;
  min-width: 0;
}

.filter-panel__date-option {
  flex-shrink: 0;
  font-size: 26px;
  font-weight: 400;
  color: #6b7370;
  line-height: 1;

  &.is-selected {
    color: #167a4a;
  }
}

.filter-panel__filter {
  flex-shrink: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 26px;
  font-weight: 400;
  color: #6b7370;
  line-height: 1;
}

.filter-panel__filter-icon {
  margin-left: 6px;
  font-size: 22px;
  color: #6b7370;
  line-height: 1;
}

/* ---- 主体 chips ---- */

.filter-panel__chip {
  width: 168px;
  height: 64px;
  line-height: 64px;
  margin-right: 16px;
  margin-bottom: 16px;
  font-size: 24px;
  font-weight: 400;
  color: #1c1f1e;
  background-color: #f1f4f8;
  border-radius: 8px;
  text-align: center;
  box-sizing: border-box;

  &.is-selected {
    color: #167a4a;
    background-color: #e8f5ee;
  }
}

.filter-panel__group-options {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 0;
}

/* ---- 主体 group ---- */
.filter-panel__body {
  padding: 24px 24px 0 ;

}

.filter-panel__group {
  margin-bottom: 24px;
}

.filter-panel__group-title {
  display: block;
  margin-bottom: 20px;
  font-size: 28px;
  font-weight: 500;
  line-height: 1.2;
  color: #1c1f1e;
}

/* ---- 底部 ---- */
.filter-panel__footer {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 8px;
}

.filter-panel__btn {
  flex: 1;
  height: 88px;
  line-height: 88px;
  text-align: center;
  font-size: 28px;
  font-weight: 500;
  border-radius: 0;
  box-sizing: border-box;

  & + & {
    margin-left: 0;
  }

  &--reset {
    color: #1c1f1e;
    background-color: #ffffff;
    border: 1px solid #e5e7eb;
  }

  &--confirm {
    color: #ffffff;
    background: $color-gradient-btn;
  }
}
</style>
