<template>
  <view class="empty flex-column items-center">
    <image class="empty-image" :src="currentImage" mode="aspectFit" />
    <text class="empty-text">{{ text }}</text>
    <button v-if="showAction" class="empty-action" @click="$emit('action')">{{ actionText }}</button>
  </view>
</template>

<script>
// OSS 基础地址前缀（与 variables.scss 中 $img-base 保持一致）
const OSS_PREFIX = 'https://xports-test.oss-cn-hangzhou.aliyuncs.com/dev/';

// 默认空状态图片（对应 variables.scss 中 $img-card-bg）
const DEFAULT_IMAGE = `${OSS_PREFIX}gameImage0a0d1b36b4274705b37b90d303862704.png`;

export default {
  name: 'Empty',
  props: {
    // 自定义图片，不传时使用默认空状态图
    image: { type: String, default: '' },
    text: { type: String, default: '暂无数据' },
    showAction: { type: Boolean, default: false },
    actionText: { type: String, default: '去逛逛' },
  },
  emits: ['action'],
  computed: {
    currentImage() {
      return this.image || DEFAULT_IMAGE;
    },
  },
};
</script>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

.empty {
  padding: 80px 0;

  .empty-image {
    width: 300px;
    height: 300px;
  }

  .empty-text {
    margin-top: 24px;
    font-size: $size-font-base;
    color: $color-text-sub;
  }

  .empty-action {
    margin-top: 32px;
    height: 64px;
    line-height: 64px;
    padding: 0 48px;
    font-size: $size-font-sm;
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
