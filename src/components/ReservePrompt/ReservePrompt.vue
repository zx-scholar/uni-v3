<template>
  <BasePopup
    :visible="visible"
    mode="center"
    :mask-closable="true"
    width="600px"
    @update:visible="$emit('update:visible', $event)"
  >
    <view class="reserve-prompt">
      <!-- 顶部图片盒子 -->
      <view class="reserve-prompt__image-box">
        <image
          class="reserve-prompt__image"
          :src="imageUrl"
          mode="aspectFit"
        />
      </view>

      <!-- 标题 -->
      <text class="reserve-prompt__title">先预约场地</text>

      <!-- 描述 -->
      <text class="reserve-prompt__desc">
        您还没有已预约的场地，发起约球前请先预约场地，再创建球局邀请球友
      </text>

      <!-- 按钮区 -->
      <view class="reserve-prompt__actions">
        <view
          class="reserve-prompt__btn reserve-prompt__btn--cancel"
          @click="handleCancel"
        >取消</view>
        <view
          class="reserve-prompt__btn reserve-prompt__btn--confirm"
          @click="handleConfirm"
        >去预约</view>
      </view>
    </view>
  </BasePopup>
</template>

<script>
import BasePopup from '@/components/BasePopup/BasePopup.vue';

export default {
  name: 'ReservePrompt',
  components: { BasePopup },
  props: {
    visible: { type: Boolean, default: false },
    imageUrl: {
      type: String,
      default: 'https://xports-prd.oss-cn-hangzhou.aliyuncs.com/prd/gameImage39b17be263bd4eeb9170eb2f9e9c2c94.png',
    },
  },
  emits: ['update:visible', 'cancel', 'confirm'],
  methods: {
    handleCancel() {
      this.$emit('update:visible', false);
      this.$emit('cancel');
    },
    handleConfirm() {
      this.$emit('update:visible', false);
      this.$emit('confirm');
    },
  },
};
</script>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

.reserve-prompt {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 600px;
  height: 606px;
  padding: 0;
  box-sizing: border-box;
}

.reserve-prompt__image-box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 266px;
  height: 242px;
  margin-top: 24px;
}

.reserve-prompt__image {
  width: 266px;
  height: 242px;
}

.reserve-prompt__title {
  margin-top: 24px;
  font-size: 34px;
  font-weight: 500;
  color: #1c1f1e;
  line-height: 1.4;
}

.reserve-prompt__desc {
  margin-top: 16px;
  padding: 0 24px;
  font-size: 26px;
  font-weight: 400;
  color: #9aa3a0;
  line-height: 1.5;
  text-align: center;
}

.reserve-prompt__actions {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 24px;
  margin-top: auto;
  margin-bottom: 32px;
}

.reserve-prompt__btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 240px;
  height: 72px;
  border-radius: 36px;
  font-size: 30px;
  font-weight: 500;
  line-height: 1;
  box-sizing: border-box;
}

.reserve-prompt__btn--cancel {
  color: #999999;
  background-color: #eaeaea;
}

.reserve-prompt__btn--confirm {
  color: #ffffff;
  background: $color-gradient-btn;
}
</style>
