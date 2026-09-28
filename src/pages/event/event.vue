<template>
  <view class="page-container">
    <NavBar title="赛事" color="#000" :showBack="false" />

    <scroll-view class="page-scroll-content" scroll-y>
      <view class="scroll-wrapper">
        <!-- 页面内容待补充 -->
      </view>
    </scroll-view>

    <!-- 自定义底部 TabBar -->
     <CustomTabBar />
  </view>
</template>

<script>
import NavBar from '@/components/NavBar/NavBar.vue';
import CustomTabBar from '@/components/CustomTabBar/CustomTabBar.vue';

export default {
  name: 'EventPage',
  components: { NavBar, CustomTabBar },
  data() {
    return {};
  },
};
</script>

<style lang="scss" scoped src="./event.scss"></style>
