<template>
  <view class="page-container page-has-bg">
    <!-- 顶部导航栏 -->
    <NavBar title="积分明细" color="#1c1f1e" :showBack="true" />

    <!-- 顶部卡片：切换 + 周期选择 + 积分数额 -->
    <view class="points-card">
      <!-- 顶部：年度/月度切换 + 周期选择 -->
      <view class="points-top">
        <view class="points-tabs">
          <view
            v-for="tab in viewTabs"
            :key="tab.value"
            class="points-tabs__item"
            :class="{ 'is-active': viewMode === tab.value }"
            @click="switchMode(tab.value)"
          >{{ tab.label }}</view>
        </view>
        <view class="points-period" @click="openPeriod">
          <text class="points-period__text">{{ displayPeriod }}</text>
          <text class="iconfont icon-paixuxia points-period__arrow"></text>
        </view>
      </view>

      <!-- 积分数额 -->
      <view class="points-total" :class="viewMode === 'year' ? 'is-year' : 'is-month'">
        <text class="points-total__label">{{ viewMode === 'year' ? '年度积分' : '月度积分' }}</text>
        <view class="points-total__value-row">
          <text class="points-total__value">{{ totalPoints }}</text>
          <text class="points-total__unit">分</text>
        </view>
        <view class="points-total__meta">
          <text class="points-total__desc">积分由参赛及赛事奖励累计获得</text>
          <text class="points-total__rules" @click="handleRulesClick">积分规则 ›</text>
        </view>
      </view>
    </view>

    <!-- 积分记录列表 -->
    <view class="points-list-header">积分记录</view>
    <scroll-view class="points-scroll" scroll-y>
      <view class="points-list">
        <view
          v-for="(record, i) in records"
          :key="i"
          class="points-item"
        >
          <text class="points-item__title">{{ record.title }}</text>
          <view class="points-item__bottom">
            <text class="points-item__time">{{ record.time }}</text>
            <text class="points-item__value">+{{ record.points }}分</text>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 周期选择弹层 -->
    <MonthSelect
      :visible="periodVisible"
      :mode="viewMode === 'year' ? 'year' : 'year-month'"
      :default-year="selectedYear"
      :default-month="selectedMonth"
      @update:visible="periodVisible = $event"
      @confirm="handlePeriodConfirm"
    />
  </view>
</template>

<script>
import MonthSelect from '@/components/MonthSelect/MonthSelect.vue';

export default {
  name: 'PointsDetailPage',
  components: { MonthSelect },

  data() {
    return {
      // 视图模式：'year'（年度）| 'month'（月度）
      viewMode: 'year',
      viewTabs: [
        { label: '年度', value: 'year' },
        { label: '月度', value: 'month' },
      ],
      // 当前选中周期
      selectedYear: 2026,
      selectedMonth: 3,
      periodVisible: false,
      // 总积分（示例数据）
      totalPoints: 1250,
      // 积分记录（示例数据）
      records: [
        { title: '2026年3月期卫星赛（第一名名次奖励）', time: '2026-06-18 09:02:30', points: 40 },
        { title: '报名参加2026年3月常规月度争霸赛', time: '2026-06-18 09:02:30', points: 40 },
      ],
    };
  },

  computed: {
    // 周期展示文案
    displayPeriod() {
      if (this.viewMode === 'year') {
        return `${this.selectedYear}年`;
      }
      return `${this.selectedYear}年${this.selectedMonth}月`;
    },
  },

  methods: {
    // 切换年度/月度
    switchMode(mode) {
      this.viewMode = mode;
      // TODO: 根据模式请求数据
    },
    // 打开周期选择
    openPeriod() {
      this.periodVisible = true;
    },
    // 周期确认
    handlePeriodConfirm({ year, monthNum }) {
      this.selectedYear = year;
      if (monthNum) {
        this.selectedMonth = monthNum;
      }
      // TODO: 根据周期请求数据
    },
    // 积分规则
    handleRulesClick() {
      // TODO: 跳转积分规则页
      console.log('积分规则');
    },
  },
};
</script>

<style lang="scss" scoped src="./index.scss"></style>