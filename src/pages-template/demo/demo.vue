<template>
  <view class="page-container">
    <NavBar 
      title="自定义导航栏 (Options API 示例)"
      background="linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)"
      color="#ffffff"
      fontSize="34rpx"
    />

    <view class="content">
      <view class="tip-card">
        <text class="tip-title">📦 Vue3 选项式 API (Options API) 页面：</text>
        <text class="tip-text">此页面已全面改造为 Options API 风格 (data, methods, computed, onLoad)。</text>
        <text class="tip-text">可以在 Vue3 中保持完美的 Vue2 习惯，完全兼容 Pinia 与全局路由工具！</text>
      </view>

      <!-- 0. Iconfont 阿里巴巴字体图标展示区 -->
      <view class="card">
        <view class="card-header">0. Iconfont 图标预览测试</view>
        <view class="icon-grid">
          <view class="icon-box"><text class="iconfont icon-shouyedian"></text><text class="icon-name">首页</text></view>
          <view class="icon-box"><text class="iconfont icon-wode-xian"></text><text class="icon-name">我的</text></view>
          <view class="icon-box"><text class="iconfont icon-saoma1"></text><text class="icon-name">扫码</text></view>
          <view class="icon-box"><text class="iconfont icon-xiaoxi"></text><text class="icon-name">消息</text></view>
          <view class="icon-box"><text class="iconfont icon-tongzhi"></text><text class="icon-name">通知</text></view>
          <view class="icon-box"><text class="iconfont icon-hetong"></text><text class="icon-name">合同</text></view>
          <view class="icon-box"><text class="iconfont icon-mingxi"></text><text class="icon-name">明细</text></view>
          <view class="icon-box"><text class="iconfont icon-xiugai"></text><text class="icon-name">修改</text></view>
        </view>
      </view>

      <!-- 1. Vue 选项式 API 基础练习区 -->
      <view class="card">
        <view class="card-header">1. Vue 选项式数据 (data & computed)</view>
        <view class="item">
          <text class="label">计数器 (this.count):</text>
          <text class="val">{{ count }}</text>
        </view>
        <view class="item">
          <text class="label">计算属性 (doubleCount):</text>
          <text class="val">{{ doubleCount }}</text>
        </view>
        <view class="item">
          <text class="label">对象数据 (this.userForm):</text>
          <text class="val">{{ userForm.name }} ({{ userForm.age }}岁)</text>
        </view>

        <view class="btn-group">
          <button class="btn btn-sm" @click="handleIncrement">this.count++</button>
          <button class="btn btn-sm btn-outline" @click="handleUpdateUser">修改 userForm 对象</button>
        </view>
      </view>

      <!-- 2. Pinia 状态管理操作区 -->
      <view class="card">
        <view class="card-header">2. Options API 中使用 Pinia</view>

        <view class="item">
          <text class="label">Store 中的应用名称:</text>
          <text class="val highlight">{{ appStore.appName || '暂无数据' }}</text>
        </view>
        <view class="item">
          <text class="label">Store 中的 CenterID:</text>
          <text class="val highlight">{{ appStore.centerId || '暂无数据' }}</text>
        </view>

        <view class="item">
          <text class="label">Store 加载状态:</text>
          <text class="val">{{ appStore.isLoaded ? '已加载' : '未加载' }}</text>
        </view>

        <view class="card-title-sm">修改 Pinia 的几种常用方式：</view>
        
        <button class="btn btn-primary" @click="handleActionUpdate">
          方式 ①：调用 Actions 方法 (this.appStore.setMiniAppInfo)
        </button>
        
        <button class="btn btn-secondary" @click="handleDirectUpdate" style="margin-top: 16rpx;">
          方式 ②：直接在 methods 中给 Store 变量赋值
        </button>

        <button class="btn btn-outline" @click="handleResetStore" style="margin-top: 16rpx;">
          清空 Pinia 状态与缓存
        </button>
      </view>

      <!-- 3. 异步 API 请求 + Pinia 集成区 -->
      <view class="card">
        <view class="card-header">3. 真实 API 请求与 Pinia 集成</view>
        <text class="card-desc">点击发起 /api/miniApp/queryMiniAppInfo 请求并自动更新到 Pinia：</text>
        <button class="btn btn-success" @click="handleFetchApi" :loading="loading">
          发起接口请求并存入 Store
        </button>
      </view>
    </view>
  </view>
</template>

<script>
import { queryMiniAppInfo } from '@/api'
import { useAppStore } from '@/stores/app'

export default {
  name: 'DemoPage',

  // 1. data 响应式状态声明 (原汁原味的 Vue2 习惯)
  data() {
    return {
      count: 10,
      loading: false,
      userForm: {
        name: '小明',
        age: 18
      }
    }
  },

  // 2. computed 计算属性
  computed: {
    // 映射 Pinia Store 实例
    appStore() {
      return useAppStore()
    },
    // 计算属性
    doubleCount() {
      return this.count * 2
    }
  },

  // 3. methods 页面方法集
  methods: {
    handleIncrement() {
      // 熟悉的 this 指针修改 data 变量
      this.count++
    },
    handleUpdateUser() {
      this.userForm.age += 1
      this.userForm.name = this.userForm.name === '小明' ? '小红' : '小明'
    },

    // 修改 Pinia 方式 1：调用 Action
    handleActionUpdate() {
      this.appStore.setMiniAppInfo({
        id: 99,
        name: 'Action修改的小程序',
        centerId: 88888888,
        logo: '/static/logo.png',
        theme: 'primary-blue'
      })
      uni.showToast({ title: '通过 Actions 更新成功', icon: 'none' })
    },

    // 修改 Pinia 方式 2：直接赋值
    handleDirectUpdate() {
      this.appStore.miniAppInfo.name = 'Options API 直接赋值修改'
      this.appStore.miniAppInfo.centerId = 99999999
      uni.showToast({ title: '直接赋值修改成功', icon: 'none' })
    },

    handleResetStore() {
      this.appStore.clearMiniAppInfo()
      uni.showToast({ title: 'Pinia 状态已清空', icon: 'none' })
    },

    // 异步接口请求
    async handleFetchApi() {
      this.loading = true
      try {
        const res = await queryMiniAppInfo()
        if (res && res.miniApp) {
          this.appStore.setMiniAppInfo(res.miniApp)
          uni.showToast({ title: '接口数据已同步到 Pinia', icon: 'success' })
        }
      } catch (err) {
        this.appStore.setMiniAppInfo({
          id: 49,
          name: '伏见桃山演示馆',
          centerId: 10000000,
          logo: 'http://xports-test.oss-cn-hangzhou.aliyuncs.com/dev/center/10000000/images/40fd9ec75b351c5a.jpg'
        })
        uni.showToast({ title: '模拟数据已同步到 Pinia', icon: 'none' })
      } finally {
        this.loading = false
      }
    }
  },

  // 4. uni-app / Vue 生命周期钩子 (直接在选项根级别声明)
  onLoad(options) {
    console.log('Options API onLoad 接收参数:', options)
  },
  onShow() {
    console.log('Options API onShow 页面显示')
  },
  mounted() {
    console.log('Options API mounted 挂载完成')
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

.tip-card {
  background-color: #eff6ff;
  border: 2rpx solid #bfdbfe;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 30rpx;
}

.tip-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #1e40af;
  display: block;
  margin-bottom: 12rpx;
}

.tip-text {
  font-size: 24rpx;
  color: #3b82f6;
  display: block;
  line-height: 1.6;
}

.card {
  background-color: #ffffff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.04);
}

.card-header {
  font-size: 30rpx;
  font-weight: bold;
  color: #2563eb;
  padding-bottom: 16rpx;
  margin-bottom: 20rpx;
  border-bottom: 2rpx dashed #e2e8f0;
}

.card-title-sm {
  font-size: 26rpx;
  font-weight: 600;
  color: #475569;
  margin-top: 24rpx;
  margin-bottom: 16rpx;
}

.card-desc {
  font-size: 26rpx;
  color: #64748b;
  margin-bottom: 20rpx;
  display: block;
}

.item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
  font-size: 26rpx;
}

.label {
  color: #64748b;
}

.val {
  font-weight: 600;
  color: #1e293b;
}

.highlight {
  color: #2563eb;
}

.btn-group {
  display: flex;
  gap: 16rpx;
  margin-top: 24rpx;
}

.btn {
  font-size: 26rpx;
  height: 80rpx;
  line-height: 80rpx;
  border-radius: 12rpx;
  border: none;
}

.btn-sm {
  flex: 1;
}

.btn-primary {
  background-color: #2563eb;
  color: #ffffff;
}

.btn-secondary {
  background-color: #0284c7;
  color: #ffffff;
}

.btn-success {
  background-color: #059669;
  color: #ffffff;
}

.btn-outline {
  background-color: #f8fafc;
  color: #475569;
  border: 2rpx solid #cbd5e1;
}

.icon-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20rpx;
  text-align: center;
}

.icon-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16rpx 0;
  background-color: #f8fafc;
  border-radius: 12rpx;
}

.icon-box .iconfont {
  font-size: 48rpx;
  color: #2563eb;
  margin-bottom: 8rpx;
}

.icon-name {
  font-size: 22rpx;
  color: #64748b;
}
</style>
