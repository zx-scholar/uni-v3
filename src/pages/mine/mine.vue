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

<script>
import { useAppStore } from '@/stores/app'

export default {
  name: 'MinePage',
  data() {
    return {}
  },
  computed: {
    appStore() {
      return useAppStore()
    }
  },
  methods: {
    handleGoDemo() {
      router.push('demo')
    },
    handleClear() {
      this.appStore.clearMiniAppInfo()
      uni.showToast({ title: '缓存已重置', icon: 'none' })
    }
  }
}
</script>

<!-- 导入独立的 mine.scss 样式文件 -->
<style lang="scss" scoped src="./mine.scss"></style>
