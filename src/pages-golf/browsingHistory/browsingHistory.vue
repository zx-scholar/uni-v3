<template>
  <view class="browsing-history-page">
    <NavBar title="浏览记录123" color="#222222"  />

    <scroll-view class="history-scroll" scroll-y>
      <view class="search-box">
        <text class="iconfont icon-sousuo search-icon"></text>
        <input class="search-input" placeholder="搜索看过的视频内容" placeholder-class="search-placeholder" />
      </view>

      <view v-for="group in historyGroups" :key="group.label" class="history-group">
        <text class="group-title">{{ group.label }}</text>

        <view
          v-for="(item, index) in group.items"
          :key="`${group.label}-${index}`"
          class="history-card"
        >
          <view
            class="video-cover"
            :style="{ backgroundImage: 'url(' + item.cover + ')' }"
          >
            <text class="video-duration">{{ item.duration }}</text>
          </view>

          <view class="video-info">
            <text class="video-title">{{ item.title }}</text>

            <view class="video-stats">
              <view class="stat-item">
                <text class="iconfont icon-shipinheji stat-icon"></text>
                <text class="stat-text">{{ item.views }}次</text>
              </view>
              <view class="stat-item">
                <text class="iconfont icon-dianzan4 stat-icon"></text>
                <text class="stat-text">{{ item.likes }}次</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
const featuredVideo = {
  title: '首轮精彩集锦｜巅峰对决燃爆全场',
  duration: '2:34',
  views: 1234,
  likes: 1234,
  cover: 'http://xports-test.oss-cn-hangzhou.aliyuncs.com/dev/center/10000000/temp/aa179011ebe34bbaac2ef68b8034fe27.png'
}

export default {
  name: 'BrowsingHistoryPage',

  data() {
    return {
      historyGroups: [
        {
          label: '今天',
          items: [{ ...featuredVideo }]
        },
        {
          label: '7天前',
          items: [
            {
              title: '决胜关键洞精彩解析',
              duration: '2:34',
              views: 1234,
              likes: 1234,
              cover: 'http://xports-test.oss-cn-hangzhou.aliyuncs.com/dev/center/10000000/temp/aa179011ebe34bbaac2ef68b8034fe27.png'
            }
          ]
        },
        {
          label: '1个月前',
          items: [{ ...featuredVideo }, { ...featuredVideo }]
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped src="./browsingHistory.scss"></style>
