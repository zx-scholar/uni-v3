<template>
  <view class="page-container page-has-bg">
    <NavBar title="文件记录" color="#1c1f1e" />

    <scroll-view class="page-scroll-content scrollbar-hide" scroll-y>
      <view class="scroll-wrapper">

        <!-- 统计 + 清空 -->
        <view class="record-bar">
          <view class="record-bar__left">
            <text class="record-bar__count">共 {{ records.length }} 个</text>
            <text class="record-bar__tip">点击记录复制地址</text>
          </view>
          <text v-if="records.length" class="record-bar__clear" @click="handleClear">清空记录</text>
        </view>

        <!-- 空状态 -->
        <Empty v-if="!records.length" text="还没有上传记录" />

        <!-- 记录列表 -->
        <view v-else class="record-list">
          <view v-for="item in records" :key="item.url" class="record-card" @click="handleCopy(item)">
            <view class="record-card__icon-wrap">
              <text class="iconfont icon-hetong record-card__icon"></text>
            </view>

            <view class="record-card__body">
              <text class="record-card__name fz-26 c-t-primary text-1line">{{ item.name || item.url }}</text>
              <text class="record-card__url fz-22 c-t-secondary text-2line mt-4">{{ item.url }}</text>
              <view class="flex-between mt-8">
                <text v-if="item.type" class="record-card__type">{{ item.type }}</text>
                <text class="fz-22 c-t-sub">{{ formatTime(item.time) }}</text>
              </view>
            </view>

            <view class="record-card__remove" @click.stop="handleRemove(item)">
              <text class="iconfont icon-cuowu2 record-card__remove-icon"></text>
            </view>
          </view>
        </view>

      </view>
    </scroll-view>
  </view>
</template>

<script>
import Empty from '@/components/Empty/Empty.vue';
import { getFileRecords, removeFileRecord, clearFileRecords } from '@/utils/fileRecords';

export default {
  name: 'FileRecordPage',
  components: { Empty },

  data() {
    return {
      records: [],
    };
  },

  // 从上传页返回时能立刻看到新增记录
  onShow() {
    this.loadRecords();
  },

  methods: {
    loadRecords() {
      this.records = getFileRecords();
    },

    /** 时间戳 -> yyyy-MM-dd HH:mm */
    formatTime(time) {
      if (!time) return '';
      const date = new Date(time);
      const pad = (n) => String(n).padStart(2, '0');
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
    },

    /** 点击记录：复制完整地址 */
    handleCopy(item) {
      uni.setClipboardData({
        data: item.url,
        success: () => {
          uni.showToast({ title: '地址已复制', icon: 'success' });
        },
        fail: () => {
          uni.showToast({ title: '复制失败', icon: 'none' });
        },
      });
    },

    /** 删除单条 */
    handleRemove(item) {
      uni.showModal({
        title: '删除记录',
        content: '确定删除这个文件的记录吗？',
        confirmColor: '#167A4A',
        success: (res) => {
          if (!res.confirm) return;
          this.records = removeFileRecord(item.url);
          uni.showToast({ title: '已删除', icon: 'none' });
        },
      });
    },

    /** 清空全部 */
    handleClear() {
      uni.showModal({
        title: '清空记录',
        content: `确定清空全部 ${this.records.length} 条记录吗？该操作不可恢复。`,
        confirmColor: '#ef4444',
        success: (res) => {
          if (!res.confirm) return;
          this.records = clearFileRecords();
          uni.showToast({ title: '已清空', icon: 'none' });
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped src="./index.scss"></style>
