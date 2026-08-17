<template>
  <view v-if="visible" class="insurance-prompt-overlay" @click="handleClose">
    <view class="insurance-prompt-card" @click.stop>
      <!-- 虚线边框图片区 482×334 -->
      <view class="insurance-prompt-image-box">
        <image class="insurance-prompt-image" :src="currentImage" mode="aspectFit" />
      </view>

      <!-- 文案 -->
      <text class="insurance-prompt-title">{{ title }}</text>
      <text class="insurance-prompt-desc">{{ desc }}</text>

      <!-- 双按钮 -->
      <view class="insurance-prompt-actions">
        <view class="insurance-prompt-btn insurance-prompt-btn--secondary" @click="handleCancel">
          <text class="insurance-prompt-btn-text">跳过</text>
        </view>
        <view class="insurance-prompt-btn insurance-prompt-btn--primary" @click="handleConfirm">
          <text class="insurance-prompt-btn-text">立即购买</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
// OSS 基础地址前缀（生产环境）
const OSS_PREFIX = 'https://xports-prd.oss-cn-hangzhou.aliyuncs.com/prd/';

// 保险引导默认图片（对应需求中的盾牌插画）
const DEFAULT_IMAGE = `${OSS_PREFIX}gameImage672761d851fd476493632384e96f6626.png`;

export default {
  name: 'InsurancePrompt',
  props: {
    visible: { type: Boolean, default: false },
    title: { type: String, default: '您还未购买运动保险，是否购买？' },
    desc: { type: String, default: '为您的运动保驾护航，安心享受每一次运动' },
    // 自定义图片，不传时使用默认图
    image: { type: String, default: '' },
  },
  emits: ['update:visible', 'close', 'confirm', 'cancel'],
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
    handleCancel() {
      this.$emit('update:visible', false);
      this.$emit('cancel');
    },
    handleConfirm() {
      this.$emit('update:visible', false);
      this.$emit('confirm');
    },
  },
};
</script>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

/* ========== 遮罩层 ========== */
.insurance-prompt-overlay {
  position: fixed;
  inset: 0;
  z-index: 9998;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  animation: fadeIn 0.25s ease;
}

/* ========== 弹窗卡片 600×644 ========== */
.insurance-prompt-card {
  width: 600px;
  height: 644px;
  padding: 40px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: $color-bg-card;
  border-radius: $size-radius-pro;
  box-shadow: $color-shadow-md;
  animation: scaleIn 0.25s ease-out;
  box-sizing: border-box;

  /* ---- 虚线边框图片区 482×334 ---- */
  .insurance-prompt-image-box {
    width: 482px;
    height: 334px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    box-sizing: border-box;
  }

  .insurance-prompt-image {
    width: 100%;
    height: 100%;
  }

  /* ---- 文案 (32 / 26) ---- */
  .insurance-prompt-title {
    margin-top: 32px;
    font-size: 32px;
    font-weight: 600;
    color: $color-text-primary;
    text-align: center;
  }

  .insurance-prompt-desc {
    margin-top: 16px;
    font-size: 26px;
    color: $color-text-secondary;
    line-height: 1.6;
    text-align: center;
  }

  /* ---- 双按钮 240×72 ---- */
  .insurance-prompt-actions {
    margin-top: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 40px;
    width: 100%;
  }

  .insurance-prompt-btn {
    width: 240px;
    height: 72px;
    line-height: 72px;
    text-align: center;
    border-radius: 999px;
    box-sizing: border-box;

    /* 按钮通用交互态 */
    &:active {
      opacity: 0.9;
    }

    /* 跳过按钮：仅背景与文字色不同 */
    &.insurance-prompt-btn--secondary {
      background-color: #eaeaea;
      color: #999999;
    }

    /* 立即购买按钮：仅背景与文字色不同 */
    &.insurance-prompt-btn--primary {
      background: linear-gradient(90deg, #1186ff 0%, #4ecbfd 100%);
      color: $color-text-white;
    }

    .insurance-prompt-btn-text {
      font-size: 34px;
      font-weight: 400;
      color: inherit;
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