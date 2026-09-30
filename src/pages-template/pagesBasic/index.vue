<template>
  <!-- ============================================================
       【样板 - 工具类使用规范】  ⭐ 给 AI / 新成员参考的标准写法
       ============================================================
       ★ 三原则 ★
         1) 模板里优先用 utility class（fz-/c-/mt-/shadow-/text-1line...）
         2) <style> 只写 @use 变量 + 极少量自定义（按钮、标签等 utility 难表达的）
         3) 颜色永远用变量 ($color-*)，绝不写 #xxxxxx

       ★ utility class 速查 ★
         fz-{n}            字号       fz-22 ~ fz-60
         fw-{n}            字重       fw-4 / fw-5 / fw-6 / fw-7
         lh-{n}            行高       lh-1 / lh-1-6 / lh-2
         c-{name}          文字色     c-primary / c-danger / c-price
         c-t-{name}        文本色     c-t-primary / c-t-sub / c-t-white
         m*/p*{d}-{n}      间距       mt-16 / p-24 / px-12 / pb-40
         flex-* / items-*  flex布局   flex-between / items-center / flex-column
         gap-{n}           子项间距   gap-12 (含 4/6/8/10/12/16/20/24/30/32/40)
         bg-{name}         背景色     bg-card / bg-primary / bg-page / bg-gradient-btn
         radius-{n}        圆角       radius-8 / radius-16 / radius-full / radius-t-24
         shadow-{0|1|2|3}  阴影       shadow-1 轻 / shadow-2 中 / shadow-3 重
         text-{n}line      文本截断   text-1line / text-2line / text-3line
         center            居中容器   等价 flex + center + center
         tappable          去点击高亮（移动端）
         scrollbar-hide    隐藏滚动条
       ============================================================ -->

  <view class="page-container page-has-bg">
    <NavBar title="样板：工具类使用规范" color="#000" />

    <scroll-view class="page-scroll-content scrollbar-hide" scroll-y>
      <view class="scroll-wrapper px-24">

        <!-- ============== 区块 1: 用户信息卡 ============== -->
        <view class="bg-card p-24 mt-8 radius-16 shadow-2 flex items-center gap-16">
          <image src="/static/logo.png" mode="aspectFill" class="avatar" />
          <view class="flex-1">
            <text class="fz-30 fw-6 c-t-primary text-1line">用户名</text>
            <text class="fz-22 c-t-sub mt-4">手机号：138****0000</text>
          </view>
          <text class="fz-32 c-t-sub">›</text>
        </view>

        <!-- ============== 区块 2: 数据统计 3 列 ============== -->
        <view class="bg-card p-24 mt-16 radius-16 shadow-2">
          <text class="fz-26 fw-6 c-t-primary">我的数据</text>
          <view class="flex-between items-center mt-16">
            <view class="flex-1 flex-column items-center">
              <text class="fz-34 fw-7 c-primary">128</text>
              <text class="fz-22 c-t-sub mt-4">积分</text>
            </view>
            <view class="stat-divider"></view>
            <view class="flex-1 flex-column items-center">
              <text class="fz-34 fw-7 c-price">¥99</text>
              <text class="fz-22 c-t-sub mt-4">余额</text>
            </view>
            <view class="stat-divider"></view>
            <view class="flex-1 flex-column items-center">
              <text class="fz-34 fw-7 c-danger">3</text>
              <text class="fz-22 c-t-sub mt-4">优惠券</text>
            </view>
          </view>
        </view>

        <!-- ============== 区块 3: 列表行（带分割线 + 箭头） ============== -->
        <view class="bg-card mt-16 radius-16 shadow-2 overflow-hidden">
          <view class="flex-between items-center p-24 tappable" @click="onTap('wallet')">
            <view class="flex items-center gap-12">
              <text class="fz-32">💰</text>
              <text class="fz-28 c-t-primary">钱包</text>
            </view>
            <text class="fz-28 c-t-sub">›</text>
          </view>
          <view class="mx-24 list-divider"></view>
          <view class="flex-between items-center p-24 tappable" @click="onTap('orders')">
            <view class="flex items-center gap-12">
              <text class="fz-32">📋</text>
              <text class="fz-28 c-t-primary">订单</text>
            </view>
            <text class="fz-28 c-t-sub">›</text>
          </view>
          <view class="mx-24 list-divider"></view>
          <view class="flex-between items-center p-24 tappable" @click="onTap('coupon')">
            <view class="flex items-center gap-12">
              <text class="fz-32">🎟️</text>
              <text class="fz-28 c-t-primary">优惠券</text>
            </view>
            <text class="fz-28 c-t-sub">›</text>
          </view>
        </view>

        <!-- ============== 区块 4: 表单行 ============== -->
        <view class="bg-card mt-16 radius-16 shadow-2 overflow-hidden">
          <view class="form-row flex items-center px-24">
            <text class="fz-24 c-t-secondary w-80">姓名</text>
            <input
              v-model="form.name"
              class="flex-1 fz-26 c-t-primary"
              placeholder="请输入姓名"
              placeholder-class="fz-26 c-t-sub"
            />
          </view>
          <view class="mx-24 list-divider"></view>
          <view class="form-row flex items-center px-24">
            <text class="fz-24 c-t-secondary w-80">手机</text>
            <input
              v-model="form.mobile"
              class="flex-1 fz-26 c-t-primary"
              placeholder="请输入手机号"
              placeholder-class="fz-26 c-t-sub"
            />
          </view>
        </view>

        <!-- ============== 区块 5: 标签选择 ============== -->
        <view class="bg-card p-24 mt-16 radius-16 shadow-2">
          <text class="fz-26 fw-6 c-t-primary">选择标签</text>
          <view class="flex gap-12 flex-wrap mt-16">
            <text class="tag tag--active">默认选中</text>
            <text class="tag">备选项一</text>
            <text class="tag">备选项二</text>
            <text class="tag">备选项三</text>
          </view>
        </view>

        <!-- ============== 区块 6: 内容区操作按钮 ============== -->
        <view class="flex gap-12 mt-24 mb-24">
          <button class="btn-secondary flex-1 tappable" @click="onCancel">取消</button>
          <button class="btn-primary flex-1 tappable" @click="onSubmit">确认</button>
        </view>

      </view>
    </scroll-view>

    <!-- 底部固定按钮栏（页面骨架自带） -->
    <view class="page-bottom-bar">
      <button class="btn-primary" @click="onSubmit">底部确认按钮</button>
    </view>
  </view>
</template>

<script>
export default {
  name: 'PagesBasicDemo',

  data() {
    return {
      form: {
        name: '',
        mobile: '',
      },
    };
  },

  methods: {
    onTap(name) {
      uni.showToast({ title: `点击了：${name}`, icon: 'none' });
    },
    onCancel() {
      uni.showToast({ title: '已取消', icon: 'none' });
    },
    onSubmit() {
      uni.showToast({ title: '提交成功', icon: 'success' });
    },
  },

  /* ---- 生命周期（按需保留） ---- */
  onLoad(options) {},
};
</script>

<style lang="scss" scoped src="./index.scss"></style>