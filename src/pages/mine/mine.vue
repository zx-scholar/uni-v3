<template>
  <view class="page-container">
    <NavBar title="个人中心" :showBack="false" />

    <view class="content">
      <view class="user-card" :class="{ 'login-entry': !userStore.isLoggedIn }" @click="handleUserCardClick">
        <image class="avatar" :src="userAvatar" mode="aspectFill"></image>
        <view class="user-info">
          <text class="user-name">{{ userName }}</text>
          <text class="user-id">{{ userDescription }}</text>
        </view>
        <text v-if="!userStore.isLoggedIn" class="login-arrow">›</text>
      </view>
      <view class="menu-list">
        <view class="menu-item" v-for="(item, index) in menuList" :key="index" @click="handleMenuItemClick(item)">
          <view class="menu-left">
            <text v-if="item.icon" class="iconfont" :class="item.icon"></text>
            <text class="menu-title">{{ item.text }}</text>
          </view>
          <text class="iconfont icon-you arrow"></text>
        </view>
      </view>
    </view>

    <!-- 分享弹窗 -->
    <ShareDialog :visible="shareVisible" @close="shareVisible = false" />
  </view>
</template>

<script>
import { useAppStore } from '@/stores/app';
import { useUserStore } from '@/stores/user';
import ShareDialog from '@/components/ShareDialog/ShareDialog.vue';

export default {
  name: 'MinePage',
  components: { ShareDialog },
  data() {
    return {
      shareVisible: false,
      menuList: [
        { icon: 'icon-hetong', text: '通用标准页面模板 (顶栏+滚动+底栏)', routerPath: 'template' },
        { icon: 'icon-xiugai', text: 'Vue3 + Pinia 教程示例页', routerPath: 'demo' },
        { icon: 'icon-hetong', text: '个人资料(personInfo)', routerPath: 'personInfo' },
        { icon: 'icon-hetong', text: '个人资料(profile)', routerPath: 'profile' },
        { icon: 'icon-sousuo', text: '浏览记录', routerPath: 'browsingHistory' },
        { icon: 'icon-shijian1', text: '赛程总览', routerPath: 'eventsPlan' },
        { icon: 'icon-jia', text: '图片上传', routerPath: 'uploadImage' },
        { icon: 'icon-fenxiang', text: '分享', action: 'share' },
        { icon: 'icon-cuowu2', text: '清空 Pinia 状态与缓存', routerPath: null },
      ],
    };
  },
  computed: {
    appStore() {
      return useAppStore();
    },
    userStore() {
      return useUserStore();
    },
    userAvatar() {
      return this.userStore.isLoggedIn ? this.userStore.userInfo.avatarUrl || '/static/logo.png' : '/static/logo.png';
    },
    userName() {
      return this.userStore.isLoggedIn ? this.userStore.userInfo.name || '微信用户' : '点击登录';
    },
    userDescription() {
      return this.userStore.isLoggedIn ? `手机号：${this.userStore.mobileNum || '未绑定'}` : '登录后查看个人信息';
    },
  },
  methods: {
    handleUserCardClick() {
      if (!this.userStore.isLoggedIn) {
        router.push('login');
      } else {
        console.log('已经登录');
      }
    },
    handleMenuItemClick(item) {
      if (item.action === 'share') {
        this.shareVisible = true;
        return;
      }
      if (item.routerPath) {
        router.push(item.routerPath);
      } else {
        this.handleClear();
      }
    },
    handleClear() {
      this.appStore.clearMiniAppInfo();
      uni.showToast({ title: '缓存已重置', icon: 'none' });
    },
  },
  onShareAppMessage() {
    return {
      title: '个人中心',
      path: '/pages/mine/mine',
    };
  },
};
</script>

<!-- 导入独立的 mine.scss 样式文件 -->
<style lang="scss" scoped src="./mine.scss"></style>
