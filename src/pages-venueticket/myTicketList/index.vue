<template>
  <view class="basic-template-page">
    <!-- 顶部自定义导航栏 -->
    <NavBar title="我的票券" color="#1c1f1e" :showBack="true" />

    <!-- 主体滚动区域 -->
    <scroll-view class="page-scroll" scroll-y>
      <view class="page-content">
        <!-- 票券卡片列表 -->
        <view
          v-for="(item, idx) in ticketList"
          :key="idx"
          class="ticket-card"
          :class="{ 'ticket-card--green': item.theme === 'green' }"
          @click="handleCardClick(item)"
        >
          <!-- 头部：分类标识 + 右侧操作图标 -->
          <view class="ticket-card__header">
            <view class="ticket-card__category">
              <view class="ticket-card__badge" :class="`ticket-card__badge--${item.type}`">
                <text class="iconfont" :class="item.categoryIcon"></text>
              </view>
              <text class="ticket-card__category-text">{{ item.category }}</text>
            </view>
            <text class="iconfont icon-erweima11 ticket-card__action" @click.stop="handleViewTicket(item)"></text>
          </view>

          <!-- 标题（含可选标签） -->
          <view class="ticket-card__title-row">
            <text class="ticket-card__title">{{ item.title }}</text>
            <text v-if="item.tag" class="ticket-card__tag">{{ item.tag }}</text>
          </view>

          <!-- 时间 -->
          <view class="ticket-card__row">
            <text class="iconfont icon-shijian1 ticket-card__icon"></text>
            <text class="ticket-card__desc">{{ item.time }}</text>
          </view>

          <!-- 地点 -->
          <view class="ticket-card__row">
            <text class="iconfont icon-weizhi3 ticket-card__icon"></text>
            <text class="ticket-card__desc">{{ item.location }}</text>
          </view>

          <!-- 约球类型：成团人数 -->
          <view class="ticket-card__row" v-if="item.peopleText">
            <text class="iconfont icon-renshu1 ticket-card__icon"></text>
            <text class="ticket-card__desc">{{ item.peopleText }}</text>
          </view>
        </view>

        <!-- 空状态 -->
        <view v-if="ticketList.length === 0" class="ticket-empty">
          <text class="ticket-empty__text">暂无票券</text>
        </view>
      </view>
    </scroll-view>

    <!-- 核销码弹窗 -->
    <BasePopup
      v-model:visible="showQr"
      mode="center"
      :closeable="false"
      :mask-closable="true"
      width="610px"
      radius="16px"
      bg-color="transparent"
      max-height="90vh"
    >
      <view class="qr-popup">
        <!-- 白色内容盒子 -->
        <view class="qr-popup__box">
          <text class="qr-popup__title">{{ currentTicket.title }}</text>
          <text class="qr-popup__desc">{{ currentTicket.time }}</text>
          <text class="qr-popup__desc">{{ currentTicket.location }}</text>

          <!-- 二维码占位盒子（400*400，后续替换为真实二维码） -->
          <view class="qr-popup__code"></view>
        </view>

        <!-- 关闭按钮（在白色盒子外面） -->
        <view class="qr-popup__close" @click="showQr = false">
          <text class="iconfont icon-cuowu2"></text>
        </view>
      </view>
    </BasePopup>
  </view>
</template>

<script>
import BasePopup from '@/components/BasePopup/BasePopup.vue';

export default {
  name: 'MyTicketListPage',
  components: { BasePopup },

  data() {
    return {
      // 核销码弹窗显隐
      showQr: false,
      // 当前点击的票券
      currentTicket: {},
      // 票券列表：type 为 'ball'（约球）| 'event'（赛事）| 'venue'（场地预约）
      // theme: 'green' 表示绿色背景卡片（场地预约）
      ticketList: [
        {
          type: 'ball',
          theme: '',
          category: '18洞约球',
          categoryIcon: 'icon-renshu1',
          title: '周六约球 · 102包厢',
          tag: '',
          time: '08/31 周六 14:00—16:00',
          location: 'GOLFZON PARK 南京旗舰店',
          peopleText: '成团中 2/4人',
        },
        {
          type: 'event',
          theme: '',
          category: '赛事',
          categoryIcon: 'icon-jiangbei1',
          title: '2026 GOLFZON 南京8月月赛',
          tag: '',
          time: '2026/08/30—09/01',
          location: 'GOLFZON PARK 南京旗舰店',
          peopleText: '',
        },
        {
          type: 'venue',
          theme: 'green',
          category: '场地预约',
          categoryIcon: 'icon-gaoerfu',
          title: '102包厢',
          tag: '今日入馆',
          time: '08/08 周六 14:00—16:00',
          location: 'GOLFZON PARK 南京旗舰店',
          peopleText: '',
        },
      ],
    };
  },

  onLoad(options) {
    // 接接口时拉取票券列表
    // this.fetchTicketList()
  },

  methods: {
    // 点击卡片 → 进入票券详情页
    handleCardClick(item) {
      router.push('myTicketDetail');
    },
    // 点击右侧图标 → 弹出核销码
    handleViewTicket(item) {
      this.currentTicket = item;
      this.showQr = true;
    },
  },
};
</script>

<style lang="scss" scoped src="./index.scss"></style>