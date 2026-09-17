<template>
  <view class="basic-template-page">
    <!-- 顶部自定义导航栏 -->
    <NavBar title="订单详情" color="#1c1f1e" :showBack="true" />

    <!-- 主体滚动区域 -->
    <scroll-view class="page-scroll" scroll-y>
      <view class="page-content">
        <!-- 卡片 1：赛事信息 -->
        <view class="detail-card">
          <view class="detail-card__title">赛事信息</view>
          <view class="detail-card__shop">高尔夫尊旗舰店</view>

          <view class="detail-card__goods">
            <view class="detail-card__goods-img detail-card__goods-img--3"></view>
            <view class="detail-card__goods-info">
              <view class="detail-card__goods-top">
                <text class="detail-card__goods-title">卫星赛2026年3月（第3期）单人赛</text>
                <view class="detail-card__goods-price">
                  <text class="detail-card__price">¥ 200.00</text>
                  <text class="detail-card__qty">x1</text>
                </view>
              </view>
              <text class="detail-card__goods-meta">2023.10.25 13:00-18:00</text>
            </view>
          </view>

          <view class="detail-card__actions">
            <view class="detail-card__btn detail-card__btn--outline" @click="handleRefund">退款</view>
          </view>

          <view class="detail-card__divider"></view>

          <view class="detail-card__row">
            <text class="detail-card__row-label">订单总价</text>
            <text class="detail-card__row-value">¥ 200.00</text>
          </view>
          <view class="detail-card__row">
            <text class="detail-card__row-label">积分抵扣</text>
            <text class="detail-card__row-value detail-card__row-value--discount">-¥ 20.00</text>
          </view>
          <view class="detail-card__row">
            <text class="detail-card__row-label">实付款</text>
            <text class="detail-card__row-value detail-card__row-value--paid">¥180.00</text>
          </view>
        </view>

        <!-- 卡片 2：订单信息 -->
        <view class="detail-card">
          <view class="detail-card__title">订单信息</view>
          <view class="detail-card__row">
            <text class="detail-card__row-label">订单编号</text>
            <text class="detail-card__row-value">202005201314</text>
          </view>
          <view class="detail-card__row">
            <text class="detail-card__row-label">下单时间</text>
            <text class="detail-card__row-value">2020.05.20 13:14:00</text>
          </view>
          <view class="detail-card__row">
            <text class="detail-card__row-label">支付时间</text>
            <text class="detail-card__row-value">2020.05.20 13:16:00</text>
          </view>
          <view class="detail-card__row">
            <text class="detail-card__row-label">取消时间</text>
            <text class="detail-card__row-value">2026.08.09 15:30:26</text>
          </view>
          <view class="detail-card__row">
            <text class="detail-card__row-label">退款时间</text>
            <text class="detail-card__row-value">2026.08.09 15:31:18</text>
          </view>
        </view>

        <!-- 卡片 3：押金明细 -->
        <view class="detail-card">
          <view class="detail-card__title">押金明细</view>
          <view class="detail-card__row">
            <text class="detail-card__row-label">押金金额</text>
            <text class="detail-card__row-value">¥ 50.00</text>
          </view>
          <view class="detail-card__row">
            <text class="detail-card__row-label">取消手续费（50%）</text>
            <text class="detail-card__row-value detail-card__row-value--discount">-¥ 25.00</text>
          </view>
          <view class="detail-card__row">
            <text class="detail-card__row-label">实际退款（原路退回）</text>
            <text class="detail-card__row-value detail-card__row-value--paid">¥25.00</text>
          </view>
        </view>

        <!-- 卡片 4：到店核销 -->
        <view class="detail-card detail-card--verify">
          <view class="detail-card__title">到店核销</view>
          <view class="detail-card__desc">到店后出示二维码，由工作人员扫码核销</view>
          <view class="qrcode-outer">
            <view class="qrcode-inner">
              <image class="qrcode-img" src="https://xports-prd.oss-cn-hangzhou.aliyuncs.com/prd/gameImage23a4e1bd5c7b4f3b8a35c2f6e3f7c4d3.png" mode="aspectFit" />
            </view>
          </view>
          <view class="qrcode-tip">到店前台扫码核销开单</view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  name: 'OrderDetailPage',

  onLoad(options) {
    // 接接口时用 orderId 拉详情
    // this.orderId = options.orderId
  },

  methods: {
    // 点击 "退款"
    handleRefund() {
      uni.showToast({ title: '退款功能待接入', icon: 'none' });
    },
  },
};
</script>

<style lang="scss" scoped src="./index.scss"></style>
