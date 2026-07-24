<template>
  <view class="page-container">
    <NavBar title="个人中心" :showBack="false" />

    <view class="content">
      <view class="user-card">
        <image class="avatar" :src="appStore.logo || '/static/logo.png'" mode="aspectFit"></image>
        <view class="user-info">
          <text class="user-name">{{ appStore.appName || '未登录/未加载' }}</text>
          <text class="user-id">CenterID: {{ appStore.centerId || '无' }}</text>
        </view>
      </view>

      <view class="menu-list">
        <view class="menu-item" @click="handleGoDemo">
          <text class="menu-title">📖 Vue3 + Pinia 教程示例页</text>
          <text class="arrow">›</text>
        </view>
        <view class="menu-item" @click="handleClear">
          <text class="menu-title">🧹 清空 Pinia 状态与缓存</text>
          <text class="arrow">›</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()

const handleGoDemo = () => {
  router.push('demo')
}

const handleClear = () => {
  appStore.clearMiniAppInfo()
  uni.showToast({ title: '缓存已重置', icon: 'none' })
}
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  background-color: #f5f7fa;
}

.content {
  padding: 30rpx;
}

.user-card {
  background: linear-gradient(135deg, #42b883 0%, #35495e 100%);
  border-radius: 20rpx;
  padding: 40rpx 30rpx;
  display: flex;
  align-items: center;
  margin-bottom: 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
}

.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 60rpx;
  margin-right: 24rpx;
  background-color: #ffffff;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 34rpx;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 8rpx;
}

.user-id {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.8);
}

.menu-list {
  background-color: #ffffff;
  border-radius: 20rpx;
  padding: 0 30rpx;
}

.menu-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx 0;
  border-bottom: 2rpx solid #f1f5f9;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-title {
  font-size: 28rpx;
  color: #334155;
}

.arrow {
  font-size: 36rpx;
  color: #94a3b8;
}
</style>
