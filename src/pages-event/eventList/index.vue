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
    <scroll-view
      class="page-scroll-content"
      scroll-y
      :lower-threshold="120"
      @scrolltolower="handleLoadMore"
    >
      <view class="scroll-wrapper">
        <view class="event-list">
          <view
            v-for="(item, index) in eventList"
            :key="item.id || index"
            class="event-card"
            @click="handleCardClick(item)"
          >
            <!-- 赛事横幅图 -->
            <view
              class="event-card__banner"
              :style="{ backgroundImage: `url(${item.banner})` }"
            >
              <view
                class="event-card__badge"
                :class="{
                  'event-card__badge--signing': item.status === 'signing',
                  'event-card__badge--ongoing': item.status === 'ongoing',
                  'event-card__badge--upcoming': item.status === 'upcoming',
                  'event-card__badge--ended': item.status === 'ended',
                }"
              >
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

        <!-- 列表状态：加载中 / 无数据 / 加载到底（字段映射完成前先保留，便于确认接口连通） -->
        <view v-if="loading" class="event-list-state">加载中...</view>
        <view v-else-if="!eventList.length" class="event-list-state">暂无赛事</view>
        <view v-else-if="isFinished" class="event-list-state">没有更多了</view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import SearchBar from '@/components/SearchBar/SearchBar.vue';
import Calendar from '@/components/Calendar/Calendar.vue';
import BasePopup from '@/components/BasePopup/BasePopup.vue';
import router from '@/utils/router';
import env from '@/config/appConfig';
import { getCampaignList } from '@/api';

/** 服务端固定每页 10 条（pageSize 传了不生效），仅用于"最后一页不满"的判断 */
const PAGE_SIZE = 10;

/** 赛事类型 campType 文案映射（接口不返回 campTypeName，本地兜底） */
const CAMP_TYPE_MAP = {
  1: '卫星赛',
  2: '月赛',
  3: '年终总决赛',
};

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

      // ===== 接口数据 =====
      // 接口返回的 campaignList 经 normalizeCampaign 映射成卡片所需字段
      eventList: [],
      rawResponse: null,
      loading: false,
      finished: false,
      pageNo: 1,
      totalPage: 0,
    };
  },

  computed: {
    activeStatusText() {
      const opt = this.filterGroups[0].options.find((o) => o.value === this.filterValue.status);
      return opt ? opt.text : '全部状态';
    },
    isFinished() {
      return this.finished || (this.totalPage > 0 && this.pageNo >= this.totalPage);
    },
  },

  onLoad() {
    this.fetchList({ reset: true });
  },

  methods: {
    /**
     * 组装列表请求参数（字段名均为实测确认）
     *  - 分页：pageNo（pageSize 传了不生效，服务端固定 10 条/页）
     *  - 搜索：title
     *  - 时间范围：campStartDate / campEndDate，先不启用
     * 状态 / 赛事分类的入参字段名试过 campType / campTypes / campTypeList / type /
     * enrollStatus 等均无效，暂不传，等后端补文档
     */
    buildParams() {
      const params = {
        pageNo: this.pageNo,
      };
      if (this.keyword) {
        params.title = this.keyword;
      }
      return params;
    },

    /**
     * 封面图地址：接口可能返回相对路径（prd-venue/center/xxx.jpg）或完整 URL
     * 相对路径用环境配置的业务资源桶拼完整
     */
    resolveImage(path) {
      if (!path) return '';
      if (/^(https?:)?\/\//.test(path)) return path;
      const base = env.ossUrl || env.ossPrefix || '';
      if (!base) return path;
      return base.replace(/\/?$/, '/') + path.replace(/^\//, '');
    },

    /** yyyy-MM-dd HH:mm:ss -> yyyy.MM.dd */
    formatDate(value) {
      if (!value) return '';
      const date = String(value).slice(0, 10);
      return date.replace(/-/g, '.');
    },

    /** 由赛事时间 + 报名状态推导卡片角标状态（signing / ongoing / upcoming / ended） */
    resolveStatus(item) {
      const now = Date.now();
      const start = item.campStartDate ? new Date(String(item.campStartDate).replace(/-/g, '/')).getTime() : 0;
      const end = item.campEndDate ? new Date(String(item.campEndDate).replace(/-/g, '/')).getTime() : 0;

      if (end && end < now) return 'ended';
      if (start && start > now) return 'upcoming';
      // enroll_status: 0 报名中 / 1 报名已结束
      if (String(item.enroll_status) === '0') return 'signing';
      return 'ongoing';
    },

    /** 接口原始项 -> 卡片渲染所需字段 */
    normalizeCampaign(item = {}) {
      const start = this.formatDate(item.campStartDate);
      const end = this.formatDate(item.campEndDate);
      return {
        id: item.campId,
        banner: this.resolveImage(item.coverImg),
        title: item.title || '',
        dateRange: start && end ? `${start}–${end}` : start || end || '',
        // 门店/球场名优先，其次场地、中心名
        location: item.venueName || item.place || item.centerName || '',
        tag: CAMP_TYPE_MAP[item.campType] || '',
        status: this.resolveStatus(item),
        signUpCount: item.enrolledNum ?? 0,
        raw: item,
      };
    },

    /** 列表数组：接口字段名是 campaignList */
    pickList(res) {
      if (!res) return [];
      if (Array.isArray(res.campaignList)) return res.campaignList;
      if (Array.isArray(res.list)) return res.list;
      if (Array.isArray(res.data)) return res.data;
      return [];
    },

    /** 总页数：根节点 totalPage */
    pickTotalPage(res) {
      if (!res) return 0;
      const total = res.totalPage ?? res.data?.totalPage;
      return Number(total) || 0;
    },

    /** 拉取赛事列表，reset=true 表示重置分页重新拉 */
    async fetchList({ reset = false } = {}) {
      if (this.loading) return;
      if (!reset && this.isFinished) return;

      if (reset) {
        this.pageNo = 1;
        this.totalPage = 0;
        this.finished = false;
      }

      this.loading = true;
      try {
        const res = await getCampaignList(this.buildParams(), { loading: false });
        // 原始响应留档，方便后续核对字段
        this.rawResponse = res;

        const list = this.pickList(res).map((item) => this.normalizeCampaign(item));
        this.totalPage = this.pickTotalPage(res);
        this.eventList = reset ? list : this.eventList.concat(list);

        // 没有 totalPage 时用"本次返回不足一页"判断到底
        this.finished = this.totalPage ? this.pageNo >= this.totalPage : list.length < PAGE_SIZE;
      } catch (err) {
        // 错误提示已由 request 拦截器统一 toast，这里只留日志
        console.error('[eventList] 赛事列表请求失败:', err);
        this.finished = true;
      } finally {
        this.loading = false;
      }
    },

    /** 触底加载下一页 */
    handleLoadMore() {
      if (this.loading || this.isFinished) return;
      this.pageNo += 1;
      this.fetchList();
    },

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
      this.fetchList({ reset: true });
    },
    // 分类切换
    handleCategoryChange(value) {
      this.activeCategory = value;
      this.fetchList({ reset: true });
    },
    // 切换筛选面板
    toggleFilterPanel() {
      this.filterExpanded = !this.filterExpanded;
    },
    // 选择状态
    selectStatus(value) {
      this.filterValue.status = value;
      this.filterExpanded = false;
      this.fetchList({ reset: true });
    },
    // 打开日期选择
    openDate() {
      this.dateVisible = true;
    },
    // 选中日期（时间范围筛选暂不参与请求）
    handleDateSelect() {
      this.dateVisible = false;
    },
    // 点击赛事卡片
    handleCardClick(item) {
      // TODO: 跳转赛事详情
      console.log('点击赛事:', item);
    },
  },
};
</script>

<style lang="scss" scoped src="./index.scss"></style>
