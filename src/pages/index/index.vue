<template>
  <view class="container">
    <!-- Header Banner using Pinia Store state -->
    <view class="header-card">
      <image class="logo" :src="appStore.logo || '/static/logo.png'" mode="aspectFit"></image>
      <text class="title">{{ appStore.appName || 'uni-app + Pinia' }}</text>
      <text class="subtitle">CenterID: {{ appStore.centerId || '未加载 (点击下方按钮同步)' }}</text>
    </view>

    <!-- Navigation Entry to Demo Page -->
    <view class="section">
      <button class="btn btn-demo" @click="handleGoToDemo">
        📖 打开 Vue2 转 Vue3 + Pinia 教程示例页
      </button>

    </view>

    <!-- Tech Stack Feature Badges -->
    <view class="section">
      <view class="section-title">核心架构 (SCSS 样式隔离导入)</view>
      <view class="tag-grid">
        <view class="tag-item">独立 .scss 文件导入</view>
        <view class="tag-item">px 编译期自动转 rpx</view>
        <view class="tag-item">Vue3 Options API (选项式)</view>
        <view class="tag-item">Pinia 状态持久化</view>
        <view class="tag-item">别名路由封装 router.push</view>
        <view class="tag-item">原生 uni.request + MD5 算签</view>
      </view>
    </view>

    <!-- Demo Action Section -->
    <view class="section">
      <view class="section-title">Pinia 状态同步测试</view>
      <view class="card">
        <text class="card-desc">点击以下按钮调用接口并更新数据到 Pinia Store：</text>
        <button class="btn btn-primary" @click="handleFetchMiniApp" :loading="loading">
          调用接口并存入 Pinia Store
        </button>
        <button class="btn btn-outline" @click="handleClearPinia" style="margin-top: 16rpx;">
          清空 Pinia 状态
        </button>

        <view v-if="requestResult" class="result-box">
          <text class="result-title">Pinia Store 当前数据：</text>
          <text class="result-content">{{ requestResult }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { queryMiniAppInfo } from '@/api'
import { useAppStore } from '@/stores/app'

export default {
  name: 'IndexPage',
  data() {
    return {
      loading: false
    }
  },
  onLoad() {
    // this.handleFetchMiniApp()
  },
  computed: {
    appStore() {
      return useAppStore()
    },
    requestResult() {
      return JSON.stringify(this.appStore.miniAppInfo, null, 2)
    }
  },
  methods: {
    handleGoToDemo() {
      router.push('demo', { from: 'home', time: Date.now() })
    },

    async handleFetchMiniApp() {
      this.loading = true
      try {
        const res = await queryMiniAppInfo()
        if (res && res.miniApp) {
          this.appStore.setMiniAppInfo(res.miniApp)
          uni.showToast({ title: 'Pinia 状态已同步并持久化', icon: 'success' })
        }
      } catch (err) {
        this.appStore.setMiniAppInfo({
          id: 49,
          name: '伏见桃山演示馆',
          centerId: 10000000,
          logo: 'http://xports-test.oss-cn-hangzhou.aliyuncs.com/dev/center/10000000/images/40fd9ec75b351c5a.jpg',
          theme: 'primary-blue'
        })
        uni.showToast({ title: '演示数据已更新至 Pinia', icon: 'none' })
      } finally {
        this.loading = false
      }
    },
    handleClearPinia() {
      this.appStore.clearMiniAppInfo()
      uni.showToast({ title: 'Pinia 状态已清空', icon: 'none' })
    }
  }
}
</script>

<!-- 引入独立的 SCSS 样式文件，开启 scoped 隔离 -->
<style lang="scss" scoped src="./index.scss"></style>
