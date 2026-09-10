<template>
  <view class="search-bar">
    <text class="search-bar__icon iconfont icon-sousuo"></text>
    <input
      class="search-bar__input"
      :value="modelValue"
      :placeholder="placeholder"
      placeholder-class="search-bar__placeholder"
      confirm-type="search"
      @input="handleInput"
      @confirm="handleConfirm"
    />
  </view>
</template>

<script>
export default {
  name: 'SearchBar',
  props: {
    // 搜索关键词 (v-model 双向绑定)
    modelValue: { type: String, default: '' },
    placeholder: { type: String, default: '搜索' },
  },
  emits: ['update:modelValue', 'input', 'confirm'],
  methods: {
    handleInput(e) {
      const value = e.detail.value;
      this.$emit('update:modelValue', value);
      this.$emit('input', value);
    },
    handleConfirm(e) {
      this.$emit('confirm', e.detail.value);
    },
  },
};
</script>

<style lang="scss" scoped>
.search-bar {
  display: flex;
  align-items: center;
  width: 702px;
  height: 72px;
  margin: 0 auto;
  padding: 0 24px;
  background-color: #ffffff;
  border-radius: 999px;
  box-sizing: border-box;

  &__icon {
    flex-shrink: 0;
    margin-right: 16px;
    font-size: 28px;
    line-height: 1;
    color: #a4a7ae;
  }

  &__input {
    flex: 1;
    height: 100%;
    font-size: 28px;
    line-height: 1;
    color: #303236;
    background: transparent;
    border: none;
    outline: none;
  }

  /* placeholder 节点由 input 内部渲染，不受 scoped 属性约束，需用 :deep 命中 */
  :deep(.search-bar__placeholder) {
    font-size: 28px;
    font-weight: 400;
    line-height: 1;
    color: #9aa3a0;
  }
}
</style>
