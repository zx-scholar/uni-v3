<template>
  <!-- ============================================================
       核心骨架（所有页面通用，保留）
       - NavBar：顶部导航栏
       - scroll-view + scroll-wrapper：中间可滚动内容区
       - page-bottom-bar + btn-primary：底部固定按钮
       ============================================================ -->
  <view class="page-container page-has-bg">
    <!-- NavBar：支持背景色/渐变/透明，见组件文档 -->
    <NavBar title="页面标题" color="#000" />

    <scroll-view class="page-scroll-content" scroll-y>
      <view class="scroll-wrapper">
        <!-- ============================================================
             你的页面内容写在这里，下方为演示区块，用时可删
             ============================================================ -->

        <!-- 演示：基础卡片（最常用）-->
        <view class="card">
          <view class="card-header fs-xxl fw-bold color-primary pb-8 mb-16">卡片标题</view>
          <view class="card-body fs-base color-text-sub lh-1-6">
            卡片正文内容，支持多行文本。
            <br />
            tabbar 图标可参照 $img-tabbar-icon-* 变量命名。
          </view>
        </view>

        <!-- 演示：表单行列表 -->
        <view class="card">
          <view class="card-header fs-xxl fw-bold color-primary pb-8 mb-16">列表布局</view>
          <view class="item-row flex-between py-8">
            <text class="fs-base color-text-sub">标签</text>
            <text class="fs-base fw-600 color-text-primary">值</text>
          </view>
          <view class="item-row flex-between py-8">
            <text class="fs-base color-text-sub">标签</text>
            <text class="fs-base fw-600 color-text-primary">值</text>
          </view>
        </view>

        <!-- 演示：带有操作按钮的卡片 -->
        <view class="card">
          <view class="card-header fs-xxl fw-bold color-primary pb-8 mb-32">操作卡片</view>
          <view class="card-body fs-base color-text-sub lh-1-6">页面内的触发按钮，非底部。</view>
          <button class="btn-card" @click="handleCardAction">点击操作</button>
        </view>

        <!-- 演示：底部弹出框 -->
        <view class="card">
          <view class="card-header fs-xxl fw-bold color-primary pb-8 mb-16">弹出框</view>
          <view class="card-body fs-base color-text-sub lh-1-6">底部的 "确认提交" 按钮会弹出底部弹出框。</view>
        </view>

        <!-- 演示：居中弹窗 -->
        <view class="card">
          <view class="card-header fs-xxl fw-bold color-primary pb-8 mb-16">居中弹窗</view>
          <button class="btn-card" @click="modalVisible = true">打开居中弹窗</button>
        </view>

        <!-- 演示：空状态 -->
        <view class="card">
          <view class="card-header fs-xxl fw-bold color-primary pb-8 mb-16">空状态</view>
          <view class="card-body fs-base color-text-sub lh-1-6 mb-20">无数据时展示，支持自定义文案和操作按钮。</view>
          <Empty />
          <Empty text="暂无赛事数据" show-action action-text="去预约" @action="handleEmptyAction" />
        </view>

        <!-- 演示：敬请期待弹窗 -->
        <view class="card">
          <view class="card-header fs-xxl fw-bold color-primary pb-8 mb-16">敬请期待弹窗</view>
          <view class="card-body fs-base color-text-sub lh-1-6 mb-20">功能开发中提示，visible 控制显隐。</view>
          <button class="btn-card" @click="comingSoonVisible = true">打开敬请期待弹窗</button>
        </view>
      </view>
    </scroll-view>

    <!-- 底部固定按钮栏 -->
    <view class="page-bottom-bar">
      <button class="btn-primary" @click="handleSubmit">确认提交</button>
    </view>

    <!-- ============================================================
         弹出框组件（可选，用不到可删除）
         ============================================================ -->

    <!-- 底部弹出框 BasePopup -->
    <BasePopup :visible="popupVisible" mode="bottom" title="操作列表" @update:visible="popupVisible = $event">
      <view class="popup-item flex items-center" @click="handlePopupSelect('选项一')">
        <text class="popup-item-icon mr-20">📋</text>
        <text class="popup-item-text">选项一</text>
      </view>
      <view class="popup-item flex items-center" @click="handlePopupSelect('选项二')">
        <text class="popup-item-icon mr-20">⚙️</text>
        <text class="popup-item-text">选项二</text>
      </view>
      <view class="popup-item flex items-center" @click="handlePopupSelect('选项三')">
        <text class="popup-item-icon mr-20">📄</text>
        <text class="popup-item-text">选项三</text>
      </view>
    </BasePopup>

    <!-- 居中弹窗 BasePopup -->
    <BasePopup :visible="modalVisible" mode="center" title="提示" width="620px" closeable @update:visible="modalVisible = $event">
      <view class="modal-body flex-column items-center py-20">
        <text class="modal-icon mb-20">🎉</text>
        <text class="modal-desc text-center lh-1-6">确认执行此操作？</text>
      </view>
      <view class="modal-actions flex gap-20 pt-24">
        <button class="modal-btn flex-1 text-center border-none bg-hover color-text-sub" @click="modalVisible = false">取消</button>
        <button class="modal-btn flex-1 text-center border-none bg-gradient-btn color-text-white" @click="modalVisible = false">确认</button>
      </view>
    </BasePopup>

    <!-- 敬请期待弹窗 -->
    <ComingSoon :visible="comingSoonVisible" @update:visible="comingSoonVisible = $event" />
  </view>
</template>

<script>
import Empty from '@/components/Empty/Empty.vue';
import ComingSoon from '@/components/ComingSoon/ComingSoon.vue';

export default {
  name: 'TemplatePage',

  components: { Empty, ComingSoon },

  data() {
    return {
      popupVisible: false,
      modalVisible: false,
      comingSoonVisible: false,
    };
  },

  methods: {
    /* ---- 核心方法（根据页面需求修改） ---- */
    handleSubmit() {
      // 底部按钮提交逻辑
    },

    /* ---- 演示方法（用不到可删） ---- */
    handleCardAction() {
      uni.showToast({ title: '点击了卡片操作', icon: 'none' });
    },

    handleEmptyAction() {
      uni.showToast({ title: '点击了空状态按钮', icon: 'none' });
    },

    handlePopupSelect(text) {
      this.popupVisible = false;
      uni.showToast({ title: `选择了：${text}`, icon: 'none' });
    },
  },

  /* ---- 生命周期（按需保留） ---- */
  onLoad(options) {
    console.log('页面 onLoad 接收参数:');
  },
  onShow() {
    // 页面每次显示时触发
  },
};
</script>

<style lang="scss" scoped src="./template.scss"></style>
