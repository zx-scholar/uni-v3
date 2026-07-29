<template>
  <view class="page-container">
    <NavBar title="图片上传" color="#222222" />

    <scroll-view class="page-scroll-content" scroll-y>
      <!-- 上传设置 -->
      <view class="card">
        <view class="card-header">上传设置</view>

        <!-- 图片类型选择 -->
        <view class="form-row">
          <text class="form-label">图片类型</text>
          <Dropdown v-model="selectedType" :options="typeOptions" width="420rpx" />
        </view>

        <!-- 自定义变量名 -->
        <view v-if="selectedType === '自定义'" class="form-row">
          <text class="form-label">变量名</text>
          <input class="form-input" v-model="customVar" placeholder="例如：my-banner" />
        </view>

        <!-- 当前变量名预览 -->
        <view class="var-preview">
          <text class="var-label">变量：</text>
          <text class="var-name">{{ variableName }}</text>
        </view>

        <!-- 上传区域 -->
        <view class="upload-grid">
          <view
            v-for="(item, index) in imageList"
            :key="index"
            class="upload-item"
            @click="previewImage(index)"
          >
            <image class="upload-thumb" :src="item.path" mode="aspectFill" />
            <view v-if="item.status === 'success'" class="upload-status success">
              <text class="iconfont icon-check" style="font-size: 40rpx; color: #fff;"></text>
            </view>
            <view v-else-if="item.status === 'uploading'" class="upload-status uploading">
              <text class="status-text">上传中</text>
            </view>
            <view v-else-if="item.status === 'fail'" class="upload-status fail">
              <text class="status-text">失败</text>
            </view>
            <view class="upload-remove" @click.stop="removeImage(index)">
              <text class="iconfont icon-guanbi" style="color: #fff; font-size: 20rpx;"></text>
            </view>
          </view>

          <view v-if="imageList.length < 9" class="upload-item upload-add" @click="chooseImage">
            <text class="iconfont icon-jia" style="font-size: 48rpx; color: #c0c4cc;"></text>
            <text class="add-text">{{ imageList.length }}/9</text>
          </view>
        </view>
      </view>

      <!-- 上传结果 -->
      <view v-if="results.length > 0" class="card">
        <view class="card-header">
          <text>上传结果</text>
          <text class="copy-all-btn" @click="copyAll">一键复制全部</text>
        </view>

        <view v-for="(item, index) in results" :key="index" class="result-item">
          <view class="result-thumb-wrap">
            <image class="result-thumb" :src="item.url" mode="aspectFill" />
          </view>
          <view class="result-body">
            <view class="result-code" @click="copyCode(item.code)">
              <text class="code-text">{{ item.code }}</text>
              <text class="copy-btn">复制</text>
            </view>
            <view class="result-meta">已复制 {{ item.copyCount }} 次</view>
          </view>
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
import Dropdown from '@/components/Dropdown/Dropdown.vue'

// OSS 基础地址前缀（从上传 URL 中剥离，替换为 #{$img-base}）
const OSS_PREFIX = 'http://xports-test.oss-cn-hangzhou.aliyuncs.com/dev/'

// 图片类型选项
const TYPE_OPTIONS = [
  'img-page-bg',
  'img-card-bg',
  'img-logo',
  'img-empty',
  'img-browsing-bg',
  'img-event-bg',
  '自定义'
]

export default {
  name: 'UploadImage',
  components: { Dropdown },

  data() {
    return {
      selectedType: TYPE_OPTIONS[0],
      customVar: '',
      imageList: [],
      results: [],
      uploading: false
    }
  },

  computed: {
    typeOptions() {
      return TYPE_OPTIONS
    },

    /** 当前变量名（不含数字后缀） */
    variableName() {
      if (this.selectedType === '自定义') {
        return this.customVar.trim() || 'custom'
      }
      return this.selectedType
    }
  },

  methods: {
    chooseImage() {
      const count = 9 - this.imageList.length
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
          this.imageList.push(...newImages)
        }
      })
    },

    removeImage(index) {
      this.imageList.splice(index, 1)
    },

    previewImage(index) {
      const urls = this.imageList.map((item) => item.path)
      uni.previewImage({ current: urls[index], urls })
    },

    /** 生成 SCSS 变量代码，用 #{$img-base} 替代 OSS 域名前缀 */
    generateCode(url, index) {
      const prefix = this.variableName
      const varName = index === 0 ? prefix : `${prefix}-${index + 1}`
      const relativePath = url.startsWith(OSS_PREFIX) ? url.slice(OSS_PREFIX.length) : url
      const scssVar = '$img-base'
      return `$${varName}: '#{${scssVar}}${relativePath}';`
    },

    /** 复制到剪贴板 */
    copyCode(code) {
      uni.setClipboardData({
        data: code,
        success: () => {
          const item = this.results.find((r) => r.code === code)
          if (item) item.copyCount++
          uni.showToast({ title: '已复制', icon: 'success' })
        },
        fail: () => {
          uni.showToast({ title: '复制失败', icon: 'none' })
        }
      })
    },

    /** 一键复制全部 */
    copyAll() {
      const text = this.results.map((r) => r.code).join('\n')
      uni.setClipboardData({
        data: text,
        success: () => {
          uni.showToast({ title: '已复制全部', icon: 'success' })
        },
        fail: () => {
          uni.showToast({ title: '复制失败', icon: 'none' })
        }
      })
    },

    async handleUpload() {
      if (this.imageList.length === 0) return
      this.uploading = true

      // 记录该批次上传的类型，连续上传同一类型时 index 递增
      const currentVar = this.variableName
      const existingCount = this.results.filter((r) => r.type === currentVar).length
      let typeIndex = existingCount

      for (let i = 0; i < this.imageList.length; i++) {
        const item = this.imageList[i]
        if (item.status === 'success') continue

        item.status = 'uploading'
        try {
          const res = await uploadFile(item.path)
          item.url = res.url || ''
          item.status = 'success'

          // 生成 SCSS 代码
          const code = this.generateCode(item.url, typeIndex)

          this.results.push({
            type: currentVar,
            url: item.url,
            code,
            copyCount: 0
          })

          typeIndex++
        } catch (e) {
          item.status = 'fail'
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
