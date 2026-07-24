<template>
  <view class="page-container">
    <NavBar title="账号登录" />

    <view class="content">
      <view class="login-box">
        <text class="login-title">欢迎登录</text>
        <text class="login-sub">uni-app + Pinia 认证入口</text>

        <button class="btn btn-primary" @click="handleSimulateLogin">
          一键模拟登录
        </button>
      </view>
    </view>
  </view>
</template>

<script>
import { useAppStore } from '@/stores/app'

export default {
  name: 'LoginPage',
  data() {
    return {}
  },
  computed: {
    appStore() {
      return useAppStore()
    }
  },
  methods: {
    handleSimulateLogin() {
      this.appStore.setMiniAppInfo({
        id: 49,
        name: '伏见桃山演示馆',
        centerId: 10000000,
        logo: 'http://xports-test.oss-cn-hangzhou.aliyuncs.com/dev/center/10000000/images/40fd9ec75b351c5a.jpg',
        token: 'mock-jwt-token-123456'
      })
      uni.showToast({ title: '登录成功', icon: 'success' })
      setTimeout(() => {
        router.back()
      }, 1000)
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
  padding: 40rpx 30rpx;
}

.login-box {
  background-color: #ffffff;
  border-radius: 24rpx;
  padding: 60rpx 40rpx;
  text-align: center;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
}

.login-title {
  font-size: 40rpx;
  font-weight: bold;
  color: #1e293b;
  display: block;
  margin-bottom: 12rpx;
}

.login-sub {
  font-size: 26rpx;
  color: #64748b;
  display: block;
  margin-bottom: 40rpx;
}

.btn-primary {
  background-color: #42b883;
  color: #ffffff;
  font-size: 28rpx;
  height: 88rpx;
  line-height: 88rpx;
  border-radius: 12rpx;
  border: none;
}
</style>
