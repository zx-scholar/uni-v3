<template>
  <view class="page-container">
    <NavBar title="个人中心" :showBack="false" />

    <view class="content">
      <view class="user-card" :class="{ 'login-entry': !userStore.isLoggedIn }" @click="handleUserCardClick">
        <image class="avatar" :src="userAvatar" mode="aspectFill"></image>
        <view class="user-info">
          <text class="user-name">{{ userName }}</text>
          <text class="user-id">{{ userDescription }}</text>
        </view>
        <text v-if="!userStore.isLoggedIn" class="login-arrow">›</text>
      </view>

      <view class="menu-list">
        <view class="menu-item" @click="handleGoTemplate">
          <text class="menu-title">📄 通用标准页面模板 (顶栏+滚动+底栏)</text>
          <text class="arrow">›</text>
        </view>
        <view class="menu-item" @click="handleGoDemo">
          <text class="menu-title">📖 Vue3 + Pinia 教程示例页</text>
          <text class="arrow">›</text>
        </view>
        <view class="menu-item" @click="handleGoBrowsingHistory">
          <text class="menu-title">浏览记录</text>
          <text class="arrow">›</text>
        </view>
        <view class="menu-item" @click="handleGoEventsPlan">
          <text class="menu-title">赛程总览</text>
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
import { useUserStore } from '@/stores/user'

export default {
  name: 'MinePage',
  data() {
    return {}
  },
  computed: {
    appStore() {
      return useAppStore()
    },
    userStore() {
      return useUserStore()
    },
    userAvatar() {
      return this.userStore.isLoggedIn
        ? this.userStore.userInfo.avatarUrl || '/static/logo.png'
        : '/static/logo.png'
    },
    userName() {
      return this.userStore.isLoggedIn
        ? this.userStore.userInfo.nickName || '微信用户'
        : '点击登录'
    },
    userDescription() {
      return this.userStore.isLoggedIn
        ? `手机号：${this.userStore.phoneNum || '未绑定'}`
        : '登录后查看个人信息'
    }
  },
  methods: {
    handleUserCardClick() {
      if (!this.userStore.isLoggedIn) {
        router.push('login')
      }
    },
    handleGoTemplate() {
      router.push('template')
    },
    handleGoDemo() {
      router.push('demo')
    },
    handleGoBrowsingHistory() {
      router.push('browsingHistory')
    },
    handleGoEventsPlan() {
      router.push('eventsPlan')
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
