<template>
  <view v-if="visible" class="coming-soon-overlay" @click="handleClose">
    <view class="coming-soon-card" @click.stop>
      <image class="coming-soon-image" :src="currentImage" mode="aspectFit" />
      <text class="coming-soon-title">敬请期待</text>
      <text class="coming-soon-text">{{ text }}</text>
      <view class="coming-soon-btn" @click="handleClose">
        <text class="coming-soon-btn-text">我知道了</text>
      </view>
    </view>
  </view>
</template>

<script>
// OSS 基础地址前缀（与 variables.scss 中 $img-base 保持一致）
const OSS_PREFIX = 'https://xports-test.oss-cn-hangzhou.aliyuncs.com/dev/';

// 默认敬请期待图片（对应 variables.scss 中 $img-card-bg）
const DEFAULT_IMAGE = `${OSS_PREFIX}gameImage0a0d1b36b4274705b37b90d303862704.png`;

export default {
  name: 'ComingSoon',
  props: {
    visible: { type: Boolean, default: false },
    text: { type: String, default: '该功能正在加紧建设中，敬请期待～' },
    // 自定义图片，不传时使用默认图
    image: { type: String, default: '' },
  },
  emits: ['update:visible', 'close'],
  computed: {
    currentImage() {
      return this.image || DEFAULT_IMAGE;
    },
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false);
      this.$emit('close');
    },
  },
};
</script>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

/* ========== 遮罩层 ========== */
.coming-soon-overlay {
  position: fixed;
  inset: 0;
  z-index: 9998;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  animation: fadeIn 0.25s ease;
}

/* ========== 弹窗卡片 ========== */
.coming-soon-card {
  width: 540px;
  height: 616px;
  padding: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: $color-bg-card;
  border-radius: $size-radius-pro;
  box-shadow: $color-shadow-md;
  animation: scaleIn 0.25s ease-out;
  box-sizing: border-box;

  .coming-soon-image {
    width: 410px;
    height: 274px;
  }

  .coming-soon-title {
    margin-top: 20px;
    font-size: $size-font-xxl;
    font-weight: 600;
    color: $color-text-primary;
  }

  .coming-soon-text {
    margin-top: 12px;
    font-size: $size-font-base;
    color: $color-text-secondary;
    line-height: 1.6;
    text-align: center;
  }

  .coming-soon-btn {
    margin-top: auto;
    width: 320px;
    height: 72px;
    line-height: 72px;
    text-align: center;
    background: $color-gradient-btn;
    border-radius: 999px;

    &:active {
      opacity: 0.9;
    }

    .coming-soon-btn-text {
      font-size: $size-font-md;
      font-weight: 600;
      color: $color-text-white;
    }
  }
}

/* ========== 动画关键帧 ========== */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.85);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
