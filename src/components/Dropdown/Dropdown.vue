<template>
  <view class="dropdown" :style="wrapperStyle" @click="toggle">
    <!-- 触发区域 -->
    <view class="dropdown-trigger" :class="{ 'is-open': visible }">
      <text class="dropdown-text" :class="{ placeholder: !selectedLabel }">
        {{ selectedLabel || placeholder }}
      </text>
      <text class="dropdown-arrow iconfont icon-xiala"></text>
    </view>

    <!-- 下拉列表 -->
    <view v-if="visible" class="dropdown-menu">
      <view
        v-for="(opt, idx) in options"
        :key="idx"
        class="dropdown-item"
        :class="{ active: opt === modelValue }"
        @click.stop="select(opt)"
      >
        {{ opt }}
      </view>
    </view>

    <!-- 点击外部遮罩 -->
    <view v-if="visible" class="dropdown-overlay" @click.stop="close"></view>
  </view>
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
  height: 72px;
  padding: 0 24px;
  background: #f5f6fa;
  border-radius: 10px;
  box-sizing: border-box;
  transition: border-color 0.2s;
}

.dropdown-trigger.is-open {
  border-color: #42b883;
}

.dropdown-text {
  flex: 1;
  font-size: 30px;
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
  margin-left: 12px;
  font-size: 24px;
  color: #999;
  transition: transform 0.2s;
}

.dropdown-trigger.is-open .dropdown-arrow {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  max-height: 400px;
  overflow-y: auto;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  z-index: 1001;
}

.dropdown-item {
  padding: 20px 24px;
  font-size: 28px;
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
