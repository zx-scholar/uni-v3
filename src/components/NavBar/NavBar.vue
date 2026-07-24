<template>
    <view class="nav-bar-wrapper" :style="wrapperCssVars">
        <!-- 1. 占位 View：防止下面的页面内容被 fixed 导航栏遮挡 -->
        <view v-if="placeholder" class="nav-bar-placeholder" :style="{ height: navBarTotalHeight + 'px' }"></view>

        <!-- 2. 真正的固定定位导航栏 Container -->
        <view class="nav-bar-fixed" :style="navBarStyle">
            <!-- 微信小程序状态栏安全区填充 -->
            <view :style="{ height: statusBarHeight + 'px' }"></view>

            <!-- 导航栏主体内容区 -->
            <view class="nav-bar-content" :style="{ height: navBarHeight + 'px' }">
                <!-- 左侧：返回按钮或自定义左侧插槽 -->
                <view class="nav-left" @click="handleBack">
                    <slot name="left">
                        <view v-if="shouldShowBack" class="back-btn">
                            <text class="iconfont icon-zuo" :style="{ color: color, fontSize: '36rpx' }"></text>
                            <text v-if="backText" class="back-text" :style="{ color: color }">{{ backText }}</text>
                        </view>
                    </slot>
                </view>

                <!-- 中间：标题或自定义中间插槽 -->
                <view class="nav-center">
                    <slot>
                        <text class="nav-title" :style="{ color: color, fontSize: fontSize, fontWeight: fontWeight }">
                            {{ title }}
                        </text>
                    </slot>
                </view>

                <!-- 右侧：右侧插槽或右侧占位（小程序环境为微信胶囊预留避让空间） -->
                <view class="nav-right" :style="{ width: rightWidth + 'px' }">
                    <slot name="right"></slot>
                </view>
            </view>
        </view>
    </view>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

// 定义组件 Props 配置
const props = defineProps({
    // 标题文字
    title: {
        type: String,
        default: "",
    },
    // 标题颜色
    color: {
        type: String,
        default: "#ffffff",
    },
    // 标题字号
    fontSize: {
        type: String,
        default: "34rpx",
    },
    // 标题字重
    fontWeight: {
        type: String,
        default: "600",
    },
    // 背景样式 (支持 CSS 颜色、渐变色或 url('https://...'))
    background: {
        type: String,
        default: "transparent",
    },
    // 导航栏主体高度（px，不含状态栏）。默认 0 表示自动计算（微信小程序自动适配胶囊，非小程序默认 44px）
    height: {
        type: [Number, String],
        default: 0,
    },
    // 是否显示返回按钮（默认 'auto'：自动判断页面栈 > 1 时显示）
    showBack: {
        type: [Boolean, String],
        default: "auto",
    },
    // 返回按钮旁的提示文字（默认不显示或填 '返回'）
    backText: {
        type: String,
        default: "",
    },
    // 是否生成占位 View 占用页面高度
    placeholder: {
        type: Boolean,
        default: true,
    },
});

// 触发自定义返回事件
const emit = defineEmits(["back"]);

// 获取系统状态栏高度 & 胶囊位置（同步计算，避免首屏闪烁抖动）
const calcSystemNavBarInfo = () => {
    let statusBar = 20;
    let contentHeight = 44;
    // H5/非微信小程序端：固定右侧预留宽度，供右侧插槽避让;
    // 微信小程序端：下方 #ifdef 内会被胶囊右侧边距覆盖
    let rightEdge = 40;

    try {
        // 优先使用 API uni.getWindowInfo，兼容旧版 uni.getSystemInfoSync
        const sysInfo = (typeof uni.getWindowInfo === "function" ? uni.getWindowInfo() : null) || (typeof uni.getSystemInfoSync === "function" ? uni.getSystemInfoSync() : null) || {};
        if (typeof sysInfo.statusBarHeight === "number" && sysInfo.statusBarHeight >= 0) {
            statusBar = sysInfo.statusBarHeight;
        }

        // #ifdef MP-WEIXIN
        // 微信小程序环境下，精准计算微信官方右侧"胶囊按钮"的位置
        // 此分支仅在微信小程序编译，API 一定存在
        const menuButton = uni.getMenuButtonBoundingClientRect();
        if (menuButton && menuButton.top && menuButton.height) {
            // 胶囊顶部距状态栏的间隔
            const gap = Math.max(0, menuButton.top - statusBar);
            // 导航栏内容高度 = 胶囊高度 + 上下间隔 * 2
            contentHeight = menuButton.height + gap * 2;
            if (sysInfo.screenWidth && menuButton.left) {
                rightEdge = Math.max(40, sysInfo.screenWidth - menuButton.left);
            }
        }
        // #endif
    } catch (e) {
        // 异常静默兜底
    }

    return { statusBar, contentHeight, rightEdge };
};

// 同步初始化状态，首屏即可得到精准尺寸
const initialMetrics = calcSystemNavBarInfo();
const statusBarHeight = ref(initialMetrics.statusBar);
const autoContentHeight = ref(initialMetrics.contentHeight);
const rightWidth = ref(initialMetrics.rightEdge);

// 计算实际导航栏主体高度（优先使用用户自定义 props.height）
const navBarHeight = computed(() => {
    const customH = Number(props.height);
    return customH > 0 ? customH : autoContentHeight.value;
});

// 计算导航栏总高度 (状态栏 + 主体内容高度)
const navBarTotalHeight = computed(() => {
    return statusBarHeight.value + navBarHeight.value;
});

// 导出 CSS 自定义变量，方便子元素/插槽通过 CSS 调取
const wrapperCssVars = computed(() => ({
    "--status-bar-height": `${statusBarHeight.value}px`,
    "--nav-bar-height": `${navBarHeight.value}px`,
    "--nav-bar-total-height": `${navBarTotalHeight.value}px`,
}));

// 动态合成导航栏容器 Style
const navBarStyle = computed(() => {
    if (!props.background || props.background === "transparent") {
        return {
            background: "transparent",
            boxShadow: "none",
        };
    }
    const isUrl = props.background.includes("http") || props.background.includes("url(");
    if (isUrl && !props.background.startsWith("url(")) {
        return {
            backgroundImage: `url(${props.background})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
        };
    }
    return {
        background: props.background,
    };
});

// 自动判断是否应该显示返回按钮
const shouldShowBack = computed(() => {
    if (props.showBack === true || props.showBack === "true") return true;
    if (props.showBack === false || props.showBack === "false") return false;

    // 'auto' 模式：检测当前小程序/H5 页面栈深度
    const pages = getCurrentPages();
    return pages && pages.length > 1;
});

// 点击返回处理
const handleBack = () => {
    emit("back");
    if (shouldShowBack.value) {
        uni.navigateBack({
            fail: () => {
                uni.redirectTo({ url: "/pages/index/index" });
            },
        });
    }
};

// 挂载后二次校准（防止极其特殊的极早期未就绪状态）
// 加 diff 判断，值未变化时跳过赋值，避免触发不必要的响应式更新
onMounted(() => {
    const metrics = calcSystemNavBarInfo();
    if (metrics.statusBar !== statusBarHeight.value) statusBarHeight.value = metrics.statusBar;
    if (metrics.contentHeight !== autoContentHeight.value) autoContentHeight.value = metrics.contentHeight;
    if (metrics.rightEdge !== rightWidth.value) rightWidth.value = metrics.rightEdge;
});

// 暴露组件内部高度属性给父组件（通过 ref 调取）
defineExpose({
    statusBarHeight,
    navBarHeight,
    navBarTotalHeight,
    rightWidth,
});
</script>

<style scoped>
.nav-bar-wrapper {
    width: 100%;
}

.nav-bar-fixed {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 9999;
    width: 100%;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
}

.nav-bar-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24rpx;
    box-sizing: border-box;
}

.nav-left {
    display: flex;
    align-items: center;
    min-width: 80rpx;
    height: 100%;
}

.back-btn {
    display: flex;
    align-items: center;
    height: 100%;
    cursor: pointer;
}

.back-arrow {
    font-size: 48rpx;
    line-height: 1;
    font-weight: 300;
    margin-right: 4rpx;
}

.back-text {
    font-size: 28rpx;
}

.nav-center {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    overflow: hidden;
    padding: 0 12rpx;
}

.nav-title {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.nav-right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 100%;
}
</style>
