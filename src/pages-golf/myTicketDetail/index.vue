<template>
  <view class="basic-template-page">
    <!-- 顶部自定义导航栏 -->
    <NavBar title="票券详情" color="#ffffff" :showBack="true" />

    <!-- 主体滚动区域 -->
    <scroll-view class="page-scroll" scroll-y>
      <view class="page-content">
        <!-- 票券详情卡片 -->
        <view class="ticket-detail-card">
          <!-- 标题 -->
          <view class="ticket-detail-card__title">{{ ticketInfo.title }}</view>

          <!-- 时间 -->
          <view class="ticket-detail-card__row">
            <text class="iconfont icon-shijian1 ticket-detail-card__icon"></text>
            <text class="ticket-detail-card__desc">{{ ticketInfo.time }}</text>
          </view>

          <!-- 地点 -->
          <view class="ticket-detail-card__row">
            <text class="iconfont icon-weizhi3 ticket-detail-card__icon"></text>
            <text class="ticket-detail-card__desc">{{ ticketInfo.location }}</text>
          </view>

          <!-- 分隔线 -->
          <view class="ticket-detail-card__divider"></view>

          <!-- 二维码占位盒子（320*320，后续替换为真实二维码） -->
          <view class="ticket-detail-card__code"></view>

          <!-- 提示文字 -->
          <view class="ticket-detail-card__tip">请向前台出示此二维码完成核销</view>

          <!-- 查看订单详情 -->
          <view class="ticket-detail-card__link" @click="handleViewOrder">查看订单详情</view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  name: 'MyTicketDetailPage',

  data() {
    return {
      // 票券详情（接接口时由 orderId 拉取）
      ticketInfo: {
        title: '周六约球 · 102包厢',
        time: '08/31 周六 14:00—16:00',
        location: 'GOLFZON PARK 南京旗舰店',
      },
    };
  },

  onLoad(options) {
    // 接接口时用 orderId 拉详情
    // this.orderId = options.orderId
  },

  methods: {
    // 查看订单详情
    handleViewOrder() {
      router.push('orderDetail');
    },
  },
};
</script>

<style lang="scss" scoped src="./index.scss"></style>
