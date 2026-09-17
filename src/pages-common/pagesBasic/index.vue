<template>
  <!-- ============================================================
       基础骨架：NavBar + scroll-view + 底部按钮栏
       ============================================================ -->
  <view class="page-container page-has-bg">
    <!-- 顶部导航栏 -->
    <NavBar title="小程序模板页面" color="#000" />

    <!-- 中间可滚动内容区 -->
    <scroll-view class="page-scroll-content" scroll-y>
      <view class="scroll-wrapper">
        <!-- ============================================================
             你的页面内容写在这里
             ============================================================ -->
      </view>
    </scroll-view>

    <!-- 底部固定按钮栏 -->
    <view class="page-bottom-bar">
      <button class="btn-primary" @click="handleSubmit">确认提交</button>
    </view>
  </view>
</template>

<script>
export default {
  name: 'TemplatePage',

  methods: {
    /* ---- 核心方法（根据页面需求修改） ---- */
    handleSubmit() {
      // 底部按钮提交逻辑
    },
  },

  /* ---- 生命周期（按需保留） ---- */
  onLoad(options) {
    // 接收页面参数
  },
};
</script>

<style lang="scss" scoped src="./index.scss"></style>