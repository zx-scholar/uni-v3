<template>
  <view class="page-container page-has-bg">
    <!-- 顶部导航栏 -->
    <NavBar title="球员主页" color="#1c1f1e" :showBack="true" />

    <!-- 学员信息卡片 -->
    <view class="student-card" @click="handleStudentCardClick">
      <view class="student-card__avatar"></view>
      <view class="student-card__info">
        <text class="student-card__name">{{ studentName }}</text>
        <text class="student-card__desc">学员</text>
      </view>
      <text class="iconfont icon-you student-card__arrow"></text>
    </view>

    <!-- 内容滚动区 -->
    <scroll-view class="player-scroll" scroll-y>
      <view class="player-content">
        <!-- 积分汇总卡片（含年度/月度切换 + 周期选择） -->
        <view class="summary-card">
          <!-- 顶部：年度/月度切换 + 周期选择 -->
          <view class="summary-card__top">
            <view class="player-tabs">
              <view
                v-for="tab in viewTabs"
                :key="tab.value"
                class="player-tabs__item"
                :class="{ 'is-active': viewMode === tab.value }"
                @click="switchMode(tab.value)"
              >{{ tab.label }}</view>
            </view>
            <view class="player-period" @click="openPeriod">
              <text class="player-period__text">{{ displayPeriod }}</text>
              <text class="iconfont icon-paixuxia player-period__arrow"></text>
            </view>
          </view>

          <view class="summary-card__header">
            <text class="summary-card__label">{{ viewMode === 'year' ? '年度积分' : '月度积分' }}</text>
          </view>
          <view class="summary-card__points-row">
            <text class="summary-card__points">{{ summary.points }}<text class="summary-card__points-unit">分</text></text>
            <view class="summary-card__detail" @click="handlePointsDetail">
              <text>明细</text>
              <text class="iconfont icon-you summary-card__detail-arrow"></text>
            </view>
          </view>
          <view class="summary-card__metrics">
            <view
              v-for="(m, i) in summary.metrics"
              :key="i"
              class="summary-card__metric"
            >
              <view class="summary-card__metric-value">
                <view class="summary-card__metric-value-prefix">{{ m.prefix }}</view>
                <view class="summary-card__metric-value-num">{{ m.value }}</view>
                <view class="summary-card__metric-value-suffix">{{ m.suffix }}</view>
              </view>
              <text class="summary-card__metric-label">{{ m.label }}</text>
            </view>
          </view>
        </view>

        <!-- 赛事计分卡 -->
        <view class="scorecard-section">
          <view class="scorecard-section__header">
            <view class="scorecard-section__bar"></view>
            <text class="scorecard-section__title">赛事计分卡</text>
          </view>

          <view
            v-for="(card, i) in scorecards"
            :key="i"
            class="scorecard-item"
          >
            <text class="scorecard-item__title">{{ card.title }}</text>
            <view class="scorecard-item__body">
              <view class="scorecard-item__main">
                <text class="scorecard-item__info">球场: {{ card.course }} · 标准杆{{ card.par }}</text>
                <text class="scorecard-item__info">完赛时间: {{ card.time }}</text>
              </view>
              <view class="scorecard-item__score">
                <text class="scorecard-item__strokes">{{ card.strokes }}杆</text>
                <text class="scorecard-item__diff">({{ card.diff > 0 ? '+' : '' }}{{ card.diff }})</text>
              </view>
            </view>
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
  name: 'PlayerHomePage',
  components: { MonthSelect },

  data() {
    return {
      // 视图模式：'year'（年度）| 'month'（月度）
      viewMode: 'month',
      viewTabs: [
        { label: '年度', value: 'year' },
        { label: '月度', value: 'month' },
      ],
      // 学员信息（示例数据）
      studentName: '张三',
      // 当前选中周期
      selectedYear: 2026,
      selectedMonth: 3,
      periodVisible: false,
      // 积分汇总（示例数据）
      summary: {
        points: '1250',
        metrics: [
          { value: '1', prefix: '第', suffix: '名', label: '周期排名' },
          { value: '67', prefix: '', suffix: '杆', label: '最佳总杆数' },
          { value: '-5', prefix: '', suffix: '', label: '标准杆差' },
        ],
      },
      // 计分卡列表（示例数据）
      scorecards: [
        { title: '2026年3月卫星赛（第一轮决赛）', course: 'St Andrews Links', par: 72, time: '2026.03.21 16:30', strokes: 67, diff: -5 },
        { title: '日常练习球·卫星赛预选', course: 'St Andrews Links', par: 72, time: '2026.03.21 16:30', strokes: 70, diff: -2 },
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
    // 学员卡片点击
    handleStudentCardClick() {
      // TODO: 跳转学员资料 / 编辑
      console.log('点击学员卡片');
    },
    // 跳转积分明细
    handlePointsDetail() {
      router.push('pointsDetail');
    },
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
  },
};
</script>

<style lang="scss" scoped src="./index.scss"></style>
