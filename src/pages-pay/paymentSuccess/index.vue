<template>
  <view class="basic-template-page">
    <!-- 顶部自定义导航栏 -->
    <NavBar title="支付成功" color="#1c1f1e" :showBack="true" />

    <!-- 主体滚动区域 -->
    <scroll-view class="page-scroll" scroll-y>
      <view class="page-content">
        <view class="success">
          <view class="success__icon"></view>
          <view class="success__title">恭喜！支付成功！</view>

          <view class="success__actions">
            <view class="success__btn success__btn--primary" @click="handleViewOrder">查看订单详情</view>
            <view class="success__btn success__btn--outline" @click="handleBackHome">返回首页</view>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 底部广告区域 -->
    <view class="ads">
      <view class="ads__banner"></view>
      <InsuranceBanner />
    </view>
  </view>
</template>

<script>
// 页面级局部组件：底部保险广告条
import InsuranceBanner from './InsuranceBanner.vue';

export default {
  name: 'PaymentSuccessPage',

  components: { InsuranceBanner },

  methods: {
    // 点击 "查看订单详情"
    handleViewOrder() {
      uni.showToast({ title: '订单详情待接入', icon: 'none' });
      // TODO：router.push('orderDetail', { orderId: this.orderId })
    },

    // 点击 "返回首页" —— 清空页面栈回到首页
    handleBackHome() {
      router.reLaunch('home');
    },
  },
};
</script>

<style lang="scss" scoped src="./index.scss"></style>