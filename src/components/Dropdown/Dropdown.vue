<template>
  <div class="dropdown" :style="wrapperStyle" @click="toggle">
    <!-- 触发区域 -->
    <div class="dropdown-trigger" :class="{ 'is-open': visible }">
      <span class="dropdown-text" :class="{ placeholder: !selectedLabel }">
        {{ selectedLabel || placeholder }}
      </span>
      <span class="dropdown-arrow iconfont icon-xiala"></span>
    </div>

    <!-- 下拉列表 -->
    <div v-if="visible" class="dropdown-menu">
      <div
        v-for="(opt, idx) in options"
        :key="idx"
        class="dropdown-item"
        :class="{ active: opt === modelValue }"
        @click.stop="select(opt)"
      >
        {{ opt }}
      </div>
    </div>

    <!-- 点击外部遮罩 -->
    <div v-if="visible" class="dropdown-overlay" @click.stop="close"></div>
  </div>
</template>

<script>
export default {
  name: 'Dropdown',
  props: {
    modelValue: { type: String, default: '' },
    options: { type: Array, default: () => [] },
    placeholder: { type: String, default: '请选择' },
    width: { type: String, default: '' }
  },
  emits: ['update:modelValue', 'change'],
  data() {
    return { visible: false }
  },
  computed: {
    selectedLabel() {
      return this.modelValue || ''
    },
    wrapperStyle() {
      return this.width ? { width: this.width } : {}
    }
  },
  methods: {
    toggle() {
      this.visible = !this.visible
    },
    select(opt) {
      this.visible = false
      this.$emit('update:modelValue', opt)
      this.$emit('change', opt)
    },
    close() {
      this.visible = false
    }
  }
}
</script>

<style scoped>
.dropdown {
  position: relative;
  display: inline-block;
  cursor: pointer;
  user-select: none;
}

.dropdown-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72rpx;
  padding: 0 24rpx;
  background: #f5f6fa;
  border-radius: 10rpx;
  box-sizing: border-box;
  transition: border-color 0.2s;
}

.dropdown-trigger.is-open {
  border-color: #42b883;
}

.dropdown-text {
  flex: 1;
  font-size: 30rpx;
  color: #1c1f1e;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dropdown-text.placeholder {
  color: #94a3b8;
}

.dropdown-arrow {
  flex-shrink: 0;
  margin-left: 12rpx;
  font-size: 24rpx;
  color: #999;
  transition: transform 0.2s;
}

.dropdown-trigger.is-open .dropdown-arrow {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 8rpx);
  left: 0;
  right: 0;
  max-height: 400rpx;
  overflow-y: auto;
  background: #ffffff;
  border-radius: 10rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.12);
  z-index: 1001;
}

.dropdown-item {
  padding: 20rpx 24rpx;
  font-size: 28rpx;
  color: #1c1f1e;
  transition: background 0.15s;
}

.dropdown-item:active {
  background: #f0f9f4;
}

.dropdown-item.active {
  color: #42b883;
  font-weight: 500;
}

.dropdown-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: transparent;
}
</style>
