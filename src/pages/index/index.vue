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
      <view class="section-title">核心状态架构 (Pinia + 持久化)</view>
      <view class="tag-grid">
        <view class="tag-item">Vue 3 Composition API</view>
        <view class="tag-item">Pinia 状态持久化</view>
        <view class="tag-item">别名路由封装 router.push</view>
        <view class="tag-item">原生 uni.request</view>
        <view class="tag-item">MD5 加密签名注入</view>
        <view class="tag-item">Vite 代理跨域 (CORS)</view>
        <view class="tag-item">AppID: wx74ff1858ef8d829a</view>
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

<script setup>
import { ref, computed } from 'vue'
import { queryMiniAppInfo } from '@/api'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()
const loading = ref(false)

const requestResult = computed(() => {
  return JSON.stringify(appStore.miniAppInfo, null, 2)
})

const handleGoToDemo = () => {
  // 使用封装的 router 别名跳转，支持传入对象参数
  router.push('demo', { from: 'home', time: Date.now() })
}

const handleFetchMiniApp = async () => {
  loading.value = true
  try {
    const res = await queryMiniAppInfo()
    if (res && res.miniApp) {
      // 更新数据到 Pinia Store（自动触发视图响应式刷新 & uni-storage 持久化）
      appStore.setMiniAppInfo(res.miniApp)
      uni.showToast({ title: 'Pinia 状态已同步并持久化', icon: 'success' })
    }
  } catch (err) {
    console.log('测试环境展示假数据示意', err)
    // 模拟演示真实数据写入 Pinia
    appStore.setMiniAppInfo({
      id: 49,
      name: '伏见桃山演示馆',
      centerId: 10000000,
      logo: 'http://xports-test.oss-cn-hangzhou.aliyuncs.com/dev/center/10000000/images/40fd9ec75b351c5a.jpg',
      theme: 'primary-blue'
    })
    uni.showToast({ title: '演示数据已更新至 Pinia', icon: 'none' })
  } finally {
    loading.value = false
  }
}

const handleClearPinia = () => {
  appStore.clearMiniAppInfo()
  uni.showToast({ title: 'Pinia 状态已清空', icon: 'none' })
}
</script>

<style scoped>
.container {
  padding: 30rpx;
}

.header-card {
  background: linear-gradient(135deg, #42b883 0%, #35495e 100%);
  border-radius: 24rpx;
  padding: 50rpx 30rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 10rpx 30rpx rgba(66, 184, 131, 0.25);
  margin-bottom: 30rpx;
}

.logo {
  width: 140rpx;
  height: 140rpx;
  border-radius: 70rpx;
  margin-bottom: 20rpx;
  background-color: #ffffff;
}

.title {
  font-size: 38rpx;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 12rpx;
}

.subtitle {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.85);
}

.section {
  margin-bottom: 30rpx;
}

.section-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #333333;
  margin-bottom: 20rpx;
  padding-left: 16rpx;
  border-left: 8rpx solid #42b883;
}

.tag-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.tag-item {
  background-color: #ffffff;
  color: #42b883;
  border: 2rpx solid #e1f5eb;
  padding: 16rpx 24rpx;
  border-radius: 12rpx;
  font-size: 26rpx;
  font-weight: 500;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.03);
}

.card {
  background-color: #ffffff;
  border-radius: 20rpx;
  padding: 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
}

.card-desc {
  font-size: 26rpx;
  color: #666666;
  margin-bottom: 24rpx;
  display: block;
}

.btn {
  border-radius: 12rpx;
  font-size: 28rpx;
  height: 88rpx;
  line-height: 88rpx;
  border: none;
}

.btn-demo {
  background-color: #3b82f6;
  color: #ffffff;
  font-weight: 600;
}

.btn-primary {
  background-color: #42b883;
  color: #ffffff;
}

.btn-primary:active {
  background-color: #3aa876;
}

.btn-outline {
  background-color: #f8f9fa;
  color: #666666;
  border: 2rpx solid #e2e8f0;
}

.result-box {
  margin-top: 24rpx;
  padding: 20rpx;
  background-color: #f8f9fa;
  border-radius: 12rpx;
  border: 2rpx solid #eaedf1;
}

.result-title {
  font-size: 24rpx;
  font-weight: 600;
  color: #666666;
  display: block;
  margin-bottom: 10rpx;
}

.result-content {
  font-size: 24rpx;
  color: #333333;
  font-family: monospace;
  white-space: pre-wrap;
  word-break: break-all;
}
</style>
