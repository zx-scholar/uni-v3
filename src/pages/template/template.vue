<template>
  <view class="page-container">
    <!-- 1. 顶部自定义导航栏组件 -->
    <NavBar 
      title="通用标准模板" 
      background="linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)"
    />

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
    </scroll-view>

    <!-- 3. 底部固定动作按钮栏 -->
    <view class="page-bottom-bar">
      <button class="btn btn-secondary" @click="handleCancel">取消 / 返回</button>
      <button class="btn btn-primary" @click="handleSubmit">确认提交</button>
    </view>
  </view>
</template>

<script>
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
      // 路由统一返回
      router.back()
    },
    handleSubmit() {
      uni.showToast({ title: '触发提交操作', icon: 'success' })
    }
  },

  // 4. 生命周期函数
  onLoad(options) {
    console.log('通用模版页面 onLoad 接收参数:', options)
  }
}
</script>

<!-- 引入独立的 SCSS 模块样式 -->
<style lang="scss" scoped src="./template.scss"></style>
