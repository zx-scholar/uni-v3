<script>
import initialize from '@/initialize';

export default {
  onLaunch: function () {
    console.log('App Launch - uni-app Vue3 Vite Project Started');
    initialize();
  },
  onShow: function () {
    console.log('App Show');
  },
  onHide: function () {
    console.log('App Hide');
  },
};
</script>

<style>
/* 引入 Iconfont 阿里巴巴字体图标库 */
@import '@/styles/iconfont.css';

/* 引入全局工具类（flex、间距、圆角等原子化样式） */
@import '@/styles/utility.scss';

/* 每个页面公共 CSS，原生 CSS + rpx 布局 */
page {
  background-color: #f5f6fa;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  color: #2c3e50;
  font-size: 28rpx;
  line-height: 1.5;
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
