<template>
  <view v-if="visible" class="share-overlay" @click.self="handleClose">
    <!-- 中间海报区域 -->
    <view class="poster-container" @click.self="handleClose">
      <image class="share-poster-img" :src="poster" mode="aspectFill" @click="previewImg" />
    </view>

    <!-- 底部面板 -->
    <view class="share-bottom-panel">
      <!-- 标题及关闭按钮 -->
      <view class="panel-header">
        <text class="panel-title">分享至</text>
        <text class="panel-close iconfont icon-cuowu2" @click="handleClose"></text>
      </view>

      <!-- 分享渠道 -->
      <view class="share-channels">
        <block v-for="channel in channels" :key="channel.label">
          <button
            v-if="channel.shareButton"
            class="share-channel"
            open-type="share"
            @tap="handleChannelClick(channel.label)"
          >
            <image class="channel-icon" :src="channel.image" mode="aspectFill" />
            <text class="channel-label">{{ channel.label }}</text>
          </button>
          <view v-else class="share-channel" @click="handleChannelClick(channel.label)">
            <image class="channel-icon" :src="channel.image" mode="aspectFill" />
            <text class="channel-label">{{ channel.label }}</text>
          </view>
        </block>
      </view>

      <!-- 底部安全区 -->
      <view class="bottom-safe-area"></view>
    </view>
  </view>
</template>

<script>
// OSS 基础地址前缀（与 variables.scss 中 $img-base 保持一致）
const OSS_PREFIX = 'https://xports-test.oss-cn-hangzhou.aliyuncs.com/dev/';

// 分享相关图片（网络图片）
const SHARE_IMAGES = {
  poster: `${OSS_PREFIX}gameImagef591b3b9c8194e39a17df41be7b715e0.png`,
  wechatFriend: `${OSS_PREFIX}gameImage469cb7614a7c45fe9c9ca69af8cd5cdb.png`,
  save: `${OSS_PREFIX}gameImage5200ab66c9204de686f929fc0cb6e5b9.png`,
  friendCircle: `${OSS_PREFIX}gameImage6fa27aa9e79c4714b1d86afd47438472.png`,
  link: `${OSS_PREFIX}gameImage43f5d9ccad6d41ff9f837065402a8e36.png`,
};

// 分享渠道列表（shareButton 为 true 时渲染原生分享按钮）
const SHARE_CHANNELS = [
  { label: '微信好友', image: SHARE_IMAGES.wechatFriend, shareButton: true },
  { label: '朋友圈', image: SHARE_IMAGES.friendCircle },
  { label: '保存图片', image: SHARE_IMAGES.save },
  { label: '复制链接', image: SHARE_IMAGES.link },
];

export default {
  name: 'ShareDialog',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['close', 'share'],
  data() {
    return {
      poster: SHARE_IMAGES.poster,
      channels: SHARE_CHANNELS,
    };
  },
  methods: {
    handleClose() {
      this.$emit('close');
    },
    handleSaveFail(err) {
      uni.hideLoading();
      if (err.errMsg && (err.errMsg.indexOf('privacy') > -1 || err.errMsg.indexOf('agree') > -1)) {
        uni.showModal({
          title: '温馨提示',
          content: '由于小程序未在隐私保护指引中声明"保存图片到相册"权限，导致保存失败。请联系管理员登录微信公众平台补充隐私协议，或长按上方图片进行保存/分享。',
          showCancel: false,
          success: () => {
            this.handleClose();
          },
        });
      } else {
        uni.showToast({
          title: '保存失败',
          icon: 'none',
        });
        this.handleClose();
      }
      console.error(err);
    },
    previewImg() {
      uni.previewImage({
        current: this.poster,
        urls: [this.poster],
      });
    },
    handleChannelClick(channel) {
      console.log(`用户选择分享渠道: ${channel}`);
      this.$emit('share', channel);
      switch (channel) {
        case '朋友圈':
          uni.showToast({
            title: '请点击右上角"..."分享到朋友圈',
            icon: 'none',
          });
          this.handleClose();
          break;
        case '保存图片':
          this.savePoster();
          break;
        case '复制链接':
          this.copyLink();
          break;
        default:
          this.handleClose();
      }
    },
    savePoster() {
      uni.showLoading({
        title: '正在保存海报...',
      });
      // 网络图片：先获取本地临时路径，再保存到相册
      uni.getImageInfo({
        src: this.poster,
        success: (res) => {
          uni.saveImageToPhotosAlbum({
            filePath: res.path,
            success: () => {
              uni.hideLoading();
              uni.showToast({
                title: '保存成功',
                icon: 'success',
              });
              this.handleClose();
            },
            fail: (err) => {
              this.handleSaveFail(err);
            },
          });
        },
        fail: (err) => {
          uni.hideLoading();
          uni.showToast({
            title: '获取图片信息失败',
            icon: 'none',
          });
          console.error(err);
          this.handleClose();
        },
      });
    },
    copyLink() {
      uni.setClipboardData({
        data: '#小程序://尊享体育/faUkrZxHRkZCQ9x',
        success: () => {
          this.handleClose();
        },
        fail: () => {
          this.handleClose();
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

/* ========== 分享弹窗遮罩 ========== */
.share-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.65);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  animation: fadeIn 0.25s ease;
}

/* ========== 海报容器 ========== */
.poster-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  animation: posterIn 0.25s ease-out;

  .share-poster-img {
    width: 600px;
    height: 772px;
    border-radius: 36px;
    box-shadow: 0 12px 36px rgba(0, 0, 0, 0.3);
  }
}

/* ========== 底部面板 ========== */
.share-bottom-panel {
  background-color: $color-bg-card;
  border-radius: 36px 36px 0 0;
  padding: 40px 48px;
  display: flex;
  flex-direction: column;
  animation: slideUp 0.25s ease-out;
}

/* ========== 面板头部 ========== */
.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 48px;

  .panel-title {
    font-size: $size-font-xl;
    font-weight: 600;
    color: $color-text-primary;
  }

  .panel-close {
    font-size: $size-font-xl;
    color: $color-text-sub;
    padding: 8px;

    &:active {
      color: $color-text-secondary;
    }
  }
}

/* ========== 分享渠道行 ========== */
.share-channels {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 12px;
  margin-bottom: 24px;

  .share-channel {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: none;
    border: none;
    padding: 0;
    margin: 0;
    line-height: normal;
    font-family: inherit;

    &::after {
      border: none;
    }

    &:active {
      opacity: 0.7;
    }

    .channel-icon {
      width: 88px;
      height: 88px;
      margin-bottom: 16px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
      border-radius: 50%;
    }

    .channel-label {
      font-size: $size-font-sm;
      color: $color-text-secondary;
      font-weight: 500;
    }
  }
}

/* ========== 底部安全区 ========== */
.bottom-safe-area {
  height: 34px;
  padding-bottom: env(safe-area-inset-bottom, 0px);
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

@keyframes posterIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
