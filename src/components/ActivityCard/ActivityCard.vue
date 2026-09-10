<template>
  <view class="activity-card">
    <!-- 顶部用户信息 -->
    <view class="card-header">
      <view class="user">
        <image class="user__avatar" :src="avatar" mode="aspectFill" />
        <view class="user__info">
          <text class="user__name">{{ name }}</text>
          <view class="user__rating">
            <text class="iconfont icon-wujiaoxing1 rating__icon"></text>
            <text class="rating__text">{{ rating }}</text>
          </view>
        </view>
      </view>
      <view class="deposit">
        <text class="deposit__label">订金</text>
        <text class="deposit__amount">¥{{ deposit }}</text>
      </view>
    </view>

    <!-- 活动标题 -->
    <text class="card-title">{{ mainTitle }}<text v-if="subTitle" class="card-title__sep"> · </text>{{ subTitle }}</text>

    <!-- 标签 -->
    <view class="card-tags">
      <view
        v-for="(tag, idx) in tags"
        :key="idx"
        class="card-tag"
        :class="['card-tag--' + (tag.colorType || 'green')]"
      >{{ tag.text }}</view>
    </view>

    <!-- 时间 -->
    <view class="card-row">
      <text class="iconfont icon-shijian1 card-row__icon"></text>
      <text class="card-row__text">{{ dateTime }}</text>
    </view>

    <!-- 地点 -->
    <view class="card-row">
      <text class="iconfont icon-weizhi3 card-row__icon"></text>
      <text class="card-row__text">{{ location }}</text>
    </view>

    <!-- 分割线 -->
    <view class="card-divider"></view>

    <!-- 底部 -->
    <view class="card-bottom">
      <view class="participants">
        <view class="participants__avatars">
          <image
            v-for="(url, idx) in displayParticipants"
            :key="idx"
            class="participants__avatar"
            :src="url"
            mode="aspectFill"
            :style="{ zIndex: displayParticipants.length - idx }"
          />
        </view>
        <text class="participants__text">
          <text class="participants__count">{{ joinedCount }}/{{ totalCount }}</text>
          <text class="participants__suffix">人已成团</text>
        </text>
      </view>
      <view class="join-btn" @click="handleJoin">加入球局</view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'ActivityCard',
  props: {
    avatar: { type: String, default: '' },
    name: { type: String, default: '' },
    rating: { type: [Number, String], default: 0 },
    deposit: { type: [Number, String], default: 0 },
    mainTitle: { type: String, default: '' },
    subTitle: { type: String, default: '' },
    tags: { type: Array, default: () => [] },
    dateTime: { type: String, default: '' },
    location: { type: String, default: '' },
    participants: { type: Array, default: () => [] },
    joinedCount: { type: [Number, String], default: 0 },
    totalCount: { type: [Number, String], default: 0 },
  },
  emits: ['join'],
  computed: {
    displayParticipants() {
      return this.participants.slice(0, 4);
    },
  },
  methods: {
    handleJoin() {
      this.$emit('join');
    },
  },
};
</script>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

$img-card-bg: '#{$img-base}/gameImage6210d826692f45f9bb2797c21e41f5a8.png';

.activity-card {
  position: relative;
  width: 100%;
  max-width: 702px;
  margin: 0 auto;
  padding: 24px;
  border-radius: 16px;
  background-color: #fff;
  background-image: url($img-card-bg);
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  box-sizing: border-box;
}

/* ---- 顶部用户信息 ---- */
.card-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.user {
  display: flex;
  flex-direction: row;
  align-items: center;
  flex: 1;
  min-width: 0;

  &__avatar {
    flex-shrink: 0;
    width: 68px;
    height: 68px;
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 0.6);
    box-sizing: border-box;
  }

  &__info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-left: 16px;
    min-width: 0;
  }

  &__name {
    font-size: 26px;
    font-weight: 600;
    color: #333333;
    line-height: 1.2;
  }

  &__rating {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-top: 8px;
  }
}

.rating__icon {
  font-size: 20px;
  line-height: 1;
  color: #d8a43a;
}

.rating__text {
  margin-left: 6px;
  font-size: 18px;
  line-height: 1;
  color: #d8a43a;
}

.deposit {
  display: flex;
  flex-direction: row;
  align-items: baseline;
  flex-shrink: 0;

  &__label {
    font-size: 17px;
    line-height: 1;
    color: #7d8585;
  }

  &__amount {
    margin-left: 4px;
    font-size: 25px;
    font-weight: 600;
    line-height: 1;
    color: #ff7a45;
  }
}

/* ---- 活动标题 ---- */
.card-title {
  display: block;
  margin-top: 18px;
  font-size: 25px;
  font-weight: 600;
  line-height: 1.3;
  color: #333333;
}

/* ---- 标签 ---- */
.card-tags {
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 14px;
}

.card-tag {
  height: 28px;
  line-height: 28px;
  padding: 0 10px;
  font-size: 14px;
  border-radius: 4px;

  & + & {
    margin-left: 10px;
  }

  &--green {
    color: #55a878;
    background-color: #e8f7ef;
  }

  &--pink {
    color: #ff6b8a;
    background-color: #fff0f4;
  }
}

/* ---- 时间 / 地点 ---- */
.card-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 12px;

  &__icon {
    flex-shrink: 0;
    font-size: 22px;
    line-height: 1;
    color: #8a9393;
  }

  &__text {
    margin-left: 8px;
    font-size: 18px;
    line-height: 1.2;
    color: #7d8585;
  }
}

.card-row + .card-row {
  margin-top: 10px;
}

/* ---- 分割线 ---- */
.card-divider {
  height: 1px;
  margin: 18px 0 14px;
  background-color: #e8e8e8;
}

/* ---- 底部 ---- */
.card-bottom {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.participants {
  display: flex;
  flex-direction: row;
  align-items: center;
  flex: 1;
  min-width: 0;

  &__avatars {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  &__avatar {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    border: 2px solid #ffffff;
    background-color: #e1e5eb;
    box-sizing: border-box;
  }

  &__avatar + &__avatar {
    margin-left: -10px;
  }

  &__text {
    margin-left: 12px;
    font-size: 17px;
    line-height: 1;
  }

  &__count {
    color: #159a62;
  }

  &__suffix {
    color: #8a9393;
  }
}

.join-btn {
  flex-shrink: 0;
  width: 120px;
  height: 48px;
  line-height: 48px;
  text-align: center;
  font-size: 18px;
  font-weight: 500;
  color: #ffffff;
  background-color: #159a62;
  border-radius: 24px;

  &:active {
    opacity: 0.85;
  }
}
</style>
