<template>
  <BasePopup
    :visible="visible"
    mode="bottom"
    :mask-closable="true"
    :max-height="'90vh'"
    @update:visible="$emit('update:visible', $event)"
  >
    <view class="create-game">
      <!-- 自定义标题栏：返回 + 标题 + 关闭 -->
      <view class="create-game__header">
        <text
          class="iconfont icon-zuo create-game__back"
          @click="handleBack"
        ></text>
        <text class="create-game__title">发起约球</text>
        <text
          class="iconfont icon-cuowu2 create-game__close"
          @click="handleClose"
        ></text>
      </view>

      <!-- 主体筛选项（复用 FilterPanel 的 chip 样式） -->
      <view class="create-game__body">
        <view
          v-for="group in groups"
          :key="group.key"
          class="create-game__group"
        >
          <text class="create-game__group-title">{{ group.title }}</text>
          <view class="create-game__group-options">
            <view
              v-for="opt in group.options"
              :key="opt.value"
              class="create-game__chip"
              :class="{ 'is-selected': modelValue[group.key] === opt.value }"
              @click="select(group.key, opt.value)"
            >{{ opt.text }}</view>
          </view>
        </view>
      </view>

      <!-- 底部：发起约球按钮 -->
      <view class="create-game__footer">
        <view
          class="create-game__btn"
          @click="handleSubmit"
        >发起约球</view>
      </view>
    </view>
  </BasePopup>
</template>

<script>
import BasePopup from '@/components/BasePopup/BasePopup.vue';

export default {
  name: 'CreateGame',
  components: { BasePopup },
  props: {
    visible: { type: Boolean, default: false },
    // 表单数据 { handicap, gender, smoking }
    modelValue: {
      type: Object,
      default: () => ({
        handicap: '',
        gender: '',
        smoking: '',
      }),
    },
    // 筛选项配置
    groups: {
      type: Array,
      default: () => [
        {
          key: 'handicap',
          title: '差点要求',
          options: [
            { text: '不限', value: '' },
            { text: '差点18以内', value: '18' },
            { text: '差点20以内', value: '20' },
          ],
        },
        {
          key: 'gender',
          title: '性别',
          options: [
            { text: '不限', value: '' },
            { text: '男士', value: 'male' },
            { text: '女士', value: 'female' },
          ],
        },
        {
          key: 'smoking',
          title: '抽烟',
          options: [
            { text: '不限', value: '' },
            { text: '室内禁烟', value: 'no_smoking' },
          ],
        },
      ],
    },
  },
  emits: ['update:visible', 'update:modelValue', 'back', 'close', 'submit'],
  methods: {
    select(key, value) {
      const next = { ...this.modelValue, [key]: value };
      this.$emit('update:modelValue', next);
    },
    handleBack() {
      this.$emit('back');
    },
    handleClose() {
      this.$emit('update:visible', false);
      this.$emit('close');
    },
    handleSubmit() {
      this.$emit('update:visible', false);
      this.$emit('submit', this.modelValue);
    },
  },
};
</script>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

.create-game {
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: #ffffff;
  box-sizing: border-box;
}

/* ---- 自定义标题栏 ---- */
.create-game__header {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 88px;
  border-bottom: 1px solid #ececec;
  flex-shrink: 0;
}

.create-game__back {
  position: absolute;
  left: 24px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 32px;
  color: #1c1f1e;
  padding: 10px;
}

.create-game__title {
  font-size: 32px;
  font-weight: 600;
  color: #1c1f1e;
  line-height: 1;
}

.create-game__close {
  position: absolute;
  right: 24px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 28px;
  color: #94a3b8;
  padding: 10px;
}

/* ---- 主体 ---- */
.create-game__body {
  padding: 24px;
  box-sizing: border-box;
}

.create-game__group {
  margin-bottom: 24px;
}

.create-game__group-title {
  display: block;
  margin-bottom: 20px;
  font-size: 28px;
  font-weight: 500;
  line-height: 1.2;
  color: #1c1f1e;
}

.create-game__group-options {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 0;
}

/* ---- chip（参照 FilterPanel 样式） ---- */
.create-game__chip {
  width: 168px;
  height: 64px;
  line-height: 64px;
  margin-right: 16px;
  margin-bottom: 16px;
  font-size: 24px;
  font-weight: 400;
  color: #1c1f1e;
  background-color: #f1f4f8;
  border-radius: 8px;
  text-align: center;
  box-sizing: border-box;

  &.is-selected {
    color: #167a4a;
    background-color: #e8f5ee;
  }
}

/* ---- 底部按钮 ---- */
.create-game__footer {
  padding: 0 24px 32px;
  box-sizing: border-box;
}

.create-game__btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 90px;
  line-height: 90px;
  font-size: 34px;
  font-weight: 400;
  color: #ffffff;
  background: $color-gradient-btn;
  border-radius: 45px;
  box-sizing: border-box;
}
</style>
