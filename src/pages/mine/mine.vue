<template>
  <view class="page-container">
    <NavBar title="个人中心" :showBack="false" />

    <view class="content">
      <!-- 用户基础信息卡片 -->
      <view class="user-card" :class="{ 'login-entry': !userStore.isLoggedIn }" @click="handleUserCardClick">
        <image class="avatar" :src="userAvatar" mode="aspectFill"></image>
        <view class="user-info">
          <text class="user-name">{{ userName }}</text>
          <text class="user-id">{{ userDescription }}</text>
        </view>
        <text v-if="!userStore.isLoggedIn" class="login-arrow">›</text>
      </view>

      <!-- 按功能分类展示的路由菜单组 -->
      <view v-for="(group, gIndex) in computedCategories" :key="gIndex" class="menu-group">
        <view class="group-header">
          <text class="group-title">{{ group.title }}</text>
        </view>
        <view class="menu-list">
          <view
            v-for="(item, index) in group.items"
            :key="index"
            class="menu-item"
            @click="handleMenuItemClick(item)"
          >
            <text class="menu-item__icon iconfont" :class="item.icon"></text>
            <text class="menu-item__title">{{ item.text }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 分享弹窗 -->
    <ShareDialog :visible="shareVisible" @close="shareVisible = false" />

    <!-- 自定义底部 TabBar -->
    <CustomTabBar />
  </view>
</template>

<script>
import { useAppStore } from '@/stores/app';
import { useUserStore } from '@/stores/user';
import ShareDialog from '@/components/ShareDialog/ShareDialog.vue';
import CustomTabBar from '@/components/CustomTabBar/CustomTabBar.vue';
import { routes } from '@/utils/routes';

export default {
  name: 'MinePage',
  components: { ShareDialog, CustomTabBar },
  data() {
    return {
      shareVisible: false,
      categories: [
        {
          title: '👤 个人账号与基础服务',
          items: [
            { icon: 'icon-hetong', text: '个人资料', routerPath: 'personInfo' },
            { icon: 'icon-hetong', text: '资料名片', routerPath: 'profile' },
            { icon: 'icon-sousuo', text: '浏览记录', routerPath: 'browsingHistory' },
            { icon: 'icon-hetong', text: '用户协议', routerPath: 'userAgreement', params: { type: 'user' } },
            { icon: 'icon-hetong', text: '会员协议', routerPath: 'userAgreement', params: { type: 'member' } },
            { icon: 'icon-hetong', text: '保险服务', routerPath: 'insuranceService' },
          ],
        },
        {
          title: '💳 订单与资产中心',
          items: [
            { icon: 'icon-jifen1', text: '我的积分', routerPath: 'myPoints' },
            { icon: 'icon-jifen1', text: '积分明细', routerPath: 'pointsDetail' },
            { icon: 'icon-fenxiang', text: '我的订单', routerPath: 'orderInfoGolf' },
            { icon: 'icon-hetong', text: '我的票券', routerPath: 'myTicketList' },
            { icon: 'icon-renzheng', text: '支付成功', routerPath: 'paymentSuccess' },
          ],
        },
        {
          title: '🏆 赛事与竞技服务',
          items: [
            { icon: 'icon-shijian1', text: '赛程总览', routerPath: 'eventsPlan' },
            { icon: 'icon-jiangbei1', text: '赛事项目', routerPath: 'eventProject' },
            { icon: 'icon-jiangbei1', text: '赛事活动', routerPath: 'eventList' },
            { icon: 'icon-jiangbei1', text: '赛事榜单', routerPath: 'eventRanking' },
            { icon: 'icon-gaoerfu', text: '球员主页', routerPath: 'playerHome' },
          ],
        },
        {
          title: '⚽ 场馆与社交约球',
          items: [
            { icon: 'icon-hetong', text: '场馆列表', routerPath: 'venueList' },
            { icon: 'icon-hetong', text: '次卡列表', routerPath: 'cardList' },
            { icon: 'icon-hetong', text: '课程列表', routerPath: 'courseList' },
            { icon: 'icon-shequhuodong', text: '约球广场', routerPath: 'ballBitSquareGolf' },
            { icon: 'icon-shequhuodong', text: '约球详情', routerPath: 'ballBitDetail' },
            { icon: 'icon-wujiaoxing1', text: '评价球友', routerPath: 'ballBitEvaluateGolf' },
            { icon: 'icon-shequhuodong', text: '我的约球', routerPath: 'ballBitMyList' },
          ],
        },
        {
          title: '🛠️ 开发与通用工具',
          items: [
            { icon: 'icon-hetong', text: '通用标准页', routerPath: 'template' },
            { icon: 'icon-hetong', text: '小程序模板', routerPath: 'pagesBasic' },
            { icon: 'icon-xiugai', text: 'Pinia 示例', routerPath: 'demo' },
            { icon: 'icon-jia', text: '图片上传', routerPath: 'uploadImage' },
            { icon: 'icon-fenxiang', text: '分享组件', action: 'share' },
            { icon: 'icon-cuowu2', text: '重置缓存', routerPath: null },
          ],
        },
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
    // 根据已编译的绝对路由清单动态过滤可用功能菜单
    computedCategories() {
      return this.categories
        .map((cat) => ({
          ...cat,
          items: cat.items.filter((item) => {
            if (item.action || item.routerPath === null) return true;
            return !!routes[item.routerPath];
          }),
        }))
        .filter((cat) => cat.items.length > 0);
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
        router.push(item.routerPath, item.params);
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
