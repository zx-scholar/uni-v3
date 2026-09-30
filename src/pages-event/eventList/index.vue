<template>
  <view class="page-container page-has-bg">
    <!-- 顶部导航栏 -->
    <NavBar title="赛事活动" color="#1c1f1e" :showBack="true" />

    <!-- 筛选区（固定在滚动区上方） -->
    <view class="event-filter-area">
      <!-- 顶部：门店选择 + 赛事榜单入口 -->
      <view class="event-top-bar">
        <view class="event-top-bar__store" @click="handleStoreSelect">
          <text class="event-top-bar__store-name">{{ currentStore }}</text>
          <text class="iconfont icon-paixuxia event-top-bar__arrow"></text>
        </view>
        <view class="event-top-bar__rank" @click="handleRankClick">
          <text class="iconfont icon-saishihuodong event-top-bar__rank-icon"></text>
          <text class="event-top-bar__rank-text">2026赛事榜单</text>
          <text class="iconfont icon-you1 event-top-bar__rank-arrow"></text>
        </view>
      </view>

      <!-- 搜索区 -->
      <view class="event-search-wrap">
        <SearchBar v-model="keyword" placeholder="搜索赛事" @confirm="handleSearch" />
      </view>

      <!-- 分类标签 -->
      <view class="event-tabs">
        <view
          v-for="tab in categoryTabs"
          :key="tab.value"
          class="event-tabs__item"
          :class="{ 'is-active': activeCategory === tab.value }"
          @click="handleCategoryChange(tab.value)"
        >{{ tab.label }}</view>
      </view>

      <!-- 筛选行 -->
      <view class="event-filter">
        <view class="event-filter__item" @click="toggleFilterPanel">
          <text>{{ activeStatusText }}</text>
          <text class="iconfont icon-paixuxia event-filter__arrow"></text>
        </view>
        <view class="event-filter__item" @click="openDate">
          <text>{{ filterValue.date || '比赛时间' }}</text>
          <text class="iconfont icon-paixuxia event-filter__arrow"></text>
        </view>

        <!-- 筛选展开面板（状态列表） -->
        <view v-if="filterExpanded" class="event-filter__expanded">
          <view
            v-for="opt in filterGroups[0].options"
            :key="opt.value"
            class="event-filter__option"
            :class="{ 'is-active': filterValue.status === opt.value }"
            @click="selectStatus(opt.value)"
          >{{ opt.text }}</view>
        </view>
      </view>
    </view>

    <!-- 日期选择弹层 -->
    <BasePopup :visible="dateVisible" :max-height="'80vh'" @update:visible="dateVisible = $event">
      <Calendar
        v-model="filterValue.date"
        @select="handleDateSelect"
        @close="dateVisible = false"
      />
    </BasePopup>

    <!-- 赛事卡片列表（可滚动） -->
    <scroll-view class="page-scroll-content" scroll-y>
      <view class="scroll-wrapper">
        <view class="event-list">
          <view
            v-for="item in eventList"
            :key="item.id"
            class="event-card"
            @click="handleCardClick(item)"
          >
            <!-- 赛事横幅图 -->
            <view
              class="event-card__banner"
              :style="{ backgroundImage: `url(${item.banner})` }"
            >
              <view class="event-card__badge" :class="`event-card__badge--${item.status}`">
                <text class="event-card__badge-dot"></text>
                <text class="event-card__badge-text">{{ statusMap[item.status] }}</text>
              </view>
            </view>

            <!-- 赛事信息 -->
            <view class="event-card__body">
              <text class="event-card__title">{{ item.title }}</text>
              <view class="event-card__meta">
                <text class="event-card__meta-text">{{ item.dateRange }}｜{{ item.location }}</text>
              </view>
              <view class="event-card__footer">
                <view class="event-card__tag">{{ item.tag }}</view>
                <text class="event-card__count">{{ item.signUpCount }}人已报</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import SearchBar from '@/components/SearchBar/SearchBar.vue';
import Calendar from '@/components/Calendar/Calendar.vue';
import BasePopup from '@/components/BasePopup/BasePopup.vue';

export default {
  name: 'EventListPage',
  components: { SearchBar, Calendar, BasePopup },

  data() {
    return {
      keyword: '',
      currentStore: '南京旗舰店',
      activeCategory: 'all',
      activeStatus: 'all',
      filterExpanded: false,
      dateVisible: false,
      filterValue: {
        status: '',
        date: '',
      },
      filterGroups: [
        {
          key: 'status',
          title: '全部状态',
          options: [
            { text: '全部', value: '' },
            { text: '报名中', value: 'signing' },
            { text: '进行中', value: 'ongoing' },
            { text: '待开始', value: 'upcoming' },
            { text: '已结束', value: 'ended' },
          ],
        },
      ],
      categoryTabs: [
        { label: '全部', value: 'all' },
        { label: '卫星赛', value: 'satellite' },
        { label: '月赛', value: 'monthly' },
        { label: '年终总决赛', value: 'final' },
      ],
      statusOptions: [
        { label: '全部状态', value: 'all' },
        { label: '报名中', value: 'signing' },
        { label: '进行中', value: 'ongoing' },
        { label: '待开始', value: 'upcoming' },
        { label: '已结束', value: 'ended' },
      ],
      // 状态文字映射
      statusMap: {
        signing: '报名中',
        ongoing: '进行中',
        upcoming: '待开始',
        ended: '已结束',
      },
      //$img-page-bg-2: '#{$img-base}/gameImage3ac72c2d13e34667ab60230e3ae6cc27.png';
      eventList: [
        {
          id: 1,
          banner: 'https://xports-prd.oss-cn-hangzhou.aliyuncs.com/prd/gameImage3ac72c2d13e34667ab60230e3ae6cc27.png',
          title: '日常练习球·卫星赛（3月期）',
          dateRange: '2026.06.23–2026.07.04',
          location: '南京旗舰店',
          tag: '月赛',
          status: 'signing',
          signUpCount: '59,062',
        },
        {
          id: 2,
          banner: 'https://xports-prd.oss-cn-hangzhou.aliyuncs.com/prd/gameImage3ac72c2d13e34667ab60230e3ae6cc27.png',
          title: '2026年度高尔夫月赛（6月场）',
          dateRange: '2026.06.15–2026.06.30',
          location: '南京旗舰店',
          tag: '月赛',
          status: 'ongoing',
          signUpCount: '12,340',
        },
        {
          id: 3,
          banner: 'https://xports-prd.oss-cn-hangzhou.aliyuncs.com/prd/gameImage3ac72c2d13e34667ab60230e3ae6cc27.png',
          title: '2026年终总决赛资格赛',
          dateRange: '2026.10.01–2026.10.15',
          location: '南京旗舰店',
          tag: '年终总决赛',
          status: 'upcoming',
          signUpCount: '8,520',
        },
        {
          id: 4,
          banner: 'https://xports-prd.oss-cn-hangzhou.aliyuncs.com/prd/gameImage3ac72c2d13e34667ab60230e3ae6cc27.png',
          title: '2026年5月卫星赛',
          dateRange: '2026.05.01–2026.05.10',
          location: '南京旗舰店',
          tag: '卫星赛',
          status: 'ended',
          signUpCount: '45,210',
        },
      ],
    };
  },

  computed: {
    activeStatusText() {
      const opt = this.filterGroups[0].options.find((o) => o.value === this.filterValue.status);
      return opt ? opt.text : '全部状态';
    },
  },

  methods: {
    // 门店选择
    handleStoreSelect() {
      // TODO: 打开门店选择弹层
      console.log('选择门店');
    },
    // 赛事榜单
    handleRankClick() {
      router.push('eventRanking');
    },
    // 搜索
    handleSearch() {
      console.log('搜索赛事:', this.keyword);
    },
    // 分类切换
    handleCategoryChange(value) {
      this.activeCategory = value;
    },
    // 切换筛选面板
    toggleFilterPanel() {
      this.filterExpanded = !this.filterExpanded;
    },
    // 选择状态
    selectStatus(value) {
      this.filterValue.status = value;
      this.filterExpanded = false;
      // TODO: 根据筛选条件请求列表数据
    },
    // 打开日期选择
    openDate() {
      this.dateVisible = true;
    },
    // 选中日期
    handleDateSelect() {
      this.dateVisible = false;
      // TODO: 根据 filterValue.date 请求列表数据
    },
    // 点击赛事卡片
    handleCardClick(item) {
      // TODO: 跳转赛事详情
      console.log('点击赛事:', item.id);
    },
  },
};
</script>

<style lang="scss" scoped src="./index.scss"></style>
