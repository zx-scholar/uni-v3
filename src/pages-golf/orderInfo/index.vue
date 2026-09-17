<template>
  <view class="basic-template-page">
    <!-- 顶部自定义导航栏 -->
    <NavBar title="我的订单" color="#1c1f1e" :showBack="true" />

    <!-- 主体滚动区域 -->
    <scroll-view class="page-scroll" scroll-y>
      <view class="page-content">
        <!-- Tab 切换栏 -->
        <view class="order-tab">
          <view v-for="tab in tabs" :key="tab.key" class="order-tab__item" :class="{ 'order-tab__item--active': activeTab === tab.key }" @click="activeTab = tab.key">
            <text class="order-tab__text">{{ tab.text }}</text>
            <view v-if="activeTab === tab.key" class="order-tab__line"></view>
          </view>
        </view>

        <!-- 订单列表 -->
        <view v-if="currentList.length > 0">
          <view v-for="(order, idx) in currentList" :key="idx" class="order-card">
            <!-- 门店行 -->
            <view class="order-card__shop">
              <view class="order-card__shop-icon" :style="{ backgroundImage: `url(${order.shopIcon})` }"></view>
              <text class="order-card__shop-name">{{ order.shopName }}</text>
              <text class="order-card__status" :class="order.statusType === 'wait' ? 'order-card__status--wait' : 'order-card__status--done'">{{ order.statusText }}</text>
            </view>

            <!-- 商品行 -->
            <view class="order-card__goods">
              <view class="order-card__goods-img" :class="'order-card__goods-img--' + order.goodsType"></view>
              <view class="order-card__goods-info">
                <view>
                  <text class="order-card__goods-title">{{ order.goodsTitle }}</text>
                  <text v-if="order.goodsMeta" class="order-card__goods-meta">{{ order.goodsMeta }}</text>
                </view>
                <view class="order-card__goods-price-row">
                  <text class="order-card__price">¥ {{ order.price }}</text>
                  <text class="order-card__qty">x{{ order.qty }}</text>
                </view>
              </view>
            </view>

            <!-- 合计行 -->
            <view v-if="order.discount > 0" class="order-card__total">
              <text class="order-card__total-text">总价 ¥ {{ order.price }}，优惠 ¥ {{ order.discount }}</text>
              <text class="order-card__total-label">实付</text>
              <text class="order-card__total-amount">¥ {{ order.totalAmount }}</text>
            </view>
            <view v-else class="order-card__total">
              <text class="order-card__total-text">总价 ¥ {{ order.price }}</text>
              <text class="order-card__total-label">需付款</text>
              <text class="order-card__total-amount">¥ {{ order.totalAmount }}</text>
            </view>

            <!-- 底部操作按钮 -->
            <view class="order-card__actions">
              <view
                v-for="(btn, bIdx) in order.actions"
                :key="bIdx"
                class="order-card__btn"
                :class="btn.type === 'solid' ? 'order-card__btn--solid' : 'order-card__btn--outline'"
                @click="handleAction(btn, order)"
              >
                {{ btn.text }}
              </view>
            </view>
          </view>
        </view>

        <!-- 空状态 -->
        <view v-else class="order-empty">
          <text class="order-empty__text">暂无订单</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
// 商品图占位（现在使用 SCSS 类名控制背景图，不再使用 inline 变量）
// 门店图标（占位）
const SHOP_ICON = 'https://xports-prd.oss-cn-hangzhou.aliyuncs.com/prd/gameImage68d0413337e2457facbcbcbd620956be.png';

export default {
  name: 'OrderInfoPage',

  data() {
    return {
      // 当前选中的 tab：'all' | 'wait' | 'paid' | 'cancel'
      activeTab: 'all',

      tabs: [
        { key: 'all', text: '全部' },
        { key: 'wait', text: '待支付' },
        { key: 'paid', text: '已支付' },
        { key: 'cancel', text: '已取消' },
      ],

      // 订单列表（接接口时由后端返回）
      orderList: [
        {
          id: 'order-1',
          shopIcon: SHOP_ICON,
          shopName: '门店预约押金',
          statusText: '待支付',
          statusType: 'wait',
          goodsType: 6,
          goodsTitle: '102包厢预约押金',
          goodsMeta: '2023.10.25 13:00-18:00',
          price: '50.00',
          qty: 1,
          discount: 0,
          totalAmount: '50.00',
          actions: [
            { text: '取消订单', type: 'outline', action: 'cancel' },
            { text: '立即支付', type: 'solid', action: 'pay' },
          ],
        },
        {
          id: 'order-2',
          shopIcon: SHOP_ICON,
          shopName: '参与约球押金',
          statusText: '已付款',
          statusType: 'done',
          goodsType: 1,
          goodsTitle: '102包厢(14:00-16:00)约球',
          goodsMeta: '发起人：网球王子(差点...) \n2023.04.05-2023.10.25',
          price: '200.00',
          qty: 1,
          discount: 20.00,
          totalAmount: '180.00',
          actions: [
            { text: '出示核销码', type: 'solid', action: 'verify' },
          ],
        },
        {
          id: 'order-3',
          shopIcon: SHOP_ICON,
          shopName: '购卡',
          statusText: '已完成',
          statusType: 'done',
          goodsType: 4,
          goodsTitle: '我是卡卡的名称名称最多展示两行两行换行，超...',
          goodsMeta: '自购卡之日起一年内有效',
          price: '200.00',
          qty: 1,
          discount: 20.00,
          totalAmount: '180.00',
          actions: [],
        },
      ],
    };
  },

  computed: {
    // 根据当前 tab 过滤后的订单列表
    currentList() {
      if (this.activeTab === 'all') return this.orderList;
      return this.orderList.filter((o) => {
        if (this.activeTab === 'wait') return o.statusType === 'wait';
        if (this.activeTab === 'paid') return o.statusType === 'done' && o.actions.some((a) => a.action === 'verify');
        if (this.activeTab === 'cancel') return o.statusType === 'done' && o.actions.some((a) => a.action === 'rebook');
        return true;
      });
    },
  },

  methods: {
    // 订单操作按钮点击
    handleAction(btn, order) {
      switch (btn.action) {
        case 'pay':
          // TODO：跳转到支付页
          router.push('paymentSuccess');
          break;
        case 'cancel':
          uni.showToast({ title: '取消订单：' + btn.action, icon: 'none' });
          break;
        case 'verify':
          // 出示核销码：跳转订单详情
          router.push('orderDetail', { orderId: order.id });
          break;
        case 'rebook':
          uni.showToast({ title: '再来一单', icon: 'none' });
          break;
        default:
          console.warn('[orderInfo] 未处理的 action:', btn.action);
      }
    },
  },
};
</script>

<style lang="scss" scoped src="./index.scss"></style>
