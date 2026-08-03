<template>
    <view class="nav-bar-wrapper">
        <!-- 占位 view：防止 fixed 导航栏遮挡页面内容 -->
        <view v-if="placeholder" class="nav-bar-placeholder" :style="{ height: navBarTotalHeight + 'px' }"></view>

        <!-- 固定定位导航栏 -->
        <view class="nav-bar-fixed" :style="navBarStyle">
            <!-- 状态栏安全区 -->
            <view :style="{ height: statusBarHeight + 'px' }"></view>

            <!-- 导航栏主体 -->
            <view class="nav-bar-content" :style="{ height: navBarHeight + 'px' }">
                <!-- 左侧：返回按钮 -->
                <view v-if="shouldShowBack" class="nav-left" @click="handleBack">
                    <text class="iconfont icon-zuo" :style="{ color, fontSize: '36rpx' }"></text>
                    <text v-if="backText" class="back-text" :style="{ color }">{{ backText }}</text>
                </view>

                <!-- 中间：标题 -->
                <view class="nav-center">
                    <text class="nav-title" :style="{ color, fontSize, fontWeight }">{{ title }}</text>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import router from '@/utils/router';

export default {
    name: "NavBar",
    emits: ["back"],
    props: {
        title: { type: String, default: "" },
        color: { type: String, default: "#333333" },
        fontSize: { type: String, default: "34rpx" },
        fontWeight: { type: String, default: "500" },
        background: { type: String, default: "transparent" },
        height: { type: [Number, String], default: 0 },
        showBack: { type: Boolean, default: true },
        backText: { type: String, default: "" },
        placeholder: { type: Boolean, default: true },
    },

    data() {
        return {
            statusBarHeight: 20,
            autoContentHeight: 44,
        };
    },

    computed: {
        navBarHeight() {
            const customH = Number(this.height);
            return customH > 0 ? customH : this.autoContentHeight;
        },
        navBarTotalHeight() {
            return this.statusBarHeight + this.navBarHeight;
        },
        navBarStyle() {
            if (!this.background || this.background === "transparent") {
                return { background: "transparent", boxShadow: "none" };
            }
            if (this.background.includes("http") && !this.background.startsWith("url(")) {
                return {
                    backgroundImage: `url(${this.background})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                };
            }
            return { background: this.background };
        },
        shouldShowBack() {
            return this.showBack;
        },
    },

    methods: {
        calcSystemNavBarInfo() {
            let statusBar = 20;
            let contentHeight = 44;

            try {
                const sysInfo = uni.getSystemInfoSync();
                if (sysInfo && typeof sysInfo.statusBarHeight === "number" && sysInfo.statusBarHeight >= 0) {
                    statusBar = sysInfo.statusBarHeight;
                }

                // #ifdef MP-WEIXIN
                const menuButton = uni.getMenuButtonBoundingClientRect();
                if (menuButton && menuButton.top && menuButton.height) {
                    const gap = Math.max(0, menuButton.top - statusBar);
                    contentHeight = menuButton.height + gap * 2;
                }
                // #endif
            } catch (e) {
                // 静默兜底
            }

            return { statusBar, contentHeight };
        },

        handleBack() {
            this.$emit("back");
            router.back();
        },
    },

    mounted() {
        const { statusBar, contentHeight } = this.calcSystemNavBarInfo();
        this.statusBarHeight = statusBar;
        this.autoContentHeight = contentHeight;
    },
};
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
}

.nav-bar-content {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 24rpx;
    box-sizing: border-box;
}

.nav-left {
    position: absolute;
    left: 24rpx;
    display: flex;
    align-items: center;
    height: 100%;
    cursor: pointer;
}

.back-text {
    font-size: 28rpx;
}

.nav-center {
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    padding: 0 80rpx;
}

.nav-title {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>
