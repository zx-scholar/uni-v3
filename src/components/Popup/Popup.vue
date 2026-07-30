<template>
  <view>
    <!-- 遮罩层 -->
    <view v-if="visible" class="popup-overlay" @click="handleOverlayClick" />

    <!-- 弹出框主体 -->
    <view v-if="visible" class="popup-wrapper" :class="'popup-mode-' + mode" @touchmove.prevent>
      <view class="popup-content" :class="'popup-content-' + mode" :style="contentStyle">
        <!-- 标题栏 -->
        <view v-if="title" class="popup-header">
          <text class="popup-title">{{ title }}</text>
          <text v-if="closeable" class="popup-close iconfont icon-cuowu2" @click="handleClose"></text>
        </view>

        <!-- 内容区 -->
        <scroll-view class="popup-body" scroll-y>
          <slot />
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'Popup',
  props: {
    visible: { type: Boolean, default: false },
    // bottom - 底部滑出 | center - 居中弹窗
    mode: { type: String, default: 'bottom' },
    title: { type: String, default: '' },
    closeable: { type: Boolean, default: true },
    maskClosable: { type: Boolean, default: true },
    maxHeight: { type: String, default: '70vh' },
    width: { type: String, default: '' }, // 居中模式专用：弹窗宽度（如 600rpx）
  },
  emits: ['update:visible', 'close'],
  computed: {
    contentStyle() {
      const style = { maxHeight: this.maxHeight };
      if (this.mode === 'center' && this.width) {
        style.width = this.width;
      }
      return style;
    },
  },
  methods: {
    handleOverlayClick() {
      if (this.maskClosable) this.handleClose();
    },
    handleClose() {
      this.$emit('update:visible', false);
      this.$emit('close');
    },
  },
};
</script>

<style scoped>
/* ========== 遮罩层 ========== */
.popup-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9998;
  animation: fadeIn 0.25s ease;
}

/* ========== 底部滑出模式 ========== */
.popup-mode-bottom {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  animation: slideUp 0.3s ease;
}

.popup-content-bottom {
  background: #ffffff;
  border-radius: 24rpx 24rpx 0 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding-bottom: env(safe-area-inset-bottom, 0px);
}

/* ========== 居中弹窗模式 ========== */
.popup-mode-center {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none; /* 让点击穿透到遮罩 */
}

.popup-content-center {
  width: 85%;
  max-width: 600rpx;
  background: #ffffff;
  border-radius: 24rpx;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  pointer-events: auto; /* 内容区域可点击 */
  animation: scaleIn 0.3s ease;
}

/* ========== 标题栏 ========== */
.popup-header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30rpx 24rpx;
  position: relative;
  border-bottom: 1rpx solid #f1f5f9;
  flex-shrink: 0;
}

.popup-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #1c1f1e;
}

.popup-close {
  position: absolute;
  right: 24rpx;
  top: 50%;
  transform: translateY(-50%);
  font-size: 28rpx;
  color: #94a3b8;
  padding: 10rpx;
}

/* ========== 内容区 ========== */
.popup-body {
  flex: 1;
  padding: 24rpx;
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

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
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
