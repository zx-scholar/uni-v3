<template>
  <div class="insurance-banner" :style="bannerStyle" @tap="goBuyInsurance"></div>
</template>

<script>
// 默认广告图片（写死测试，后续由后端配置）
const DEFAULT_IMAGE = 'http://xports-test.oss-cn-hangzhou.aliyuncs.com/dev/center/10000000/temp/cfe03f7a9b624eb4923894ae3239a157.png';

// 运享通小程序跳转参数（与 InsurancePrompt 组件保持一致；后续按产品接入动态生成）
const INSURANCE_MINIPROGRAM = {
  appId: 'wx1c1fae8db7245a07',
  path: 'pages/order/index?cryptographic=U1BQMDAwMDAwMDQ1OV85XzEyNzAwNDc2NzAwMzUxNjEwODhfMw==',
  extraData: {
    insuranceProductCode: 'PP00003242',
  },
  envVersion: 'release',
};

export default {
  name: 'InsuranceBanner',
  props: {
    image: { type: String, default: DEFAULT_IMAGE },
    width: { type: [Number, String], default: 702 },
    height: { type: [Number, String], default: 180 },
  },
  computed: {
    widthCss() {
      return typeof this.width === 'number' ? `${this.width}rpx` : this.width;
    },
    heightCss() {
      return typeof this.height === 'number' ? `${this.height}rpx` : this.height;
    },
    bannerStyle() {
      return `width: ${this.widthCss}; height: ${this.heightCss}; background-image: url(${this.image}); background-size: ${this.widthCss} ${this.heightCss}; background-repeat: no-repeat; background-position: center;`;
    },
  },
  methods: {
    // 跳转运享通小程序（与 InsurancePrompt 组件的 handleConfirm 保持一致）
    goBuyInsurance() {
      wx.navigateToMiniProgram({
        ...INSURANCE_MINIPROGRAM,
        success(res) {
          console.log('跳转运享通成功', res);
        },
        fail(err) {
          console.log('跳转运享通失败', err);
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.insurance-banner {
  display: block;
  margin: 0 auto;
}
</style>
