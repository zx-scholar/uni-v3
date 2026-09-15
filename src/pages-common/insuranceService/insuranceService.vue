<template>
  <view class="page-container page-has-bg ">
    <NavBar title="保险服务" color="#fff" />

    <scroll-view class="page-scroll-content" scroll-y>
      <view class="scroll-wrapper">
        <view class="intro-card">
          <text class="intro-title">为您提供专业保障</text>
          <text class="intro-desc">运动场馆人身意外保障、赛事责任险等多种方案任您选择</text>
        </view>
      </view>
    </scroll-view>

    <view class="page-bottom-bar" @click="handleContact">
      <image class="banner-image" :src="bannerImage" mode="widthFix" />
    </view>

    <InsurancePrompt :visible="promptVisible" @confirm="handleConfirm" @cancel="handleCancel" @update:visible="promptVisible = $event" />
  </view>
</template>

<script>
// OSS 生产域前缀
const OSS_PREFIX = 'https://xports-prd.oss-cn-hangzhou.aliyuncs.com/prd/';
const BANNER_IMAGE = `${OSS_PREFIX}gameImage95c75c9a22094b3ca23976705b65644d.png`;

import InsurancePrompt from '@/components/InsurancePrompt/InsurancePrompt.vue';

export default {
  name: 'InsuranceServicePage',
  components: { InsurancePrompt },

  data() {
    return {
      promptVisible: true,
      bannerImage: BANNER_IMAGE,
    };
  },

  onLoad() {},

  methods: {
    handleContact() {
      this.promptVisible = true;
    },
    handleConfirm() {
      console.log('用户点击立即购买');
    },
    handleCancel() {
      console.log('用户跳过');
    },
  },
};
</script>

<style lang="scss" scoped src="./insuranceService.scss"></style>
