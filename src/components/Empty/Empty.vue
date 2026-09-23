<template>
  <view class="empty">
    <!-- 空状态背景图（CSS 背景图方式，可自定义宽高） -->
    <view class="empty__image" :style="imageStyle"></view>
    <text class="empty__text">{{ text }}</text>
    <button v-if="showAction" class="empty__action" @click="$emit('action')">{{ actionText }}</button>
  </view>
</template>

<script>
// OSS 基础地址前缀（与 variables.scss 中 $img-base 保持一致）
const OSS_PREFIX = 'https://xports-prd.oss-cn-hangzhou.aliyuncs.com/prd/';

// 默认空状态图片（对应 variables.scss 中 $img-card-bg）
const DEFAULT_IMAGE = `${OSS_PREFIX}gameImagef2456b5285d9448da357d27c1d103d7a.png`;

export default {
  name: 'Empty',
  props: {
    // 自定义图片，不传时使用默认空状态图
    image: { type: String, default: '' },
    // 提示文字
    text: { type: String, default: '暂无数据' },
    // 是否显示操作按钮
    showAction: { type: Boolean, default: false },
    // 操作按钮文字
    actionText: { type: String, default: '去逛逛' },
    // 背景图宽度（支持 px / rpx / %，默认 280rpx）
    imgWidth: { type: String, default: '280rpx' },
    // 背景图高度（支持 px / rpx / %，默认 280rpx）
    imgHeight: { type: String, default: '280rpx' },
  },
  emits: ['action'],
  computed: {
    currentImage() {
      return this.image || DEFAULT_IMAGE;
    },
    imageStyle() {
      return `width: ${this.imgWidth}; height: ${this.imgHeight}; background-image: url(${this.currentImage});`;
    },
  },
};
</script>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;

  // 空状态背景图
  &__image {
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
  }

  // 提示文字
  &__text {
    margin-top: 24px;
    font-size: 26px;
    color: $color-text-sub;
  }

  // 操作按钮
  &__action {
    margin-top: 32px;
    height: 64px;
    line-height: 64px;
    padding: 0 48px;
    font-size: 24px;
    font-weight: 500;
    color: $color-text-white;
    background: $color-gradient-btn;
    border: none;
    border-radius: 999px;

    &::after {
      border: none;
    }

    &:active {
      opacity: 0.9;
    }
  }
}
</style>
