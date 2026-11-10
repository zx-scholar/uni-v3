<template>
  <view class="page-container page-has-bg">
    <NavBar title="文件上传" color="#222222" />

    <scroll-view class="page-scroll-content scrollbar-hide" scroll-y>
      <view class="scroll-wrapper px-24">

        <!-- 文件记录入口 -->
        <view class="record-entry" @click="goFileRecord">
          <view class="record-entry__left">
            <text class="iconfont icon-hetong record-entry__icon"></text>
            <text class="record-entry__text">文件记录</text>
          </view>
          <view class="record-entry__right">
            <text class="record-entry__count">{{ recordCount }} 个</text>
            <text class="iconfont icon-you1 record-entry__arrow"></text>
          </view>
        </view>

        <!-- ====== 选择文件 ====== -->
        <view class="card">
          <view class="card-header">选择文件</view>

          <!-- 文件列表 -->
          <view v-for="(item, index) in fileList" :key="index" class="file-item">
            <text class="iconfont icon-hetong file-item__icon"></text>
            <view class="flex-1 flex-column overflow-hidden">
              <text class="fz-26 c-t-primary text-1line">{{ item.name }}</text>
              <text class="fz-22 c-t-sub mt-4">{{ formatSize(item.size) }}</text>
            </view>
            <text class="file-item__status" :class="item.status">{{ statusText(item.status) }}</text>
            <text class="iconfont icon-cuowu2 file-item__remove" @click="removeFile(index)"></text>
          </view>

          <!-- 添加文件 -->
          <view v-if="fileList.length < maxCount" class="upload-add" @click="chooseFile">
            <text class="iconfont icon-jia upload-add__icon"></text>
            <text class="fz-22 c-t-sub mt-8">{{ fileList.length }}/{{ maxCount }}</text>
          </view>

          <!-- #ifdef MP-WEIXIN -->
          <text class="fz-22 c-t-sub mt-8">提示：小程序端将从聊天记录中选取文件</text>
          <!-- #endif -->
        </view>

        <!-- ====== 上传结果 ====== -->
        <view v-if="results.length > 0" class="card">
          <view class="card-header">
            <text>上传结果</text>
            <text class="copy-all-btn" @click="copyAll">一键复制全部</text>
          </view>

          <view v-for="(item, index) in results" :key="index" class="result-item">
            <view class="flex-1 flex-column overflow-hidden">
              <text class="fz-24 c-t-primary text-1line">{{ item.name }}</text>
              <view class="result-code mt-8" @click="copyUrl(item)">
                <text class="code-text">{{ item.url }}</text>
                <text class="copy-btn">复制</text>
              </view>
              <text class="fz-22 c-t-sub mt-4">已复制 {{ item.copyCount }} 次</text>
            </view>
          </view>
        </view>

      </view>
    </scroll-view>

    <!-- 底部按钮 -->
    <view class="page-bottom-bar">
      <button class="btn-primary" :loading="uploading" :disabled="uploading || fileList.length === 0" @click="handleUpload">
        {{ uploading ? '上传中...' : '开始上传' }}
      </button>
    </view>
  </view>
</template>

<script>
import { uploadFile } from '@/api';
import { addFileRecord, getFileRecords } from '@/utils/fileRecords';

// 单次最多待传文件数
const MAX_COUNT = 9;

export default {
  name: 'UploadFilePage',

  data() {
    return {
      maxCount: MAX_COUNT,
      fileList: [],
      results: [],
      uploading: false,
      // 已保存的文件记录条数（仅用于入口处展示）
      recordCount: 0,
    };
  },

  // 从文件记录页返回时刷新条数
  onShow() {
    this.recordCount = getFileRecords().length;
  },

  methods: {
    /** 跳转文件记录页 */
    goFileRecord() {
      router.push('fileRecord');
    },

    chooseFile() {
      const count = this.maxCount - this.fileList.length;
      if (count <= 0) return;

      // #ifdef MP-WEIXIN
      // 小程序端无系统文件选择器，从聊天记录中选取文件
      uni.chooseMessageFile({
        count,
        type: 'file',
        success: (res) => this.addFiles(res.tempFiles),
      });
      // #endif

      // #ifndef MP-WEIXIN
      uni.chooseFile({
        count,
        success: (res) => this.addFiles(res.tempFiles),
      });
      // #endif
    },

    /** 把选中的文件加入待传列表 */
    addFiles(tempFiles) {
      const newFiles = (tempFiles || []).map((file) => ({
        path: file.path,
        name: file.name || file.path.split('/').pop() || `file_${Date.now()}`,
        size: file.size || 0,
        url: '',
        status: 'pending',
      }));
      this.fileList.push(...newFiles);
    },

    removeFile(index) {
      this.fileList.splice(index, 1);
    },

    statusText(status) {
      const map = { pending: '待上传', uploading: '上传中', success: '成功', fail: '失败' };
      return map[status] || '';
    },

    /** 取文件扩展名（小写，无扩展名返回空串） */
    getFileExt(name = '') {
      const idx = name.lastIndexOf('.');
      return idx > 0 ? name.slice(idx + 1).toLowerCase() : '';
    },

    /** 文件大小格式化 */
    formatSize(size) {
      if (!size) return '0B';
      if (size < 1024) return `${size}B`;
      if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)}KB`;
      return `${(size / 1024 / 1024).toFixed(2)}MB`;
    },

    /** 复制单个文件地址 */
    copyUrl(item) {
      uni.setClipboardData({
        data: item.url,
        success: () => {
          item.copyCount++;
          uni.showToast({ title: '已复制', icon: 'success' });
        },
        fail: () => {
          uni.showToast({ title: '复制失败', icon: 'none' });
        },
      });
    },

    /** 一键复制全部地址 */
    copyAll() {
      const text = this.results.map((r) => r.url).join('\n');
      uni.setClipboardData({
        data: text,
        success: () => {
          uni.showToast({ title: '已复制全部', icon: 'success' });
        },
        fail: () => {
          uni.showToast({ title: '复制失败', icon: 'none' });
        },
      });
    },

    async handleUpload() {
      if (this.fileList.length === 0) return;
      this.uploading = true;

      for (let i = 0; i < this.fileList.length; i++) {
        const item = this.fileList[i];
        if (item.status === 'success') continue;

        item.status = 'uploading';
        try {
          const res = await uploadFile(item.path);

          if (res.url) {
            item.url = res.url;
            item.status = 'success';

            this.results.push({
              name: item.name,
              url: item.url,
              copyCount: 0,
            });

            // 记录到本地，文件记录页可查看 / 点击复制地址
            this.recordCount = addFileRecord({
              url: item.url,
              name: item.name,
              type: this.getFileExt(item.name),
            }).length;
          } else {
            item.status = 'fail';
          }
        } catch (e) {
          item.status = 'fail';
        }
      }

      this.uploading = false;

      const successCount = this.fileList.filter((item) => item.status === 'success').length;
      if (successCount > 0) {
        uni.showToast({ title: `上传完成，共 ${successCount} 个文件`, icon: 'success' });
      }
    },
  },
};
</script>

<style lang="scss" scoped src="./index.scss"></style>
