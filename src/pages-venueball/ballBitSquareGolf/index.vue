<template>
  <view class="basic-template-page">
    <!-- 顶部自定义导航栏（NavBar 为全局组件，无需 import） -->
    <NavBar title=" " color="#000" :showBack='true' />

    <!-- 主体滚动区域 -->
    <scroll-view class="page-scroll" scroll-y>
      <view class="page-content">
        <view class="entry-card-wrap">
          <view
            v-for="item in entryCardList"
            :key="item.id"
            class="entry-card"
            :class="['entry-card--' + item.theme]"
            @click="handleEntryCardClick(item)"
          >
            <view class="entry-card__text">
              <text class="entry-card__title">{{ item.title }}</text>
              <text class="entry-card__desc">{{ item.desc }}</text>
            </view>
          </view>
        </view>

        <!-- 搜索区 -->
        <view class="search-wrap">
          <SearchBar v-model="keyword" placeholder="搜索球友/球局/门店" @confirm="handleSearch" />
        </view>

        <!-- 筛选头部（日期选项 + 筛选按钮） -->
        <view class="filter-bar">
          <view
            class="filter-bar__date"
            :class="{ 'is-selected': !!filterValue.date }"
            @click="openDate"
          >
            <text>{{ filterValue.date ? formatDisplayDate(filterValue.date) : '日期' }}</text>
            <text class="iconfont icon-paixuxia filter-bar__date-icon"></text>
          </view>
          <view class="filter-bar__date-options">
            <view
              v-for="opt in dateOptions"
              :key="opt.value"
              class="filter-bar__date-option"
              :class="{ 'is-selected': filterValue.date === opt.dateStr }"
              @click="selectDate(opt.value)"
            >{{ opt.text }}</view>
          </view>
          <view class="filter-bar__filter" @click="toggleFilter">
            <text>筛选</text>
            <text class="iconfont icon-shaixuan1 filter-bar__filter-icon"></text>
          </view>

          <!-- 筛选下拉展开区（绝对定位贴 filter-bar 下方，不占文档流） -->
          <view v-if="filterExpanded" class="filter-expanded">
            <FilterPanel v-model="filterValue" @confirm="handleFilterConfirm" />
          </view>
        </view>

        <!-- 活动卡片 -->
        <view class="activity-card-wrap">
          <ActivityCard
            :avatar="sampleCard.avatar"
            :name="sampleCard.name"
            :rating="sampleCard.rating"
            :deposit="sampleCard.deposit"
            :main-title="sampleCard.mainTitle"
            :sub-title="sampleCard.subTitle"
            :tags="sampleCard.tags"
            :date-time="sampleCard.dateTime"
            :location="sampleCard.location"
            :participants="sampleCard.participants"
            :joined-count="sampleCard.joinedCount"
            :total-count="sampleCard.totalCount"
            @join="handleJoinActivity"
          />
        </view>
      </view>
    </scroll-view>

    <!-- 日期选择弹层 -->
    <BasePopup :visible="dateVisible" :max-height="'80vh'" @update:visible="dateVisible = $event">
      <Calendar
        v-model="filterValue.date"
        @select="handleDateSelect"
        @close="dateVisible = false"
      />
    </BasePopup>

    <!-- 先预约场地提示弹层 -->
    <ReservePrompt
      :visible="reservePromptVisible"
      @confirm="handleReserveConfirm"
      @cancel="reservePromptVisible = false"
      @update:visible="reservePromptVisible = $event"
    />

    <!-- 选择已预订场地弹层 -->
    <SelectCourt
      :visible="selectCourtVisible"
      v-model="filterValue.courtId"
      :list="courtList"
      @rebook="handleRebook"
      @confirm="handleCourtConfirm"
      @update:visible="selectCourtVisible = $event"
    />

    <!-- 发起约球弹层（确定选场后进入） -->
    <CreateGame
      :visible="createGameVisible"
      v-model="createGameValue"
      @back="handleCreateGameBack"
      @close="createGameVisible = false"
      @submit="handleCreateGameSubmit"
      @update:visible="createGameVisible = $event"
    />
  </view>
</template>

<script>
import SearchBar from '@/components/SearchBar/SearchBar.vue';
import ActivityCard from '@/components/ActivityCard/ActivityCard.vue';
import FilterPanel from '@/components/FilterPanel/FilterPanel.vue';
import Calendar from '@/components/Calendar/Calendar.vue';
import ReservePrompt from '@/components/ReservePrompt/ReservePrompt.vue';
import SelectCourt from '@/components/SelectCourt/SelectCourt.vue';
import CreateGame from '@/components/CreateGame/CreateGame.vue';

// 业务接口
import { queryUserTicketsWithFriend } from './api';

export default {
  name: 'BasicTemplatePage',
  components: { SearchBar, ActivityCard, FilterPanel, Calendar, ReservePrompt, SelectCourt, CreateGame },

  data() {
    return {
      keyword: '', // 搜索关键词
      list: [], // 示例：列表数据
      entryCardList: [
        {
          id: 'my',
          theme: 'my',
          title: '我的约球',
          desc: '管理参与的球局',
        },
        {
          id: 'go',
          theme: 'go',
          title: '发起约球',
          desc: '邀请球友一起挥杆',
        },
      ],
      // 活动卡片示例数据（后续接接口时换成接口返回数据）
      sampleCard: {
        avatar: '/static/logo.png',
        name: '网球王子',
        rating: 4.9,
        deposit: 80,
        mainTitle: '周六约球',
        subTitle: '102包厢',
        tags: [
          { text: '差点18以内', colorType: 'green' },
          { text: '室内禁烟', colorType: 'green' },
          { text: '女士优先', colorType: 'pink' },
        ],
        dateTime: '08/08 周六 14:00–16:00',
        location: 'GOLFZON PARK 南京旗舰店',
        participants: [
          '/static/logo.png',
          '/static/logo.png',
          '/static/logo.png',
          '/static/logo.png',
        ],
        joinedCount: 3,
        totalCount: 4,
      },
      // 筛选面板状态
      filterValue: {
        date: '',
        handicap: '',
        gender: '',
        smoking: '',
        courtId: '',
      },
      // 筛选下拉展开状态
      filterExpanded: false,
      // 日期弹层显隐
      dateVisible: false,
      // 先预约场地提示弹层显隐
      reservePromptVisible: false,
      // 选择已预订场地弹层显隐
      selectCourtVisible: false,
      // 发起约球弹层显隐
      createGameVisible: false,
      // 发起约球表单草稿（不与筛选共享）
      createGameValue: {
        handicap: '',
        gender: '',
        smoking: '',
      },
      // 已预订场地示例列表（后续接接口）
      courtList: [
        {
          id: 'c1',
          title: '102包厢（14:00–16:00）',
          dateTime: '08/08 周六 14:00–16:00',
          location: 'GOLFZON PARK 南京旗舰店',
        },
        {
          id: 'c2',
          title: '102包厢（14:00–16:00）',
          dateTime: '08/08 周六 14:00–16:00',
          location: 'GOLFZON PARK 南京旗舰店',
        },
      ],
    };
  },

  computed: {
    // 始终反映“今天/明天”的实时日期字符串
    dateOptions() {
      return this.buildDateOptions();
    },
  },

  onLoad() {
    this.fetchList();
  },

  methods: {
    // 拉取数据示例
    async fetchList() {
      try {
        const res = await queryUserTicketsWithFriend({});
        this.list = (res && res.tradeTickets) || [];
        // 后端主动给出的业务提示（如"只支持羽毛球场地"）
        if (res && res.prompt) {
          uni.showToast({ title: res.prompt, icon: 'none' });
        }
      } catch (err) {
        console.error('获取数据失败:', err);
      }
    },

    // 示例：跳转到其它页面（需引入 import router from '@/router'）
    // goDetail(item) {
    //   router.go({
    //     key: 'xxxPageKey',
    //     params: { id: item.id },
    //   });
    // },

    // 搜索确认（点击键盘搜索按钮触发）
    handleSearch() {
      // TODO: 在这里调用搜索接口
      console.log('搜索关键词:', this.keyword);
    },

    // 加入球局
    handleJoinActivity() {
      // TODO: 判断用户是否已预约场地，未预约则提示弹层
      this.reservePromptVisible = true;
    },

    // 入口卡片点击
    handleEntryCardClick(item) {
      if (item.id === 'go') {
        // 发起约球：弹出预约场地提示 selectCourtVisible
        // this.reservePromptVisible = true;
        this.selectCourtVisible = true;
      } else if (item.id === 'my') {
        // 我的约球：后续跳转我的约球页面
        // TODO: 跳转到我的约球页
        console.log('点击了我的约球');
      }
    },

    // 跳转到预约场地页面
    handleReserveConfirm() {
      this.reservePromptVisible = false;
      // TODO: 跳转到预约场地页面
      console.log('跳转到预约场地');
    },

    // 选择场地后确认：关闭选场弹层，打开发起约球弹层
    handleCourtConfirm(courtId) {
      console.log('选中场地:', courtId);
      this.selectCourtVisible = false;
      this.createGameVisible = true;
    },

    // 发起约球弹层返回：回到选场弹层
    handleCreateGameBack() {
      this.createGameVisible = false;
      this.selectCourtVisible = true;
    },

    // 发起约球提交
    handleCreateGameSubmit(value) {
      console.log('发起约球:', value);
      this.createGameVisible = false;
      // TODO: 接入发起约球接口
    },

    // 重新预约
    handleRebook() {
      console.log('重新预约');
      // TODO: 跳转到预约场地页
    },

    // 筛选确认（点确定后收起展开区）
    handleFilterConfirm(value) {
      console.log('筛选条件:', value);
      // TODO: 根据筛选条件请求列表数据
      this.filterExpanded = false;
    },

    // 切换筛选下拉展开
    toggleFilter() {
      this.filterExpanded = !this.filterExpanded;
    },

    // 选中日期子项（今天/明天），将特殊值转为具体日期字符串
    selectDate(value) {
      let dateStr = '';
      const today = new Date();
      if (value === 'today') {
        dateStr = this.formatDate(today.getFullYear(), today.getMonth() + 1, today.getDate());
      } else if (value === 'tomorrow') {
        const t = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
        dateStr = this.formatDate(t.getFullYear(), t.getMonth() + 1, t.getDate());
      }
      this.filterValue = { ...this.filterValue, date: dateStr };
    },

    // 拼接 YYYY-MM-DD
    formatDate(y, m, d) {
      return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    },

    // 把 YYYY-MM-DD 转为 MM.DD 格式，用于页面上紧凑展示
    formatDisplayDate(dateStr) {
      if (!dateStr) return '';
      const [, m, d] = dateStr.split('-');
      return `${m}.${d}`;
    },

    // 构建"今天/明天"选项列表（dateStr 实时计算）
    buildDateOptions() {
      const today = new Date();
      const todayStr = this.formatDate(today.getFullYear(), today.getMonth() + 1, today.getDate());
      const t = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
      const tomorrowStr = this.formatDate(t.getFullYear(), t.getMonth() + 1, t.getDate());
      return [
        { text: '今天', value: 'today', dateStr: todayStr },
        { text: '明天', value: 'tomorrow', dateStr: tomorrowStr },
      ];
    },

    // 打开日期选择弹层
    openDate() {
      this.dateVisible = true;
    },

    // 选中日期后关闭弹层
    handleDateSelect() {
      this.dateVisible = false;
    },
  },
};
</script>

<style lang="scss" scoped src="./index.scss"></style>
