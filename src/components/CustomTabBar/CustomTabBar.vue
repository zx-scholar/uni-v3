<template>
  <view class="custom-tabbar" :class="{ 'custom-tabbar--hidden': !visible }">
    <view
      v-for="(item, index) in tabList"
      :key="item.key || item.pagePath"
      class="custom-tabbar__item"
      :class="{ 'is-active': currentIndex === index }"
      @tap="handleTap(item, index)"
    >
      <!-- 顶部小绿条，仅选中态显示 -->
      <view class="custom-tabbar__indicator"></view>

      <!-- 图标区：根据配置渲染 image / iconfont / 文本 三种模式 -->
      <view class="custom-tabbar__icon">
        <!-- 模式 1：image（支持选中态切换） -->
        <image
          v-if="item.image || item.imageActive"
          class="custom-tabbar__image"
          :src="currentIndex === index ? (item.imageActive || item.image) : item.image"
          mode="aspectFit"
        />
        <!-- 模式 2：iconfont（class 切换实现选中态） -->
        <text
          v-else-if="item.iconfont"
          class="iconfont custom-tabbar__iconfont"
          :class="currentIndex === index && item.iconfontActive ? item.iconfontActive : item.iconfont"
        ></text>
      </view>

      <text class="custom-tabbar__label">{{ item.text }}</text>
    </view>
  </view>
</template>

<script>
// 默认配置：复用项目 iconfont（iconfont.css 已在 App.vue 全局引入）
// 图标对应关系：
//   首页 未选/选中：icon-shouye6 / icon-shouye-zhihui
//   赛事 未选：icon-saishihuodong（暂无选中变体，仅通过颜色变绿区分）
//   我的 未选/选中：icon-geren  / icon-gerenzhongxin-zhihui
const DEFAULT_LIST = [
  {
    key: 'home',
    pagePath: 'pages/index/index',
    text: '首页',
    iconfont: 'icon-shouye6',
    iconfontActive: 'icon-shouye-zhihui',
  },
  {
    key: 'event',
    pagePath: 'pages/event/event',
    text: '赛事',
    iconfont: 'icon-saishihuodong',
  },
  {
    key: 'mine',
    pagePath: 'pages/mine/mine',
    text: '我的',
    iconfont: 'icon-geren',
    iconfontActive: 'icon-gerenzhongxin-zhihui',
  },
];

export default {
  name: 'CustomTabBar',
  props: {
    // tab 列表，调用方传入；不传则用默认两 tab
    // 每项字段：key, pagePath, text, iconfont?, iconfontActive?, image?, imageActive?
    list: {
      type: Array,
      default: () => DEFAULT_LIST,
    },
    // 是否显示（用于在路由切换时显隐）
    visible: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      currentIndex: 0,
    };
  },
  computed: {
    tabList() {
      return this.list && this.list.length ? this.list : DEFAULT_LIST;
    },
  },
  mounted() {
    this.syncCurrentIndex();
  },
  methods: {
    // 通过 getCurrentPages() 取当前页路径，在 list 中匹配
    syncCurrentIndex() {
      const pages = getCurrentPages();
      if (!pages || pages.length === 0) return;
      const currentRoute = pages[pages.length - 1].route;
      const idx = this.tabList.findIndex((t) => t.pagePath === currentRoute);
      if (idx >= 0) this.currentIndex = idx;
    },
    handleTap(item, index) {
      if (index === this.currentIndex) return;
      uni.switchTab({ url: '/' + item.pagePath });
    },
  },
};
</script>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

.custom-tabbar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  display: flex;
  background-color: $color-bg-card;
  // 顶部柔阴影，替代硬边框
  box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.04);
  // iPhone 安全区
  padding-bottom: env(safe-area-inset-bottom, 0px);
  transition: transform 0.3s ease;

  &--hidden {
    transform: translateY(100%);
  }

  &__item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 14px 0 10px;
    color: $color-text-sub;
    transition: color 0.2s ease;

    // 按下轻微缩放反馈
    &:active {
      transform: scale(0.94);
    }

    &.is-active {
      color: $color-primary;
    }
  }

  // 顶部小绿条：绝对定位，常态宽 0，选中态展开
  &__indicator {
    position: absolute;
    top: 0;
    width: 36px;
    height: 4px;
    border-radius: 0 0 2px 2px;
    background-color: $color-primary;
    transform: scaleX(0);
    transform-origin: center;
    transition: transform 0.25s ease;
  }

  &__item.is-active &__indicator {
    transform: scaleX(1);
  }

  &__icon {
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 4px;
  }

  // image 模式：尺寸约束，避免撑高
  &__image {
    width: 40px;
    height: 40px;
  }

  // iconfont 模式：尺寸 + 颜色由父级 .is-active 控制
  &__iconfont {
    font-size: 40px;
    line-height: 1;
  }

  &__label {
    font-size: 22px;
    font-weight: 500;
    line-height: 1;
  }
}
</style>