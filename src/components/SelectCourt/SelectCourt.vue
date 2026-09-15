<template>
  <BasePopup
    :visible="visible"
    mode="bottom"
    title="选择已预订场地"
    :mask-closable="true"
    :max-height="'80vh'"
    @update:visible="$emit('update:visible', $event)"
  >
    <view class="select-court">
      <!-- 场地列表 -->
      <view class="select-court__list">
        <view
          v-for="(item, idx) in list"
          :key="item.id || idx"
          class="select-court__item"
          :class="{ 'is-selected': modelValue === item.id }"
          @click="handleSelect(item)"
        >
          <!-- 标题：场地名 + 时段 -->
          <text class="select-court__title">{{ item.title }}</text>

          <!-- 时间 -->
          <view class="select-court__line">
            <text class="iconfont icon-shijian1 select-court__line-icon"></text>
            <text class="select-court__line-text">{{ item.dateTime }}</text>
          </view>

          <!-- 地点 -->
          <view class="select-court__line">
            <text class="iconfont icon-weizhi3 select-court__line-icon"></text>
            <text class="select-court__line-text">{{ item.location }}</text>
          </view>

          <!-- 选中态右下角装饰：背景图 + CSS 三角 + 对勾 -->
          <view v-if="modelValue === item.id" class="select-court__corner">
            <view class="select-court__corner-triangle"></view>
            <text class="iconfont icon-zhengque select-court__corner-icon"></text>
          </view>
        </view>
      </view>

      <!-- 底部按钮 -->
      <view class="select-court__actions">
        <view
          class="select-court__btn select-court__btn--rebook"
          @click="handleRebook"
        >重新预约</view>
        <view
          class="select-court__btn select-court__btn--confirm"
          @click="handleConfirm"
        >确定选场</view>
      </view>
    </view>
  </BasePopup>
</template>

<script>
import BasePopup from '@/components/BasePopup/BasePopup.vue';

export default {
  name: 'SelectCourt',
  components: { BasePopup },
  props: {
    visible: { type: Boolean, default: false },
    // 场地列表：[{ id, title, dateTime, location }]
    list: {
      type: Array,
      default: () => [],
    },
    // 当前选中的场地 id
    modelValue: { type: [String, Number], default: '' },
  },
  emits: ['update:visible', 'update:modelValue', 'select', 'rebook', 'confirm'],
  methods: {
    handleSelect(item) {
      this.$emit('update:modelValue', item.id);
      this.$emit('select', item);
    },
    handleRebook() {
      this.$emit('update:visible', false);
      this.$emit('rebook');
    },
    handleConfirm() {
      this.$emit('update:visible', false);
      this.$emit('confirm', this.modelValue);
    },
  },
};
</script>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

.select-court {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0 24px;
  box-sizing: border-box;
}

.select-court__list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 8px 0 32px;
}

.select-court__item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 12px;
  padding: 24px 24px;
  border: 1px solid #e8ecef;
  border-radius: 12px;
  background-color: #ffffff;
  box-sizing: border-box;
  overflow: hidden;

  &.is-selected {
    background-color: #f2faf6;
    border-color: #167a4a;
    background-image: url('https://xports-prd.oss-cn-hangzhou.aliyuncs.com/prd/gameImage3ef535c6815644fd94da0006d0d6b273.png');
    background-repeat: no-repeat;
    background-position: right bottom;
    background-size: 96px 96px;
  }
}

.select-court__title {
  font-size: 32px;
  font-weight: 500;
  color: #167a4a;
  line-height: 32px;
}

.select-court__item:not(.is-selected) .select-court__title {
  color: #1c1f1e;
}

.select-court__line {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
}

.select-court__line-icon {
  font-size: 24px;
  color: #6b7370;
  line-height: 1;
}

.select-court__line-text {
  font-size: 26px;
  font-weight: 400;
  color: #6b7370;
  line-height: 1.4;
}

.select-court__corner {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 44px;
  height: 44px;
  pointer-events: none;
  z-index: 1;
}

.select-court__corner-triangle {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 0 44px 44px;
  border-color: transparent transparent #167a4a transparent;
}

.select-court__corner-icon {
  position: absolute;
  right: 4px;
  bottom: 4px;
  font-size: 20px;
  color: #ffffff;
  line-height: 1;
}

.select-court__actions {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 24px 0 32px;
  box-sizing: border-box;
}

.select-court__btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 339px;
  height: 90px;
  border-radius: 45px;
  font-size: 32px;
  font-weight: 500;
  line-height: 1;
  box-sizing: border-box;
}

.select-court__btn--rebook {
  color: #167a4a;
  background-color: #ffffff;
  border: 1px solid #167a4a;
}

.select-court__btn--confirm {
  color: #ffffff;
  background: $color-gradient-btn;
  border: none;
}
</style>
