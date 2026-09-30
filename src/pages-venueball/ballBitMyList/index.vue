<template>
  <view class="basic-template-page">
    <!-- 顶部自定义导航栏 -->
    <NavBar title="我的约球" color="#1c1f1e" :showBack="true" />

    <!-- 主体滚动区域 -->
    <scroll-view class="page-scroll" scroll-y>
      <view class="page-content">
        <!-- Tab 切换栏 -->
        <view class="my-tab">
          <view
            v-for="tab in tabs"
            :key="tab.key"
            class="my-tab__item"
            :class="{ 'my-tab__item--active': activeTab === tab.key }"
            @click="activeTab = tab.key"
          >
            <text class="my-tab__text">{{ tab.text }}</text>
            <view v-if="activeTab === tab.key" class="my-tab__line"></view>
          </view>
        </view>

        <!-- 约球卡片列表 -->
        <view
          v-for="(item, idx) in currentList"
          :key="idx"
          class="my-card"
        >
          <view class="my-card__row">
            <view class="my-card__title-wrap">
              <text class="my-card__title">{{ item.title }}</text>
            </view>
            <view
              class="my-card__status"
              :class="'my-card__status--' + (item.statusColor || 'green')"
            >{{ item.statusText }}</view>
          </view>

          <view class="my-card__row">
            <text class="iconfont icon-shijian1 my-card__icon"></text>
            <text class="my-card__desc">{{ item.dateTime }}</text>
          </view>

          <view class="my-card__row">
            <text class="iconfont icon-weizhi3 my-card__icon"></text>
            <text class="my-card__desc">{{ item.location }}</text>
          </view>

          <!-- "已完成" 状态显示 "评价球友" 按钮 -->
          <view v-if="item.canEvaluate" class="my-card__footer">
            <view class="my-card__btn" @click="handleEvaluate(item)">评价球友</view>
          </view>
        </view>

        <!-- 空状态：列表为空时显示 -->
        <view v-if="currentList.length === 0" class="my-empty">
          <text class="my-empty__text">暂无约球记录</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  name: 'BallBitMyListPage',

  data() {
    return {
      // 当前选中的 tab：'created' | 'joined'
      activeTab: 'created',

      // Tab 配置
      tabs: [
        { key: 'created', text: '我发起的' },
        { key: 'joined', text: '我参与的' },
      ],

      // 我发起的约球
      createdList: [
        {
          title: '周六约球·102包厢',
          statusText: '成团中',
          statusColor: 'green',
          dateTime: '08/08 周六 14:00-16:00',
          location: 'GOLFZON PARK 南京旗舰店',
          canEvaluate: false,
        },
        {
          title: '周六约球·102包厢',
          statusText: '已完成',
          statusColor: 'default',
          dateTime: '08/08 周六 14:00-16:00',
          location: 'GOLFZON PARK 南京旗舰店',
          canEvaluate: true,
        },
        {
          title: '周六约球·102包厢',
          statusText: '未成团',
          statusColor: 'default',
          dateTime: '08/08 周六 14:00-16:00',
          location: 'GOLFZON PARK 南京旗舰店',
          canEvaluate: false,
        },
      ],

      // 我参与的约球
      joinedList: [
        {
          title: '周三练习场·3号位',
          statusText: '已成团',
          statusColor: 'default',
          dateTime: '08/12 周三 19:00-21:00',
          location: '南京奥体中心练习场',
          canEvaluate: false,
        },
        {
          title: '周日下午茶局',
          statusText: '成团中',
          statusColor: 'green',
          dateTime: '08/10 周日 15:00-17:00',
          location: '银杏湖高尔夫俱乐部',
          canEvaluate: false,
        },
      ],
    };
  },

  computed: {
    // 根据当前 tab 返回对应列表
    currentList() {
      return this.activeTab === 'created' ? this.createdList : this.joinedList;
    },
  },

  methods: {
    // 点击 "评价球友" 跳到评价页
    handleEvaluate(item) {
      router.push('ballBitEvaluateGolf', { matchId: item.id });
    },
  },
};
</script>

<style lang="scss" scoped src="./index.scss"></style>
