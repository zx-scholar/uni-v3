<template>
  <view class="page-container page-has-bg">
    <!-- 1. 顶部自定义导航栏组件（背景透明，文字深色，与页面背景图自然融合）
         如需渐变/纯色背景+白色文字，传入 background 和 color：
         <NavBar title="标题" background="#42b883" color="#ffffff" />
    -->
    <NavBar title="通用标准模板" color="#ffffff" />

    <!-- 2. 中间主体可滚动内容区 -->
    <scroll-view class="page-scroll-content" scroll-y>
      <!-- 示例卡片 1 -->
      <view class="card">
        <view class="card-header">模版结构说明</view>
        <view class="card-body">
          此页面为开发新页面的标准通用模版，包含：
          1. 顶部自定义导航栏 (支持背景图/渐变色)
          2. 中间自适应弹性滚动区 (scroll-view)
          3. 底部固定按钮栏 (带 iPhone 安全区避让)
        </view>
      </view>

      <!-- 示例卡片 2 -->
      <view class="card">
        <view class="card-header">全局 SCSS 变量使用示例</view>
        <view class="item-row">
          <text class="label">品牌主色 ($primary-color):</text>
          <text class="val" style="color: #42b883;">#42b883</text>
        </view>
        <view class="item-row">
          <text class="label">卡片圆角 ($radius-card):</text>
          <text class="val">16px (自动转 16rpx)</text>
        </view>
        <view class="item-row">
          <text class="label">通用间距 ($padding-md):</text>
          <text class="val">15px (自动转 30rpx)</text>
        </view>
      </view>

      <view class="card">
        <view class="card-header">全局 SCSS 变量使用示例</view>
        <view class="item-row">
          <text class="label">品牌主色 ($primary-color):</text>
          <text class="val" style="color: #42b883;">#42b883</text>
        </view>
        <view class="item-row">
          <text class="label">卡片圆角 ($radius-card):</text>
          <text class="val">16px (自动转 16rpx)</text>
        </view>
        <view class="item-row">
          <text class="label">通用间距 ($padding-md):</text>
          <text class="val">15px (自动转 30rpx)</text>
        </view>
      </view>

      <!-- 示例卡片 3：Pinia Store 使用演示 -->
      <view class="card">
        <view class="card-header">Pinia Store 数据示例</view>
        <view class="item-row">
          <text class="label">当前应用名称 (appStore.appName):</text>
          <text class="val">{{ appStore.appName || '--' }}</text>
        </view>
        <view class="item-row">
          <text class="label">CenterID (appStore.centerId):</text>
          <text class="val">{{ appStore.centerId || '--' }}</text>
        </view>
      </view>

      <!-- 示例卡片 4：卡片背景图演示 (启用 page-has-bg / card-has-bg) -->
      <view class="card card-has-bg">
        <view class="card-header">卡片背景图演示</view>
        <view class="item-row">
          <text class="label">样式类</text>
          <text class="val">.card-has-bg</text>
        </view>
        <view class="item-row">
          <text class="label">背景图</text>
          <text class="val">contain / center top</text>
        </view>
        <view class="card-body" style="margin-top: 10px;">
          页面背景由 .page-has-bg 提供，图片居中顶部 contain 显示，底部留白处自动使用 $bg-page 填充。
        </view>
      </view>
    </scroll-view>

    <!-- 3. 底部固定动作按钮栏（702rpx × 90rpx，两侧全圆角，渐变色） -->
    <view class="page-bottom-bar">
      <button class="btn-primary" @click="handleSubmit">确认提交</button>
    </view>
  </view>
</template>

<script>
import { useAppStore } from '@/stores/app'

export default {
  name: 'TemplatePage',

  // 1. 响应式数据
  data() {
    return {
      formData: {}
    }
  },

  // 2. 计算属性
  computed: {
    // 自动挂载 Pinia Store
    appStore() {
      return useAppStore()
    }
  },

  // 3. 业务方法集
  methods: {
    handleCancel() {
      // router 已在 main.js 中挂载为全局变量，无需 import
      router.back()
    },
    handleSubmit() {
      uni.showToast({ title: '触发提交操作', icon: 'success' })
    }
  },

  // 4. 生命周期函数
  onLoad(options) {
    console.log('页面 onLoad 接收参数:', options)
  },
  onShow() {
    // [可选] 页面每次显示时触发（如从其他页面返回时刷新数据）
    console.log('页面 onShow')
  }
}
</script>

<!-- 引入独立的 SCSS 模块样式 -->
<style lang="scss" scoped src="./template.scss"></style>
