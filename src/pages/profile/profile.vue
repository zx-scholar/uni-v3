<template>
  <view class="page-container">
    <NavBar title="用户信息" />

    <view class="content">
      <view class="card">
        <view class="item">
          <text class="label">应用名称:</text>
          <text class="val">{{ appStore.appName || '未设置' }}</text>
        </view>
        <view class="item">
          <text class="label">场馆 CenterID:</text>
          <text class="val">{{ appStore.centerId || '无' }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { useAppStore } from '@/stores/app'

export default {
  name: 'ProfilePage',
  data() {
    return {}
  },
  computed: {
    appStore() {
      return useAppStore()
    }
  }
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

.card {
  background-color: #ffffff;
  border-radius: 20rpx;
  padding: 30rpx;
}

.item {
  display: flex;
  justify-content: space-between;
  padding: 16rpx 0;
  border-bottom: 2rpx solid #f1f5f9;
  font-size: 28rpx;
}

.item:last-child {
  border-bottom: none;
}

.label {
  color: #64748b;
}

.val {
  font-weight: 600;
  color: #1e293b;
}
</style>
