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

        <!-- 筛选面板 -->
        <view class="filter-panel-wrap">
          <FilterPanel v-model="filterValue" @confirm="handleFilterConfirm" />
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
  </view>
</template>

<script>
import SearchBar from '@/components/SearchBar/SearchBar.vue';
import ActivityCard from '@/components/ActivityCard/ActivityCard.vue';
import FilterPanel from '@/components/FilterPanel/FilterPanel.vue';

export default {
  name: 'BasicTemplatePage',
  components: { SearchBar, ActivityCard, FilterPanel },

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
      },
    };
  },

  onLoad() {
    this.fetchList();
  },

  methods: {
    // 拉取数据示例
    async fetchList() {
      try {
        // TODO: 在这里调用接口获取数据，例如：
        // const res = await xxxApi();
        // this.list = res.list;
        this.list = [];
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
      // TODO: 接入加入球局逻辑
      console.log('加入球局');
    },

    // 筛选确认
    handleFilterConfirm(value) {
      console.log('筛选条件:', value);
      // TODO: 根据筛选条件请求列表数据
    },
  },
};
</script>

<style lang="scss" scoped src="./index.scss"></style>
