<template>
  <view class="activity-card">
    <!-- 顶部用户信息 -->
    <view class="card-header">
      <view class="user">
        <view class="user__avatar-wrap">
          <view
            class="user__avatar-ring"
            :style="{ '--progress': progress }"
          ></view>
           <image class="user__avatar" :src="avatar" mode="aspectFill" />
        </view>
        <view class="user__info">
          <text class="user__name">{{ name }}</text>
          <view class="user__rating">
            <text class="iconfont icon-wujiaoxing1 rating__icon"></text>
            <text class="rating__text">{{ rating }}</text>
          </view>
        </view>
      </view>
      <view class="deposit">
        <text class="deposit__label">订金¥</text>
        <text class="deposit__amount">{{ deposit }}</text>
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
          <template v-for="(item, idx) in visibleItems">
            <image
              v-if="item.type === 'avatar'"
              :key="'avatar-' + idx"
              class="participants__avatar"
              :src="item.url"
              mode="aspectFill"
              :style="{ zIndex: visibleItems.length - idx }"
            />
            <view
              v-else
              :key="'overflow-' + idx"
              class="participants__overflow"
            >
              <text class="participants__overflow-text">···</text>
            </view>
          </template>
        </view>
        <text class="participants__text">
          <text class="participants__count">{{ joinedCount }}/{{ totalCount }}</text>
          <text class="participants__suffix">人已成团</text>
        </text>
      </view>
      <button
             disabled
              class="join-btn"
              @click="handleJoin"
            >加入球局</button>
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
    visibleItems() {
      const items = this.participants.slice(0, 3).map((url) => ({
        type: 'avatar',
        url,
      }));
      if (this.participants.length > 3) {
        items.push({ type: 'overflow' });
      }
      return items;
    },
    progress() {
      const total = Number(this.totalCount) || 0;
      if (total <= 0) return 0;
      const joined = Math.min(Number(this.joinedCount) || 0, total);
      return joined / total;
    },
    isFull() {
      return this.progress >= 1;
    },
  },
  methods: {
    handleJoin() {
      if (this.isFull) return;
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

  &__avatar-wrap {
    position: relative;
    flex-shrink: 0;
    width: 74px;
    height: 74px;
  }

  &__avatar-ring {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: conic-gradient(
      from 270deg,
      #159a62 calc(var(--progress) * 360deg),
      #F1F4F8 0
    );
  }

  &__avatar {
    position: absolute;
    top: 3px;
    left: 3px;
    width: 68px;
    height: 68px;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.6);
    background-color: #ffffff;
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
    font-size: 30px;
    font-weight: 500;
    color: #1c1f1e;
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
  font-size: 24px;
  line-height: 1;
  color: #d9b45b;
}

.rating__text {
  margin-left: 6px;
  font-size: 24px;
  font-weight: 400;
  line-height: 1;
  color: #d9b45b;
}

.deposit {
  display: flex;
  flex-direction: row;
  align-items: baseline;
  flex-shrink: 0;

  &__label {
    font-size: 24px;
    font-weight: 400;
    line-height: 1;
    color: #c98b32;
  }

  &__amount {
    margin-left: 4px;
    font-size: 36px;
    font-weight: 500;
    line-height: 1;
    color: #c98b32;
  }
}

/* ---- 活动标题 ---- */
.card-title {
  display: block;
  margin: 24px 0 16px;
  font-size: 34px;
  font-weight: 500;
  line-height: 1.3;
  color: #1c1f1e;
}

/* ---- 标签 ---- */
.card-tags {
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
  margin: 16px 0;
}

.card-tag {
  padding: 5px 10px;
  font-size: 20px;
  font-weight: 400;
  border-radius: 4px;

  & + & {
    margin-left: 10px;
  }

  &--green {
    color: #167a4a;
    background-color: #e8f5ee;
  }

  &--pink {
    color: #ff537b;
    background-color: #ffedf2;
  }
}

/* ---- 时间 / 地点 ---- */
.card-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 16px;

  &__icon {
    flex-shrink: 0;
    font-size: 26px;
    line-height: 1;
    color: #6b7370;
  }

  &__text {
    margin-left: 8px;
    font-size: 26px;
    font-weight: 400;
    line-height: 1.2;
    color: #6b7370;
  }
}

/* ---- 分割线 ---- */
.card-divider {
  height: 1px;
  margin: 0;
  background-color: #e8e8e8;
}

/* ---- 底部 ---- */
.card-bottom {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-top: 20px;
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
    width: 42px;
    height: 42px;
    border-radius: 50%;
    border: 1px solid #ffffff;
    background-color: #e1e5eb;
    box-sizing: border-box;
  }

  &__avatar + &__avatar {
    margin-left: -12px;
  }

  &__overflow {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 42px;
    height: 42px;
    margin-left: -12px;
    border-radius: 50%;
    border: 1px solid #ffffff;
    background-color: #e8f5ee;
    box-sizing: border-box;
  }

  &__overflow-text {
    font-size: 32px;
    font-weight: 400;
    line-height: 42px;
    text-align: center;
    color: #167a4a;
  }

  &__text {
    margin-left: 12px;
    font-size: 24px;
    font-weight: 400;
    line-height: 1;
  }

  &__count {
    color: #167a4a;
  }

  &__suffix {
    color: #6b7370;
  }
}

.join-btn {
  /* 重置 button 默认样式 */
  margin: 0;
  border: none;
  background: transparent;
  /* 自定义样式 */
  flex-shrink: 0;
  width: 160px;
  height: 60px;
  padding: 16px 24px;
  border-radius: 36px;
  background: $color-gradient-btn;
  font-size: 28px;
  font-weight: 500;
  line-height: 28px;
  text-align: center;
  color: #ffffff;
  box-sizing: border-box;

  // &:active {
  //   opacity: 0.85;
  // }

  &[disabled] {
    opacity: 0.5;
    color: #ffffff;
  }
}
</style>
