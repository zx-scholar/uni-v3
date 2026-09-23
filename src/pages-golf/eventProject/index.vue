<template>
  <view class="page-container page-has-bg">
    <NavBar title="赛事项目" color="#000" />

    <scroll-view class="page-scroll-content" scroll-y>
      <view class="scroll-wrapper">
        <view v-for="(event, index) in eventList" :key="index" class="event-card">
          <!-- 卡片头：标题 + 状态 -->
          <view class="flex-between">
            <view class="flex items-center gap-8">
              <text class="iconfont icon-jiangbei1 event-trophy"></text>
              <text class="fs-lg fw-600 color-text-primary">{{ event.title }}</text>
            </view>
            <text class="fs-base color-primary">{{ event.status }}</text>
          </view>

          <!-- 信息行 -->
          <view class="mt-8">
            <view class="flex mt-16">
              <text class="event-label">组别限制</text>
              <text class="event-value">{{ event.group }}</text>
            </view>
            <view class="flex mt-16">
              <text class="event-label">已报人数</text>
              <text class="event-value">{{ event.enrolled }}</text>
            </view>
            <view class="flex mt-16">
              <text class="event-label">报名时间</text>
              <text class="event-value">{{ event.regTime }}</text>
            </view>
            <view class="flex mt-16">
              <text class="event-label">活动时间</text>
              <text class="event-value">{{ event.actTime }}</text>
            </view>
            <view class="flex mt-16">
              <text class="event-label">报名要求</text>
              <text class="event-value">{{ event.requirement }}</text>
            </view>
          </view>

          <view class="event-divider"></view>

          <!-- 价格 + 报名按钮 -->
          <view class="flex-between items-center">
            <view class="flex items-end">
              <text class="event-price-symbol">¥</text>
              <text class="event-price-num">{{ event.price }}</text>
            </view>
            <view class="event-signup-btn" @click="handleSignup(event)">
              <text class="fs-md color-text-white">立即报名</text>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  name: 'EventProjectPage',

  data() {
    return {
      // 赛事列表（静态占位数据，后续接赛事接口替换）
      eventList: [
        {
          title: '单人赛',
          status: '报名中',
          group: '不限',
          enrolled: '1/99人',
          regTime: '2026.08.03–2026.08.23',
          actTime: '2026.08.25 00:00–2026.08.26 00:00',
          requirement: '–',
          price: 40,
        },
        {
          title: '混双组',
          status: '报名中',
          group: '不限',
          enrolled: '1/99人',
          regTime: '2026.08.03–2026.08.23',
          actTime: '2026.08.25 00:00–2026.08.26 00:00',
          requirement: '–',
          price: 100,
        },
      ],
    };
  },

  onLoad() {},

  methods: {
    handleSignup(event) {
      console.log('报名：', event.title);
      uni.showToast({ title: '报名功能待接入', icon: 'none' });
    },
  },
};
</script>

<style lang="scss" scoped src="./index.scss"></style>
