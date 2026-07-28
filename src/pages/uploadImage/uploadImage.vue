<template>
  <view class="page-container">
    <NavBar title="图片上传" color="#ffffff" background="linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)" />

    <scroll-view class="page-scroll-content" scroll-y>
      <!-- 上传区域 -->
      <view class="card">
        <view class="card-header">选择图片</view>
        <view class="upload-grid">
          <!-- 已选中的图片缩略图 -->
          <view
            v-for="(item, index) in imageList"
            :key="index"
            class="upload-item"
            @click="previewImage(index)"
          >
            <image class="upload-thumb" :src="item.url || item.path" mode="aspectFill" />
            <view class="upload-status" :class="item.status">
              <text v-if="item.status === 'uploading'" class="status-text">上传中...</text>
              <text v-else-if="item.status === 'success'" class="status-text iconfont icon-check"></text>
              <text v-else-if="item.status === 'fail'" class="status-text">失败</text>
            </view>
            <view class="upload-remove" @click.stop="removeImage(index)">
              <text class="iconfont icon-guanbi" style="color: #fff; font-size: 24rpx;"></text>
            </view>
          </view>

          <!-- 添加按钮 -->
          <view v-if="imageList.length < maxCount" class="upload-item upload-add" @click="chooseImage">
            <text class="iconfont icon-jia" style="font-size: 48rpx; color: #c0c4cc;"></text>
            <text class="add-text">{{ imageList.length }}/{{ maxCount }}</text>
          </view>
        </view>
        <view class="card-tip">支持 jpg、png、gif 格式，单张不超过 10MB</view>
      </view>

      <!-- 已上传图片列表 -->
      <view v-if="uploadedList.length > 0" class="card">
        <view class="card-header">已上传</view>
        <view v-for="(item, index) in uploadedList" :key="index" class="uploaded-item">
          <image class="uploaded-thumb" :src="item.url" mode="aspectFill" />
          <text class="uploaded-name">{{ item.name }}</text>
          <text class="uploaded-url">{{ item.url }}</text>
        </view>
      </view>
    </scroll-view>

    <!-- 底部按钮 -->
    <view class="page-bottom-bar">
      <button class="btn-primary" :loading="uploading" :disabled="uploading || imageList.length === 0" @click="handleUpload">
        {{ uploading ? '上传中...' : '开始上传' }}
      </button>
    </view>
  </view>
</template>

<script>
import { uploadFile } from '@/api'

export default {
  name: 'UploadImage',

  data() {
    return {
      imageList: [],
      uploadedList: [],
      uploading: false,
      maxCount: 9
    }
  },

  methods: {
    chooseImage() {
      const count = this.maxCount - this.imageList.length
      uni.chooseImage({
        count,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          const newImages = res.tempFilePaths.map((path) => ({
            path,
            url: '',
            status: 'pending',
            name: path.split('/').pop() || `image_${Date.now()}`
          }))
          this.imageList = this.imageList.concat(newImages)
        }
      })
    },

    removeImage(index) {
      this.imageList.splice(index, 1)
    },

    previewImage(index) {
      const urls = this.imageList.map((item) => item.url || item.path)
      uni.previewImage({
        current: urls[index],
        urls
      })
    },

    async handleUpload() {
      if (this.imageList.length === 0) return
      this.uploading = true

      for (let i = 0; i < this.imageList.length; i++) {
        const item = this.imageList[i]
        if (item.status === 'success') continue

        item.status = 'uploading'
        try {
          const res = await uploadFile(item.path)
          item.url = res.url || res.data?.url || ''
          item.status = 'success'
          this.uploadedList.push({
            url: item.url,
            name: item.name
          })
        } catch (e) {
          item.status = 'fail'
          uni.showToast({ title: `第 ${i + 1} 张上传失败`, icon: 'none' })
        }
      }

      this.uploading = false
      const successCount = this.imageList.filter((item) => item.status === 'success').length
      if (successCount > 0) {
        uni.showToast({ title: `上传完成，共 ${successCount} 张`, icon: 'success' })
      }
    }
  }
}
</script>

<style lang="scss" scoped src="./uploadImage.scss"></style>
