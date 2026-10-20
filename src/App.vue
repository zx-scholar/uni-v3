<script>
import initialize from '@/utils/initialize';

export default {
  onLaunch: function () {
    console.log('App Launch - uni-app Vue3 Vite Project Started');
    initialize();
    // 使用自定义 TabBar 后，兜底隐藏原生 TabBar（避免双层显示）
    // #ifdef MP-WEIXIN
    // #endif
    uni.hideTabBar({ animation: false });
  },
  onShow: function () {
    console.log('App Show');
    // #ifdef MP-WEIXIN
    uni.hideTabBar({ animation: false });
    // #endif
  },
  onHide: function () {
    console.log('App Hide');
  },
};
</script>

<style>
/* Iconfont 为纯 CSS，保持原生引入（postcss 直接内联） */
@import '@/styles/iconfont.css';
</style>

<style lang="scss">
/* 全局工具类与页面骨架必须走 Sass 编译（@forward / 变量才会展开） */
@use '@/styles/utility.scss';
@use '@/styles/layout.scss';
@use '@/styles/variables.scss' as *;

/* 默认页面背景图：必须直接写在 App.vue 顶层规则——
   uni-app 会把 @use 模块内的绝对 URL 错误拼接为相对路径（styles/https://...） */
.page-container.page-has-bg {
  background-image: url($img-page-bg);
}

/* 微信小程序 button 自带 ::after 边框，全局去除（项目按钮均为自定义样式） */
button::after {
  border: none;
}

/* 每个页面公共样式，原生 CSS + rpx 布局 */
page {
  background-color: #f5f6fa;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  color: #2c3e50;
  font-size: 28px;
  line-height: 1;
  box-sizing: border-box;
}

view,
text,
image,
input,
button,
scroll-view {
  box-sizing: border-box;
}
</style>
