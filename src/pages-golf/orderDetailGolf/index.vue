<template>
  <view class="basic-template-page">
    <!-- 顶部自定义导航栏 -->
    <NavBar title="订单详情" color="#fff" :showBack="true" />

    <!-- 主体滚动区域 -->
    <scroll-view class="page-scroll" scroll-y>
      <view class="page-content">
        <!-- 顶部状态横幅 -->
        <view class="status-banner">
          <view class="status-banner__text">
            <text class="iconfont" :class="statusInfo.icon"></text>
            <view class="status-banner__title">{{ statusInfo.title }}</view>
          </view>
          <view class="status-banner__desc">{{ statusInfo.desc }}</view>
        </view>

        <!-- 卡片 1：赛事信息 -->
        <view class="detail-card">
          <view class="detail-card__title">{{ eventCard.title }}</view>
          <view class="detail-card__shop">{{ eventCard.shopName }}</view>

          <view class="detail-card__goods">
            <view class="detail-card__goods-img" :class="`detail-card__goods-img--${eventCard.goods.imgIndex}`"></view>
            <view class="detail-card__goods-info">
              <view class="detail-card__goods-top">
                <text class="detail-card__goods-title">{{ eventCard.goods.title }}</text>
                <view class="detail-card__goods-price">
                  <text class="detail-card__price">{{ eventCard.goods.price }}</text>
                  <text class="detail-card__qty">{{ eventCard.goods.qty }}</text>
                </view>
              </view>
              <text class="detail-card__goods-meta">{{ eventCard.goods.time }}</text>
            </view>
          </view>

          <view class="detail-card__actions" v-if="eventCard.showRefund">
            <view class="detail-card__btn detail-card__btn--outline" @click="handleRefund">退款</view>
          </view>

          <view class="detail-card__divider" v-if="eventCard.showRefund"></view>

          <view class="detail-card__row" v-for="(row, i) in eventCard.priceRows" :key="`price-${i}`">
            <text class="detail-card__row-label">{{ row.label }}</text>
            <text class="detail-card__row-value" :class="row.type ? `detail-card__row-value--${row.type}` : ''">{{ row.value }}</text>
          </view>
        </view>

        <!-- 卡片 2：押金明细 -->
        <view class="detail-card">
          <view class="detail-card__title">押金明细</view>
          <view class="detail-card__row" v-for="(row, i) in depositCard.rows" :key="`deposit-${i}`">
            <text class="detail-card__row-label">{{ row.label }}</text>
            <text class="detail-card__row-value" :class="row.type ? `detail-card__row-value--${row.type}` : ''">{{ row.value }}</text>
          </view>
        </view>

        <!-- 卡片 3：到店核销 -->
        <view class="detail-card detail-card--verify">
          <view class="detail-card__title">到店核销</view>
          <view class="detail-card__desc">{{ verifyCard.desc }}</view>
          <view class="qrcode-outer">
            <view class="qrcode-inner">
              <image class="qrcode-img" :src="verifyCard.qrcode" mode="aspectFit" />
            </view>
          </view>
          <view class="qrcode-tip">{{ verifyCard.tip }}</view>
        </view>

        <!-- 卡片 4：订单信息（放在最下面） -->
        <view class="detail-card">
          <view class="detail-card__title">订单信息</view>
          <view class="detail-card__row" v-for="(row, i) in orderCard.rows" :key="`order-${i}`">
            <text class="detail-card__row-label">{{ row.label }}</text>
            <text class="detail-card__row-value">{{ row.value }}</text>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 押金规则弹窗（居中，外层透明） -->
    <BasePopup
      v-model:visible="showDepositRule"
      mode="center"
      :closeable="false"
      :mask-closable="true"
      width="600px"
      radius="16px"
      bg-color="transparent"
    >
      <view class="deposit-rule">
        <!-- 绝对定位的图片 -->
        <view class="deposit-rule__image"></view>

        <!-- 白色提示盒子 -->
        <view class="deposit-rule__box">
          <text class="deposit-rule__title">押金规则</text>
          <text class="deposit-rule__desc">
            预约时间前6小时以外取消全额退押金；6小时以内取消将扣除50%押金作为违约金；
          </text>
          <view class="deposit-rule__btn" @click="showDepositRule = false">
            我知道了
          </view>
        </view>
      </view>
    </BasePopup>
  </view>
</template>

<script>
import BasePopup from '@/components/BasePopup/BasePopup.vue';

// 订单状态配置（接接口时根据后端 status 字段查表）
const STATUS_CONFIG = {
  paid: {
    title: '已支付',
    desc: '已支付参与约球押金，凭下方凭证核销码到馆打球',
    icon: 'icon-wancheng1',
  },
  wait: {
    title: '待支付',
    desc: '订单尚未完成支付，请尽快完成支付以保留名额',
    icon: 'icon-dengdai',
  },
  cancelled: {
    title: '已取消',
    desc: '预约开始前6小时内取消，已扣除50%押金手续费',
    icon: 'icon-cuowu',
  },
  completed: {
    title: '已完成',
    desc: '核销成功，已为您全额退还押金',
    icon: 'icon-wancheng1',
  },
  expired: {
    title: '已过期',
    desc: '球局已结束未支付，订单自动失效',
    icon: 'icon-yiguoqi3',
  },
};

export default {
  name: 'OrderDetailPage',

  components: { BasePopup },

  data() {
    return {
      // 当前订单状态：'paid' | 'wait' | 'cancelled' | 'completed' | 'expired'
      // 接接口时由后端返回的 status 字段决定
      status: 'paid',

      // 押金规则弹窗显隐
      showDepositRule: false,

      // 卡片 1：赛事信息
      eventCard: {
        title: '赛事信息',
        shopName: '高尔夫尊旗舰店',
        goods: {
          imgIndex: 3, // 对应 scss 里的 --1 ~ --7 商品类目图
          title: '卫星赛2026年3月（第3期）单人赛',
          price: '¥ 200.00',
          qty: 'x1',
          time: '2023.10.25 13:00-18:00',
        },
        showRefund: true, // 是否显示 "退款" 按钮及分隔线
        priceRows: [
          { label: '订单总价', value: '¥ 200.00', type: '' },
          { label: '积分抵扣', value: '-¥ 20.00', type: 'discount' },
          { label: '实付款', value: '¥180.00', type: 'paid' },
        ],
      },

      // 卡片 2：押金明细
      depositCard: {
        rows: [
          { label: '押金金额', value: '¥ 50.00', type: '' },
          { label: '取消手续费（50%）', value: '-¥ 25.00', type: 'discount' },
          { label: '实际退款（原路退回）', value: '¥25.00', type: 'paid' },
        ],
      },

      // 卡片 3：到店核销
      verifyCard: {
        desc: '到店后出示二维码，由工作人员扫码核销',
        qrcode: 'https://xports-prd.oss-cn-hangzhou.aliyuncs.com/prd/gameImage23a4e1bd5c7b4f3b8a35c2f6e3f7c4d3.png',
        tip: '到店前台扫码核销开单',
      },

      // 卡片 4：订单信息
      orderCard: {
        rows: [
          { label: '订单编号', value: '202005201314', type: '' },
          { label: '下单时间', value: '2020.05.20 13:14:00', type: '' },
          { label: '支付时间', value: '2020.05.20 13:16:00', type: '' },
          { label: '取消时间', value: '2026.08.09 15:30:26', type: '' },
          { label: '退款时间', value: '2026.08.09 15:31:18', type: '' },
        ],
      },
    };
  },

  computed: {
    // 根据当前状态取状态配置
    statusInfo() {
      return STATUS_CONFIG[this.status] || STATUS_CONFIG.paid;
    },
  },

  onLoad(options) {
    // 接接口时用 orderId 拉详情
    // this.orderId = options.orderId
    // 接口返回后赋值 this.status = res.data.status
  },

  methods: {
    // 点击 "退款" → 弹出押金规则说明
    handleRefund() {
      this.showDepositRule = true;
    },
  },
};
</script>

<style lang="scss" scoped src="./index.scss"></style>
