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

      <!-- 示例卡片 5：弹出框演示（底部弹出 + 居中弹窗） -->
      <view class="card">
        <view class="card-header">弹出框演示</view>
        <view class="card-body">
          点击底部 "确认提交" 按钮，从底部滑入弹出框。
          支持标题栏、关闭按钮、遮罩点击关闭，内容区可滚动。
        </view>
        <view class="item-row" style="margin-top: 16px;">
          <text class="label">全局注册组件</text>
          <text class="val">&lt;Popup /&gt;</text>
        </view>
        <view class="item-row">
          <text class="label">控制属性</text>
          <text class="val">v-model:visible</text>
        </view>
        <button class="btn-card" @click="handleShowModal">👆 点击打开居中弹窗</button>
      </view>
    </scroll-view>

    <!-- 3. 底部固定动作按钮栏（702rpx × 90rpx，两侧全圆角，渐变色） -->
    <view class="page-bottom-bar">
      <button class="btn-primary" @click="handleShowPopup">确认提交</button>
    </view>

    <!-- 4. 底部弹出框 (mode="bottom") -->
    <Popup v-model:visible="popupVisible" mode="bottom" title="底部弹出框">
      <view class="popup-demo-item" @click="handlePopupAction('选项一')">
        <text class="popup-demo-icon">📋</text>
        <text class="popup-demo-text">选项一</text>
      </view>
      <view class="popup-demo-item" @click="handlePopupAction('选项二')">
        <text class="popup-demo-icon">⚙️</text>
        <text class="popup-demo-text">选项二</text>
      </view>
      <view class="popup-demo-item" @click="handlePopupAction('选项三')">
        <text class="popup-demo-icon">📄</text>
        <text class="popup-demo-text">选项三</text>
      </view>
    </Popup>

    <!-- 5. 居中弹窗 (mode="center") -->
    <Popup v-model:visible="modalVisible" mode="center" title="居中弹窗" width="620rpx">
      <view class="modal-demo-body">
        <text class="modal-demo-icon">🎉</text>
        <text class="modal-demo-desc">这是一个居中弹窗，常用于确认提示、表单填写等场景。</text>
      </view>
      <view class="modal-demo-actions">
        <button class="modal-btn modal-btn-cancel" @click="handleModalCancel">取消</button>
        <button class="modal-btn modal-btn-confirm" @click="handleModalConfirm">确认</button>
      </view>
    </Popup>
  </view>
</template>

<script>
import { useAppStore } from '@/stores/app'

export default {
  name: 'TemplatePage',

  // 1. 响应式数据
  data() {
    return {
      formData: {},
      popupVisible: false,
      modalVisible: false
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
    handleShowPopup() {
      this.popupVisible = true
    },
    handlePopupAction(text) {
      this.popupVisible = false
      uni.showToast({ title: `选择了：${text}`, icon: 'none' })
    },
    handleShowModal() {
      this.modalVisible = true
    },
    handleModalCancel() {
      this.modalVisible = false
      uni.showToast({ title: '点击了取消', icon: 'none' })
    },
    handleModalConfirm() {
      this.modalVisible = false
      uni.showToast({ title: '点击了确认', icon: 'success' })
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
