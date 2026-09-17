<template>
  <view class="basic-template-page">
    <!-- 顶部自定义导航栏 -->
    <NavBar title="评价球友" color="#1c1f1e" :showBack="true" />

    <!-- 主体滚动区域 -->
    <scroll-view class="page-scroll" scroll-y>
      <view class="page-content">
        <!-- 未评价卡片 -->
        <template v-if="!hasEvaluated">
          <view
            v-for="(player, idx) in playersInfo.list"
            :key="'editing-' + idx"
            class="evaluate-card"
          >
            <!-- 头部：头像 + 姓名 + 角色 -->
            <view class="evaluate-card__header">
              <view class="evaluate-card__user">
                <view class="evaluate-card__avatar-wrap">
                  <view
                    v-if="!player.avatar"
                    class="evaluate-card__avatar-placeholder"
                  >
                    <view class="iconfont icon-geren"></view>
                  </view>
                  <view
                    v-else
                    class="evaluate-card__avatar"
                    :style="{ backgroundImage: `url(${player.avatar})` }"
                  />
                </view>
                <view class="evaluate-card__user-info">
                  <text class="evaluate-card__name">{{ player.name }}</text>
                  <view v-if="player.rating" class="evaluate-card__user-rating">
                    <text class="iconfont icon-wujiaoxing1"></text>
                    <text>{{ player.rating }}</text>
                  </view>
                </view>
              </view>
              <view v-if="player.role" class="evaluate-card__role">{{ player.role }}</view>
            </view>

            <view class="evaluate-card__divider"></view>

            <!-- 评分区 -->
            <view class="evaluate-card__rate">
              <view class="evaluate-card__rate-label">为 TA 评分</view>
              <view class="evaluate-card__stars">
                <view
                  v-for="star in 5"
                  :key="star"
                  class="evaluate-card__star"
                  :class="{ 'evaluate-card__star--active': player.score >= star }"
                  @click="handleRate(idx, star)"
                >
                  <text class="iconfont icon-wujiaoxing1"></text>
                </view>
              </view>
              <view class="evaluate-card__rate-text">{{ rateText(player.score) }}</view>
            </view>
          </view>
        </template>

        <!-- 已评价卡片（只读） -->
        <template v-else>
          <view
            v-for="(player, idx) in playersInfo.list"
            :key="'readonly-' + idx"
            class="evaluate-card evaluate-card--readonly"
          >
            <!-- 头部：88px 头像 + 姓名 + 角色 -->
            <view class="evaluate-card__header">
              <view class="evaluate-card__user">
                <view class="evaluate-card__avatar-wrap">
                  <view
                    v-if="!player.avatar"
                    class="evaluate-card__avatar-placeholder"
                  >
                    <view class="iconfont icon-geren"></view>
                  </view>
                  <view
                    v-else
                    class="evaluate-card__avatar"
                    :style="{ backgroundImage: `url(${player.avatar})` }"
                  />
                </view>
                <view class="evaluate-card__user-info">
                  <text class="evaluate-card__name">{{ player.name }}</text>
                  <view v-if="player.rating" class="evaluate-card__user-rating">
                    <text class="iconfont icon-wujiaoxing1"></text>
                    <text>{{ player.rating }}</text>
                  </view>
                </view>
              </view>
              <view v-if="player.role" class="evaluate-card__role">{{ player.role }}</view>
            </view>

            <view class="evaluate-card__divider"></view>

            <!-- 只读评价区：我的评价 + 小星星 + 等级 -->
            <view class="evaluate-card__readonly">
              <view class="evaluate-card__readonly-label">我的评价</view>
              <view class="evaluate-card__readonly-stars">
                <view
                  v-for="star in 5"
                  :key="star"
                  class="evaluate-card__readonly-star"
                  :class="{ 'evaluate-card__readonly-star--active': player.score >= star }"
                >
                  <text class="iconfont icon-wujiaoxing1"></text>
                </view>
              </view>
              <view class="evaluate-card__readonly-text">{{ rateText(player.score) }}</view>
            </view>
          </view>
        </template>
      </view>
    </scroll-view>

    <!-- 底部固定按钮栏 -->
    <view v-if="!hasEvaluated" class="page-bottom-bar">
      <view class="page-bottom-bar__btn page-bottom-bar__btn--full page-bottom-bar__btn--gradient" @click="handleSubmit">提交评价</view>
    </view>
  </view>
</template>

<script>
// 默认头像（OSS 地址，示例数据统一使用）
const DEFAULT_AVATAR = 'https://xports-prd.oss-cn-hangzhou.aliyuncs.com/prd/gameImage435e535355054676b75a1dc774fb80b3.png';

// 评分等级文案（1~5 星对应文案）
const RATE_LABELS = ['', '较差', '一般', '还行', '推荐', '超赞'];

export default {
  name: 'BallBitEvaluateGolfPage',

  data() {
    return {
      // 页面状态：false = 未评价（可打分） | true = 已评价（只读）
      // 接接口时由后端返回的字段决定（球友都评过则 true，否则 false）
      hasEvaluated: false,
      // 待评价球友列表（接接口时由后端返回）
      playersInfo: {
        list: [
          { avatar: DEFAULT_AVATAR, name: '世界第一网球打手', rating: 4.9, role: '发起人', score: 3 },
          { avatar: DEFAULT_AVATAR, name: '老虎伍兹', rating: 4.9, role: '', score: 5 },
          { avatar: DEFAULT_AVATAR, name: '小鸟伊人', rating: 4.9, role: '', score: 0 },
        ],
      },
    };
  },

  methods: {
    // 点击星星打分
    handleRate(idx, star) {
      this.playersInfo.list[idx].score = star;
    },

    // 根据分数返回等级文案
    rateText(score) {
      return RATE_LABELS[score] || '';
    },

    // 提交评价
    handleSubmit() {
      const unrated = this.playersInfo.list.filter((p) => !p.score);
      if (unrated.length) {
        uni.showToast({
          title: `还有 ${unrated.length} 位球友未评分`,
          icon: 'none',
        });
        return;
      }
      uni.showLoading({ title: '提交中...' });
      // TODO：调接口提交评分
      // 成功后翻转页面状态进入 “只读” 模式
      setTimeout(() => {
        uni.hideLoading();
        uni.showToast({ title: '提交成功', icon: 'success' });
        this.hasEvaluated = true;
      }, 600);
    },
  },
};
</script>

<style lang="scss" scoped src="./index.scss"></style>
