<template>
  <view class="nav-bar-wrapper" :style="wrapperCssVars">
    <!-- 1. 占位 View：防止下面的页面内容被 fixed 导航栏遮挡 -->
    <view v-if="placeholder" class="nav-bar-placeholder" :style="{ height: navBarTotalHeight + 'px' }"></view>

    <!-- 2. 真正的固定定位导航栏 Container -->
    <view class="nav-bar-fixed" :style="navBarStyle">
      <!-- 微信小程序状态栏安全区填充 -->
      <view :style="{ height: statusBarHeight + 'px' }"></view>

      <!-- 导航栏主体内容区 -->
      <view class="nav-bar-content" :style="{ height: navBarHeight + 'px' }">
        <!-- 左侧：返回按钮或自定义左侧插槽 -->
        <view class="nav-left" @click="handleBack">
          <slot name="left">
            <view v-if="shouldShowBack" class="back-btn">
              <text class="iconfont icon-zuo" :style="{ color: color, fontSize: '36rpx' }"></text>
              <text v-if="backText" class="back-text" :style="{ color: color }">{{ backText }}</text>
            </view>
          </slot>
        </view>

        <!-- 中间：标题或自定义中间插槽 -->
        <view class="nav-center">
          <slot>
            <text class="nav-title" :style="{ color: color, fontSize: fontSize, fontWeight: fontWeight }">
              {{ title }}
            </text>
          </slot>
        </view>

        <!-- 右侧：右侧插槽或右侧占位（小程序环境为微信胶囊预留避让空间） -->
        <view class="nav-right" :style="{ width: rightWidth + 'px' }">
          <slot name="right"></slot>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'NavBar',
  emits: ['back'],
  props: {
    // 标题文字
    title: {
      type: String,
      default: ''
    },
    // 标题颜色（适配浅色页面背景，默认黑色；页面有深色/渐变背景时请显式传入 color="#ffffff"）
    color: {
      type: String,
      default: '#333333'
    },
    // 标题字号
    fontSize: {
      type: String,
      default: '34rpx'
    },
    // 标题字重
    fontWeight: {
      type: String,
      default: '500'
    },
    // 背景样式 (支持 CSS 颜色、渐变色或 url('https://...'))
    background: {
      type: String,
      default: 'transparent'
    },
    // 导航栏主体高度（px，不含状态栏）。默认 0 表示自动计算
    height: {
      type: [Number, String],
      default: 0
    },
    // 是否显示返回按钮（默认 'auto'：自动判断页面栈 > 1 时显示）
    showBack: {
      type: [Boolean, String],
      default: 'auto'
    },
    // 返回按钮旁的提示文字
    backText: {
      type: String,
      default: ''
    },
    // 是否生成占位 View 占用页面高度
    placeholder: {
      type: Boolean,
      default: true
    }
  },

  data() {
    const initialMetrics = this.calcSystemNavBarInfo()
    return {
      statusBarHeight: initialMetrics.statusBar,
      autoContentHeight: initialMetrics.contentHeight,
      rightWidth: initialMetrics.rightEdge
    }
  },

  computed: {
    // 计算实际导航栏主体高度
    navBarHeight() {
      const customH = Number(this.height)
      return customH > 0 ? customH : this.autoContentHeight
    },

    // 计算导航栏总高度 (状态栏 + 主体内容高度)
    navBarTotalHeight() {
      return this.statusBarHeight + this.navBarHeight
    },

    // CSS 自定义变量
    wrapperCssVars() {
      return {
        '--status-bar-height': `${this.statusBarHeight}px`,
        '--nav-bar-height': `${this.navBarHeight}px`,
        '--nav-bar-total-height': `${this.navBarTotalHeight}px`
      }
    },

    // 动态合成导航栏 Style
    navBarStyle() {
      if (!this.background || this.background === 'transparent') {
        return {
          background: 'transparent',
          boxShadow: 'none'
        }
      }
      const isUrl = this.background.includes('http') || this.background.includes('url(')
      if (isUrl && !this.background.startsWith('url(')) {
        return {
          backgroundImage: `url(${this.background})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }
      }
      return {
        background: this.background
      }
    },

    // 是否应该显示返回按钮
    shouldShowBack() {
      if (this.showBack === true || this.showBack === 'true') return true
      if (this.showBack === false || this.showBack === 'false') return false

      const pages = getCurrentPages()
      return pages && pages.length > 1
    }
  },

  methods: {
    // 获取系统状态栏高度与胶囊位置
    calcSystemNavBarInfo() {
      let statusBar = 20
      let contentHeight = 44
      let rightEdge = 40

      try {
        const sysInfo = (typeof uni.getWindowInfo === 'function' ? uni.getWindowInfo() : null) ||
                         (typeof uni.getSystemInfoSync === 'function' ? uni.getSystemInfoSync() : null) || {}
        if (typeof sysInfo.statusBarHeight === 'number' && sysInfo.statusBarHeight >= 0) {
          statusBar = sysInfo.statusBarHeight
        }

        // #ifdef MP-WEIXIN
        const menuButton = uni.getMenuButtonBoundingClientRect()
        if (menuButton && menuButton.top && menuButton.height) {
          const gap = Math.max(0, menuButton.top - statusBar)
          contentHeight = menuButton.height + gap * 2
          if (sysInfo.screenWidth && menuButton.left) {
            rightEdge = Math.max(40, sysInfo.screenWidth - menuButton.left)
          }
        }
        // #endif
      } catch (e) {
        // 静默兜底
      }

      return { statusBar, contentHeight, rightEdge }
    },

    // 点击返回
    handleBack() {
      this.$emit('back')
      if (this.shouldShowBack) {
        uni.navigateBack({
          fail: () => {
            uni.redirectTo({ url: '/pages/index/index' })
          }
        })
      }
    }
  },

  mounted() {
    const latest = this.calcSystemNavBarInfo()
    if (latest.statusBar !== this.statusBarHeight) {
      this.statusBarHeight = latest.statusBar
    }
    if (latest.contentHeight !== this.autoContentHeight) {
      this.autoContentHeight = latest.contentHeight
    }
    if (latest.rightEdge !== this.rightWidth) {
      this.rightWidth = latest.rightEdge
    }
  }
}
</script>

<style scoped>
.nav-bar-wrapper {
  width: 100%;
}

.nav-bar-fixed {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  width: 100%;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
}

.nav-bar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24rpx;
  box-sizing: border-box;
}

.nav-left {
  display: flex;
  align-items: center;
  min-width: 80rpx;
  height: 100%;
}

.back-btn {
  display: flex;
  align-items: center;
  height: 100%;
  cursor: pointer;
}

.back-arrow {
  font-size: 48rpx;
  line-height: 1;
  font-weight: 300;
  margin-right: 4rpx;
}

.back-text {
  font-size: 28rpx;
}

.nav-center {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  overflow: hidden;
  padding: 0 12rpx;
}

.nav-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.nav-right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
}
</style>
