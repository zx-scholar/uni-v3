<template>
  <view class="basic-template-page">
    <!-- 顶部自定义导航栏 -->
    <NavBar title="我的积分" color="#1c1f1e" :showBack="true" />

    <!-- 主体滚动区域 -->
    <scroll-view class="page-scroll" scroll-y>
      <view class="page-content">
        <!-- 顶部积分可抵金额卡片 -->
        <view class="points-hero">
          <view class="points-hero__top">
            <view class="points-hero__top-text">
              <view class="points-hero__label">积分可抵金额</view>
              <view class="points-hero__amount">
                <text class="points-hero__amount-num">10</text>
                <text class="points-hero__amount-unit">元</text>
              </view>
            </view>
          </view>
          <view class="points-hero__sub">
            <view class="points-hero__sub-cell">
              <text class="points-hero__sub-text">我的积分</text>
              <text class="points-hero__sub-num">1000</text>
            </view>
            <view class="points-hero__sub-divider"></view>
            <view class="points-hero__sub-cell points-hero__sub-cell--right">
              <text class="points-hero__sub-text">已帮我节省</text>
              <text class="points-hero__sub-num">0</text>
              <text class="points-hero__sub-unit">元</text>
            </view>
          </view>
        </view>

        <!-- 顶部 Tab + 筛选 -->
        <view class="points-header">
          <view class="points-tab">
            <view
              v-for="tab in tabs"
              :key="tab.key"
              class="points-tab__item"
              :class="{ 'points-tab__item--active': activeTab === tab.key }"
              @click="activeTab = tab.key"
            >
              <text class="points-tab__text">{{ tab.text }}</text>
              <view v-if="activeTab === tab.key" class="points-tab__line"></view>
            </view>
          </view>
          <view class="points-filter" @click="handleFilter">
            <text class="iconfont icon-shaixuan1 points-filter__icon"></text>
            <text class="points-filter__text">筛选</text>
          </view>
        </view>

        <!-- 流水列表（按月份分组） -->
        <view v-if="filteredGroups.length > 0" class="points-list">
          <view v-for="(group, gIdx) in filteredGroups" :key="gIdx" class="points-group">
            <view class="points-group__month">{{ group.month }}</view>
            <view class="points-group__items">
              <view
                v-for="(item, iIdx) in group.items"
                :key="iIdx"
                class="points-item"
              >
                <view class="points-item__left">
                  <text class="points-item__title">{{ item.title }}</text>
                  <text class="points-item__date">{{ item.date }}</text>
                </view>
                <text
                  class="points-item__score"
                  :class="item.score >= 0 ? 'points-item__score--income' : 'points-item__score--expense'"
                >{{ item.score >= 0 ? '+' : '' }}{{ item.score }}</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 空状态 -->
        <view v-else class="points-empty">
          <text class="points-empty__text">暂无积分记录</text>
        </view>
      </view>
    </scroll-view>

    <!-- 月份筛选弹窗 -->
    <MonthSelect
      :visible="filterVisible"
      :default-year="selectedYear"
      :default-month="selectedMonth"
      @update:visible="filterVisible = $event"
      @confirm="handleFilterConfirm"
    />
  </view>
</template>

<script>
export default {
  name: 'MyPointsPage',

  data() {
    return {
      // 当前选中的 tab：'all' | 'income' | 'expense'
      activeTab: 'all',

      tabs: [
        { key: 'all', text: '全部' },
        { key: 'income', text: '获取' },
        { key: 'expense', text: '支出' },
      ],

      // 月份筛选弹窗是否显示
      filterVisible: false,
      // 上次选中的年月（用于初始化滚轮位置）
      selectedYear: 0,
      selectedMonth: 0,

      // 流水数据（按月份分组；接接口时由后端返回）
      groups: [
        {
          month: '2020年06月',
          items: [
            { title: '场地预定', date: '2020-06-18 09:02:30', score: 40 },
            { title: '录入健康承诺书', date: '2020-06-18 09:02:30', score: 40 },
            { title: '兑换_20元优惠券', date: '2020-06-18 09:02:30', score: -500 },
          ],
        },
        {
          month: '2020年05月',
          items: [
            { title: '积分过期', date: '2020-06-18 09:02:30', score: -40 },
            { title: '实名认证', date: '2020-06-18 09:02:30', score: 40 },
            { title: '场地预定', date: '2020-06-18 09:02:30', score: 40 },
          ],
        },
      ],
    };
  },

  computed: {
    // 根据当前 tab + 月份过滤后的月份分组
    filteredGroups() {
      let result = this.groups;

      // 月份过滤
      if (this.selectedYear && this.selectedMonth) {
        const targetMonth = `${this.selectedYear}-${String(this.selectedMonth).padStart(2, '0')}`;
        result = result.filter((g) => g.month.replace('年', '-').replace('月', '') === targetMonth);
      }

      // tab 过滤（全部/获取/支出）
      if (this.activeTab !== 'all') {
        const type = this.activeTab; // 'income' | 'expense'
        result = result
          .map((g) => ({
            month: g.month,
            items: g.items.filter((it) =>
              type === 'income' ? it.score > 0 : it.score < 0
            ),
          }))
          .filter((g) => g.items.length > 0);
      }

      return result;
    },
  },

  methods: {
    // 点击筛选按钮，打开弹窗
    handleFilter() {
      this.filterVisible = true;
    },

    // 弹窗选中月份后回传
    handleFilterConfirm({ year, month, monthNum }) {
      this.selectedYear = year;
      this.selectedMonth = monthNum;
      // TODO：接接口时这里带年月参数请求数据
    },
  },
};
</script>

<style lang="scss" scoped src="./index.scss"></style>
