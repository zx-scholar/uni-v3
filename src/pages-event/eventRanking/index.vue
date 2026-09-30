<template>
  <view class="page-container page-has-bg">
    <!-- 顶部导航栏 -->
    <NavBar title="赛事榜单" color="#1c1f1e" :showBack="true" />

    <!-- 顶部分类标签（可横向滚动） -->
    <scroll-view class="ranking-tabs" scroll-x :show-scrollbar="false">
      <view
        v-for="tab in categoryTabs"
        :key="tab.value"
        class="ranking-tabs__item"
        :class="{ 'is-active': activeCategory === tab.value }"
        @click="handleCategoryChange(tab.value)"
      >{{ tab.label }}</view>
    </scroll-view>

    <!-- 年度选择 -->
    <view class="ranking-year" @click="openPeriod">
      <text class="ranking-year__text">{{ displayPeriod }}</text>
      <text class="iconfont icon-paixuxia ranking-year__arrow"></text>
    </view>

    <!-- 榜单表格 -->
    <scroll-view class="ranking-scroll" scroll-y>
      <view class="ranking-table">
        <!-- ============ 默认榜单（综合积分/卫星赛/月赛/年终总决赛） ============ -->
        <template v-if="!isSpecialTab">
          <!-- 表头 -->
          <view class="ranking-table__header">
            <text class="ranking-table__col ranking-table__col--rank">名次</text>
            <text class="ranking-table__col ranking-table__col--player">选手</text>
            <text class="ranking-table__col ranking-table__col--strokes">总杆数</text>
            <text class="ranking-table__col ranking-table__col--score">成绩</text>
            <text class="ranking-table__col ranking-table__col--points">赛事积分</text>
          </view>

          <!-- 表体 -->
          <view
            v-for="item in rankingList"
            :key="item.rank"
            class="ranking-table__row"
            :class="item.rank <= 3 ? 'ranking-table__row--' + item.rank : ''"
            @click="handlePlayerClick(item)"
          >
            <view class="ranking-table__col ranking-table__col--rank">
              <view
                v-if="item.rank <= 3"
                class="ranking-table__rank-badge"
                :class="'ranking-table__rank-badge--' + item.rank"
              ></view>
              <text v-else>{{ item.rank }}</text>
            </view>
            <text class="ranking-table__col ranking-table__col--player">{{ item.player }}</text>
            <text class="ranking-table__col ranking-table__col--strokes">{{ item.strokes }}</text>
            <text class="ranking-table__col ranking-table__col--score">{{ item.score }}</text>
            <view class="ranking-table__col ranking-table__col--points">
              <text class="ranking-table__points-value">{{ item.points }}分</text>
              <view v-if="item.passTag" class="ranking-table__pass-tag">{{ item.passTag }}</view>
            </view>
          </view>
        </template>

        <!-- ============ 特殊榜单（神射手/勤奋奖） ============ -->
        <template v-else>
          <!-- 表头 -->
          <view class="ranking-table__header special">
            <text
              v-for="col in specialColumns"
              :key="col.key"
              class="ranking-table__col"
              :class="'ranking-table__col--' + col.key"
            >{{ col.label }}</text>
          </view>

          <!-- 表体 -->
          <view
            v-for="item in rankingList"
            :key="item.rank"
            class="ranking-table__row"
            :class="item.rank <= 3 ? 'ranking-table__row--' + item.rank : ''"
            @click="handlePlayerClick(item)"
          >
            <view class="ranking-table__col ranking-table__col--rank">
              <view
                v-if="item.rank <= 3"
                class="ranking-table__rank-badge"
                :class="'ranking-table__rank-badge--' + item.rank"
              ></view>
              <text v-else>{{ item.rank }}</text>
            </view>
            <text class="ranking-table__col ranking-table__col--player">{{ item.player }}</text>
            <text
              v-for="col in specialDataColumns"
              :key="col.key"
              class="ranking-table__col"
              :class="['ranking-table__col--' + col.key, { 'is-highlight': col.highlight }]"
            >{{ item[col.key] }}{{ col.unit }}</text>
          </view>
        </template>
      </view>
    </scroll-view>

    <!-- 周期选择弹层 -->
    <MonthSelect
      :visible="periodVisible"
      :mode="periodMode"
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
  name: 'EventRankingPage',
  components: { MonthSelect },

  data() {
    return {
      activeCategory: 'all',
      categoryTabs: [
        { label: '综合积分', value: 'all' },
        { label: '卫星赛', value: 'satellite' },
        { label: '月赛', value: 'monthly' },
        { label: '年终总决赛', value: 'final' },
        { label: '勤奋奖', value: 'diligence' },
        { label: '神射手', value: 'sharpshooter' },
      ],
      selectedYear: 2025,
      selectedMonth: 9,
      periodVisible: false,
      // 榜单数据（示例）
      rankingList: [
        { rank: 1, player: '张伟', strokes: 68, score: '-4', points: '+250', passTag: '直通月赛', bestStrokes: 68, participation: 12 },
        { rank: 2, player: '王芳', strokes: 68, score: '-2', points: '+250', passTag: '直通月赛', bestStrokes: 68, participation: 12 },
        { rank: 3, player: '刘洋', strokes: 68, score: '+1', points: '+200', passTag: '', bestStrokes: 68, participation: 12 },
        { rank: 4, player: '李娜', strokes: 68, score: '+1', points: '+140', passTag: '', bestStrokes: 68, participation: 12 },
        { rank: 5, player: '赵磊', strokes: 68, score: '+1', points: '+110', passTag: '', bestStrokes: 68, participation: 12 },
        { rank: 6, player: '杨帆', strokes: 68, score: '+3', points: '+90', passTag: '', bestStrokes: 68, participation: 12 },
      ],
    };
  },

  computed: {
    // 是否特殊榜单（神射手/勤奋奖）
    isSpecialTab() {
      return this.activeCategory === 'sharpshooter' || this.activeCategory === 'diligence';
    },
    // 特殊榜单的列配置
    specialColumns() {
      const base = [
        { key: 'rank', label: '名次' },
        { key: 'player', label: '选手' },
      ];
      if (this.activeCategory === 'sharpshooter') {
        return [
          ...base,
          { key: 'bestStrokes', label: '18H最佳杆数', unit: '杆', highlight: true },
          { key: 'participation', label: '总参赛次数', unit: '次', highlight: false },
        ];
      }
      // 勤奋奖
      return [
        ...base,
        { key: 'participation', label: '总参赛次数', unit: '次', highlight: true },
        { key: 'bestStrokes', label: '18H最低杆数', unit: '杆', highlight: false },
      ];
    },
    // 特殊榜单的数据列（去掉名次、选手）
    specialDataColumns() {
      return this.specialColumns.filter((col) => col.key !== 'rank' && col.key !== 'player');
    },
    // 周期选择模式：综合积分只选年份，其余选年月
    periodMode() {
      return this.activeCategory === 'all' ? 'year' : 'year-month';
    },
    // 周期展示文案
    displayPeriod() {
      if (this.activeCategory === 'all') {
        return `${this.selectedYear}年`;
      }
      return `${this.selectedYear}年${this.selectedMonth}月`;
    },
  },

  methods: {
    handleCategoryChange(value) {
      this.activeCategory = value;
      // TODO: 根据分类请求榜单数据
    },
    openPeriod() {
      this.periodVisible = true;
    },
    handlePeriodConfirm({ year, monthNum }) {
      this.selectedYear = year;
      // 年月模式才更新月份（综合积分仅选年份，monthNum 为 null）
      if (monthNum) {
        this.selectedMonth = monthNum;
      }
      // TODO: 根据周期请求榜单数据
    },
    handlePlayerClick(item) {
      // TODO: 跳转选手主页
      console.log('点击选手:', item.player);
    },
  },
};
</script>

<style lang="scss" scoped src="./index.scss"></style>
