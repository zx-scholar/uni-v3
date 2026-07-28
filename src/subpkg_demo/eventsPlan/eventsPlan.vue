<template>
  <view class="events-plan-page">
    <NavBar title="" color="#ffffff" />

    <scroll-view class="page-scroll" scroll-y>
      <view class="page-content">
      <!-- 日期选择条 -->
      <scroll-view class="date-bar" scroll-x>
        <view
          v-for="date in dateList"
          :key="date.value"
          class="date-item"
          :class="{ 'date-item--active': date.value === activeDate }"
          @click="handleSelectDate(date.value)"
        >
          <text class="date-day">{{ date.day }}</text>
          <text class="date-week">{{ date.week }}</text>
        </view>
      </scroll-view>

      <!-- 球队筛选 -->
      <view class="team-filter" @click="handleFilterTeam">
        <text class="team-filter-text">全部球队</text>
        <text class="team-filter-arrow">▼</text>
      </view>

      <!-- 时间段分组 -->
      <view
        v-for="group in matchGroups"
        :key="group.timeRange"
        class="match-card"
      >
        <view class="match-card-header">
          <text class="iconfont icon-shijian1 time-icon"></text>
          <text class="time-range">{{ group.timeRange }}</text>
        </view>

        <view class="match-list">
          <view
            v-for="(match, index) in group.matches"
            :key="index"
            class="match-row"
            :class="{ 'match-row--finished': match.status === 'finished' }"
          >
            <view class="match-teams">
              <view class="team-row">
                <text class="team-name">{{ match.teamA }}</text>
                <text class="team-score" :class="{ 'team-score--win': match.winner === 'A' }">{{ match.scoreA }}</text>
                <text class="winner-mark" :class="{ 'winner-mark--win': match.winner === 'A' }">{{ match.winner === 'A' ? '◀' : '' }}</text>
              </view>
              <view class="team-row team-row--alt">
                <text class="team-name">{{ match.teamB }}</text>
                <text class="team-score" :class="{ 'team-score--win': match.winner === 'B' }">{{ match.scoreB }}</text>
                <text class="winner-mark" :class="{ 'winner-mark--win': match.winner === 'B' }">{{ match.winner === 'B' ? '◀' : '' }}</text>
              </view>
            </view>

            <view class="match-action">
              <text v-if="match.status === 'finished'" class="match-status">已完赛</text>
              <text v-else class="match-status match-status--pending">未开赛</text>
              <view
                v-if="match.status === 'finished'"
                class="view-result"
                @click="handleViewResult(match)"
              >
                <image class="view-result-icon" src="./img/item-icon-event.png" mode="aspectFit"></image>
                <text class="view-result-text">查看赛果</text>
              </view>
            </view>
          </view>
        </view>
      </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  name: 'EventsPlanPage',

  data() {
    return {
      activeDate: '07-06',

      dateList: [
        { value: '07-06', day: '07-06', week: '周一' },
        { value: '07-07', day: '07-07', week: '周二' },
        { value: '07-27', day: '07-27', week: '周一' },
        { value: '07-28', day: '07-28', week: '周二' },
        { value: '08-12', day: '08-12', week: '周二' },
        { value: '08-13', day: '08-13', week: '周三' }
      ],

      // 后续接入接口时替换该静态数据
      matchGroups: [
        {
          timeRange: '9:00:00-13:00:00',
          matches: [
            { teamA: '南京队', scoreA: 18, winner: 'A', teamB: '无锡队', scoreB: 10, status: 'finished' },
            { teamA: '南京队', scoreA: 10, winner: 'B', teamB: '镇江队', scoreB: 18, status: 'finished' },
            { teamA: '苏州队', scoreA: 10, winner: 'B', teamB: '南通队', scoreB: 18, status: 'finished' }
          ]
        },
        {
          timeRange: '15:30:00-19:30:00',
          matches: [
            { teamA: '南京队', scoreA: '—', winner: null, teamB: '无锡队', scoreB: '—', status: 'pending' }
          ]
        }
      ]
    }
  },

  methods: {
    handleSelectDate(value) {
      this.activeDate = value
      // 后续接入接口时在此发起请求
      console.log('[EventsPlan] selected date:', value)
    },

    handleFilterTeam() {
      // 仅还原样式，暂不实现下拉选择
      console.log('[EventsPlan] team filter tapped')
    },

    handleViewResult(match) {
      // 占位点击方法，后续接入赛果详情页跳转
      console.log('[EventsPlan] view result:', match)
      uni.showToast({ title: '查看赛果', icon: 'none' })
    }
  }
}
</script>

<style lang="scss" scoped src="./eventsPlan.scss"></style>
