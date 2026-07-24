<template>
  <view class="page-container">
    <!--
      =========================================================================
      【通用自定义导航栏组件使用示例】
      - title: 页面标题
      - background: 支持渐变色、纯色或背景图片
      - color: 标题与返回按钮颜色
      - fontSize: 标题字号 (如 '34rpx')
      - showBack: 默认 'auto' 自动判断页面栈 > 1 时显示返回按钮
      =========================================================================
    -->
    <NavBar
      title="自定义导航栏示范"
      background="linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)"
      color="#ffffff"
      fontSize="34rpx"
    />

    <!-- 页面内容区 -->
    <view class="content">
      <view class="tip-card">
        <text class="tip-title">💡 通用导航栏组件 NavBar 优势：</text>
        <text class="tip-text">1. 自动适配微信小程序右侧“胶囊按钮”避让区</text>
        <text class="tip-text">2. 自动根据页面栈深度判断是否展示返回按钮</text>
        <text class="tip-text">3. 支持 background="url(...)" 传入任意背景图片</text>
        <text class="tip-text">4. 支持 fontSize="34rpx" color="#fff" 自由定制</text>
      </view>

      <!-- 1. Vue3 基础语法练习区 -->
      <view class="card">
        <view class="card-header">1. Vue3 基础响应式数据 (ref & reactive)</view>
        <view class="item">
          <text class="label">计数器 (ref 定义的基本类型):</text>
          <text class="val">{{ count }}</text>
        </view>
        <view class="item">
          <text class="label">计算属性 (doubleCount):</text>
          <text class="val">{{ doubleCount }}</text>
        </view>
        <view class="item">
          <text class="label">对象数据 (reactive 定义):</text>
          <text class="val">{{ userForm.name }} ({{ userForm.age }}岁)</text>
        </view>

        <view class="btn-group">
          <button class="btn btn-sm" @click="handleIncrement">count + 1</button>
          <button class="btn btn-sm btn-outline" @click="handleUpdateUser">修改 User 对象</button>
        </view>
      </view>

      <!-- 2. Pinia 状态管理操作区 -->
      <view class="card">
        <view class="card-header">2. Pinia 状态管理读取与修改</view>

        <!-- 直接读取 appStore 上的 Getter 计算属性 -->
        <view class="item">
          <text class="label">Store 中的应用名称:</text>
          <text class="val highlight">{{ appStore.appName || '暂无数据' }}</text>
        </view>
        <view class="item">
          <text class="label">Store 中的 CenterID:</text>
          <text class="val highlight">{{ appStore.centerId || '暂无数据' }}</text>
        </view>

        <!-- 通过 storeToRefs 解构保持响应式的变量 -->
        <view class="item">
          <text class="label">解构获得的 isLoaded 状态:</text>
          <text class="val">{{ isLoaded ? '已成功加载' : '未加载' }}</text>
        </view>

        <view class="card-title-sm">修改 Pinia 的 3 种常见写法：</view>

        <button class="btn btn-primary" @click="handleActionUpdate">
          方式 ①：调用 Store Actions 方法修改 (最推荐)
        </button>

        <button class="btn btn-secondary" @click="handleDirectUpdate" style="margin-top: 16rpx;">
          方式 ②：在组件中直接给 Store 变量赋值
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

<script setup>
import { ref, reactive, computed } from 'vue'
import { useAppStore } from '@/stores/app'
import { storeToRefs } from 'pinia'
import { queryMiniAppInfo } from '@/api'

// 引入通用自定义导航栏组件
import NavBar from '@/components/NavBar/NavBar.vue'

// 响应式数据定义
const count = ref(10)
const loading = ref(false)
const userForm = reactive({ name: '小明', age: 18 })

const doubleCount = computed(() => count.value * 2)

const handleIncrement = () => count.value++
const handleUpdateUser = () => {
  userForm.age += 1
  userForm.name = userForm.name === '小明' ? '小红' : '小明'
}

// Pinia
const appStore = useAppStore()
const { isLoaded } = storeToRefs(appStore)

const handleActionUpdate = () => {
  appStore.setMiniAppInfo({
    id: 99,
    name: 'Action修改的小程序',
    centerId: 88888888,
    logo: '/static/logo.png',
    theme: 'primary-blue'
  })
  uni.showToast({ title: '通过 Actions 更新成功', icon: 'none' })
}

const handleDirectUpdate = () => {
  appStore.miniAppInfo.name = '组件直接赋值修改'
  appStore.miniAppInfo.centerId = 99999999
  uni.showToast({ title: '直接赋值修改成功', icon: 'none' })
}

const handleResetStore = () => {
  appStore.clearMiniAppInfo()
  uni.showToast({ title: 'Pinia 状态已清空', icon: 'none' })
}

const handleFetchApi = async () => {
  loading.value = true
  try {
    const res = await queryMiniAppInfo()
    if (res && res.miniApp) {
      appStore.setMiniAppInfo(res.miniApp)
      uni.showToast({ title: '接口数据已同步到 Pinia', icon: 'success' })
    }
  } catch (err) {
    appStore.setMiniAppInfo({
      id: 49,
      name: '伏见桃山演示馆',
      centerId: 10000000,
      logo: 'http://xports-test.oss-cn-hangzhou.aliyuncs.com/dev/center/10000000/images/40fd9ec75b351c5a.jpg'
    })
    uni.showToast({ title: '模拟数据已同步到 Pinia', icon: 'none' })
  } finally {
    loading.value = false
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
</style>
