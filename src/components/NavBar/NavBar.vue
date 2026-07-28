<template>
    <div class="nav-bar-wrapper" :style="wrapperCssVars">
        <!-- 占位 div：防止 fixed 导航栏遮挡页面内容 -->
        <div v-if="placeholder" class="nav-bar-placeholder" :style="{ height: navBarTotalHeight + 'px' }"></div>

        <!-- 固定定位导航栏 -->
        <div class="nav-bar-fixed" :style="navBarStyle">
            <!-- 状态栏安全区 -->
            <div :style="{ height: statusBarHeight + 'px' }"></div>

            <!-- 导航栏主体 -->
            <div class="nav-bar-content" :style="{ height: navBarHeight + 'px' }">
                <!-- 左侧：返回按钮 -->
                <div v-if="shouldShowBack" class="nav-left" @click="handleBack">
                    <span class="iconfont icon-zuo" :style="{ color, fontSize: '36rpx' }"></span>
                    <span v-if="backText" class="back-text" :style="{ color }">{{ backText }}</span>
                </div>

                <!-- 中间：标题 -->
                <div class="nav-center">
                    <span class="nav-title" :style="{ color, fontSize, fontWeight }">{{ title }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
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
        const { statusBar, contentHeight } = this.calcSystemNavBarInfo();
        return {
            statusBarHeight: statusBar,
            autoContentHeight: contentHeight,
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
        wrapperCssVars() {
            return {
                "--status-bar-height": `${this.statusBarHeight}px`,
                "--nav-bar-height": `${this.navBarHeight}px`,
                "--nav-bar-total-height": `${this.navBarTotalHeight}px`,
            };
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
                const sysInfo =
                    (typeof uni.getWindowInfo === "function" ? uni.getWindowInfo() : null) || (typeof uni.getSystemInfoSync === "function" ? uni.getSystemInfoSync() : null) || {};
                if (typeof sysInfo.statusBarHeight === "number" && sysInfo.statusBarHeight >= 0) {
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
            const pages = getCurrentPages();
            if (pages && pages.length > 1) {
                uni.navigateBack();
            } else {
                uni.switchTab({ url: "/pages/index/index" });
            }
        },
    },

    mounted() {
        const { statusBar, contentHeight } = this.calcSystemNavBarInfo();
        if (statusBar !== this.statusBarHeight) this.statusBarHeight = statusBar;
        if (contentHeight !== this.autoContentHeight) this.autoContentHeight = contentHeight;
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
