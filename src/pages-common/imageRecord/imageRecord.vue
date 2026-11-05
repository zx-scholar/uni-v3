<template>
  <view class="page-container page-has-bg">
    <NavBar title="图片记录" color="#1c1f1e" />

    <scroll-view class="page-scroll-content" scroll-y>
      <view class="scroll-wrapper">
        <!-- 统计 + 清空 -->
        <view class="record-bar">
          <view class="record-bar__left">
            <text class="record-bar__count">共 {{ records.length }} 张</text>
            <text class="record-bar__tip">点击图片复制地址，长按预览</text>
          </view>
          <text v-if="records.length" class="record-bar__clear" @click="handleClear">清空记录</text>
        </view>

        <!-- 空状态 -->
        <Empty v-if="!records.length" text="还没有上传记录" />

        <!-- 记录网格 -->
        <view v-else class="record-grid">
          <view v-for="(item, index) in records" :key="item.url" class="record-card">
            <view
              class="record-card__thumb"
              @click="handleCopy(item)"
              @longpress="handlePreview(item)"
            >
              <image class="record-card__img" :src="item.url" mode="aspectFill" />
              <view class="record-card__remove" @click.stop="handleRemove(item)">
                <text class="iconfont icon-cuowu2 record-card__remove-icon"></text>
              </view>
            </view>

            <view class="record-card__body">
              <text class="record-card__url">{{ item.url }}</text>
              <view class="record-card__meta">
                <text v-if="item.type" class="record-card__type">{{ item.type }}</text>
                <text class="record-card__time">{{ formatTime(item.time) }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import NavBar from '@/components/NavBar/NavBar.vue';
import Empty from '@/components/Empty/Empty.vue';
import { getImageRecords, removeImageRecord, clearImageRecords } from '@/utils/imageRecords';

export default {
  name: 'ImageRecordPage',
  components: { NavBar, Empty },

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
      this.records = getImageRecords();
    },

    /** 时间戳 -> yyyy-MM-dd HH:mm */
    formatTime(time) {
      if (!time) return '';
      const date = new Date(time);
      const pad = (n) => String(n).padStart(2, '0');
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
    },

    /** 点击图片：复制完整地址 */
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

    /** 长按图片：预览大图 */
    handlePreview(item) {
      const urls = this.records.map((record) => record.url);
      uni.previewImage({ current: item.url, urls });
    },

    /** 删除单条 */
    handleRemove(item) {
      uni.showModal({
        title: '删除记录',
        content: '确定删除这张图片的记录吗？',
        confirmColor: '#167A4A',
        success: (res) => {
          if (!res.confirm) return;
          this.records = removeImageRecord(item.url);
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
          this.records = clearImageRecords();
          uni.showToast({ title: '已清空', icon: 'none' });
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped src="./imageRecord.scss"></style>
