# uni-v3 多端小程序（xports 系列场馆/赛事应用）

基于 **uni-app (Vue 3 + Vite)** 的多端应用，一套代码编译到微信小程序 / H5 等多端，并支持**按客户环境裁剪功能子包**（同一仓库出多个客户的小程序）。

## 技术栈

| 类别 | 选型 |
|---|---|
| 框架 | uni-app 3.x（Vue 3 组合式 API）+ Vite 5 |
| 状态管理 | Pinia + pinia-plugin-persistedstate（适配 uni storage） |
| 样式 | Sass，`px → rpx` 编译期自动转换（750 设计稿 1:1） |
| 语言 | 页面/工具 JS 为主，配置层 TS |
| Node | Volta 管理的 Node 22（见 `package.json` 的 `volta` 字段），包管理器 pnpm |

## 快速开始

```bash
pnpm install          # 安装依赖
pnpm dev:h5           # H5 开发（默认 development 环境，走本地代理）
pnpm dev:mp-weixin    # 微信小程序开发（微信开发者工具导入 dist/dev/mp-weixin）
```

带环境启动（`--mode` 决定后端代理、appid 与子包白名单）：

```bash
pnpm dev:mp-weixin:qdgx       # 青岛国信
pnpm dev:mp-weixin:hangzhou   # 杭州奥体
pnpm dev:mp-weixin:sportsdev  # 菠菜测试
pnpm dev:mp-weixin:tangfang   # 塘坊体育公园
pnpm dev:mp-weixin:lanzhou    # 兰州奥体
```

构建：把 `dev:` 换成 `build:`（如 `pnpm build:mp-weixin:qdgx`）。全部命令见 `package.json`。

## 目录结构

```
├─ scripts/
│  ├─ gen-pages.mjs        # 核心：按环境组装 src/pages.json（详见下文）
│  └─ gen-routes.mjs       # 根据 pages.json 生成 src/utils/routes.ts 别名字典
├─ vite.config.js          # 路由生成插件挂载 + px→rpx PostCSS + 环境代理
└─ src/
   ├─ main.js              # 入口：全局组件注册、全局 router、Pinia 持久化
   ├─ pages.base.json      # ✍ 主包页面 + tabBar 手动维护（路由的唯一手写入口之一）
   ├─ pages-*/             # 分包目录（pages-common/event/golf/pay/point/template/
   │                       #   venue/venueball/venuecard/venuecourse/venueticket）
   │  └─ pages.config.mjs  # ✍ 该分包的页面清单（手动维护）
   ├─ pages-template/      # 新页面骨架模板（pagesBasic：index.vue + index.scss）
   ├─ pages/               # 主包页面（index/event/login/mine，.vue 与 .scss 成对）
   ├─ components/          # 通用组件（NavBar/BasePopup/MonthSelect 已全局注册）
   ├─ stores/              # Pinia（user.ts / app.ts，持久化到 uni storage）
   ├─ api/                 # 接口层（user/upload/miniApp/...）
   ├─ utils/
   │  ├─ router.js         # 跳转封装：别名跳转、参数序列化、tab 降级、防连点
   │  ├─ routes.ts         # ⚠️ 自动生成，禁改
   │  ├─ request.js        # 请求封装
   │  └─ routeCheck.js     # dev 期路由一致性校验（仅警告）
   ├─ config/
   │  ├─ environments.ts   # ✍ 环境字典（appid/密钥/代理/OSS，按 --mode 键）
   │  ├─ features.config.mjs # ✍ 子包白名单（default + 各环境）+ 分包预下载规则
   │  ├─ routes-alias.mjs  # ✍ 路由别名映射（可选）
   │  └─ appConfig.ts      # 运行时环境配置出口（冻结对象 env / wechatParam）
   ├─ styles/              # variables.scss($color-*) / utility.scss(原子类) / layout / iconfont
   └─ pages.json           # ⚠️ 自动生成，禁改
```

**✍ = 手动维护，⚠️ = 自动生成严禁手改**（`pages.json` 与 `routes.ts` 均已入库，内容无变化时生成器会跳过写入，不会产生 diff 噪音）。

## 多环境体系（重要）

一个 `--mode` 需要**两处注册**，缺一不可：

1. **`src/config/environments.ts`**：后端域名（`origin`）、API 路径前缀（`webRoot`，同时是 dev 代理的匹配路径）、微信 appid、apiKey/apiSecret、腾讯地图 key、OSS 地址等。运行时代码通过 `import { env } from '@/config/appConfig'` 读取（冻结对象）。多数环境相同的字段在 `DEFAULT_ENV_CONFIG` 收口，环境条目用 `defineEnv()` 只写差异项（身份字段 `title` / `name` / `appid` / `apiKey` / `apiSecret` 必填，漏写会直接报 TS 错误）。
2. **`src/config/features.config.mjs`**：该环境打入哪些子包（`environments[mode]` 数组），以及分包预下载规则 `preloadRule`。

> ⚠️ **mode 任一侧未注册都会直接失败**，绝不会静默回退到别的环境：
> - 未在 `features.config.mjs` 注册 → 构建期报错（防止环境名拼错静默打入全量子包），并列出所有可用环境；`development` / `production` 回退 `default` 白名单。
> - 未在 `environments.ts` 注册 → 构建期（`vite.config.js` 代理配置）与运行期（`appConfig.ts`）各报一次错，同样列出可用环境。
> - 已注册但缺必填字段（`origin` / `webRoot` / `appid` / `apiKey` / `apiSecret`）→ 启动时立即报错，不等到线上 404。

Vite dev 代理按 `webRoot → origin` 自动配置（见 `vite.config.js`）。

### 静态资源（OSS）统一规则

- **所有环境一律使用 prd 桶**：`env.ossPrefix` = `https://xports-prd.oss-cn-hangzhou.aliyuncs.com/prd/`（以 `/` 结尾，定义在 `src/config/environments.ts` 的 `OSS_PREFIX` 常量，7 个环境共用）。
- **JS / Vue 里取图**：`import { env } from '@/config/appConfig'` 后用 `` `${env.ossPrefix}gameImagexxx.png` ``，不要再硬编码 OSS 域名。
- **SCSS 里取图**：用 `$img-base`（`src/styles/variables.scss`，无尾斜杠，拼接时补 `/`），例如 `url('#{$img-base}/gameImagexxx.png')`。⚠️ `$img-base` 与 `env.ossPrefix` 是两套编译期/运行期常量，改一处必须同步另一处。
- **上传图片**：走后端 `/api/common/uploadFile`，客户端不直连 OSS。

> ⚠️ 仓库根目录的 `.env.development` / `.env.production` 是**失效的并行配置**（代码里没有任何 `loadEnv` / `import.meta.env.VITE_*` 引用），真实来源只有 `environments.ts`。且 `.env.production` 的 appid/域名与真实配置不一致，勿据此判断环境参数。

## 核心机制：路由自动生成

```
pnpm dev/build（带 --mode）
   │  vite.config.js 的 defineConfig 回调最开头（早于 uni 插件一切钩子）
   ▼
scripts/gen-pages.mjs
   1. 读 features.config.mjs 白名单（严格校验 mode）
   2. 以 pages.base.json 为主包底座
   3. 扫描 src/pages-*：白名单内的分包优先读其 pages.config.mjs；
      无清单文件的分包（venue/venuecard/venuecourse）递归扫描 .vue 自动登记
      （PascalCase 非 index.vue 的文件视为组件跳过；页面强制 navigationStyle: custom）
   4. 校验清单里每条 path 都有对应 .vue（缺失即报错）
   5. 按 features.config.mjs 的 preloadRule 生成预下载规则（packages 按环境过滤）
   6. 写 src/pages.json（内容不变则跳过）
   ▼ 联动
scripts/gen-routes.mjs
   为每个页面生成路由别名 → 写 src/utils/routes.ts（含 as const 类型）
```

**触发时机**：每次 dev/build 启动；dev 下修改 `features.config.mjs` / `routes-alias.mjs` / `pages.base.json` / `pages.config.mjs` 热更新重新生成；自动扫描型分包的 `.vue` 增删由 watcher 联动（200ms 去抖）。

**别名规则**（`src/utils/routes.ts`）：取路径末段；末段为 `index` 则取上级目录名；`kebab-case → camelCase`（如 `order-info → orderInfo`）。命中 `routes-alias.mjs` 的路径完全以配置为准。同名别名冲突时控制台告警（后者覆盖，前者用完整路径跳转）。tabBar 页面带 `tab: true`。

**手动触发**（排查用）：

```bash
node scripts/gen-pages.mjs [mode]    # 不传 mode = development（default 白名单）
node scripts/gen-routes.mjs
```

## 新增页面

1. **分包页面**：复制 `src/pages-template/pagesBasic` 骨架（`index.vue + index.scss`）到目标分包目录，并在该分包 `pages.config.mjs` 的 `pages` 数组登记 `{ path: "xxx/index", style: { navigationStyle: "custom" } }`（path 不含 `.vue`，必须真实存在，否则构建报错）。
2. **主包页面**：目录放 `src/pages/`，在 `src/pages.base.json` 登记（主包页面较少加，注意小程序主包体积）。
3. **新分包**：建 `src/pages-xxx/` 目录（自动被发现），在 `features.config.mjs` 对应环境数组加 `xxx`；建 `pages.config.mjs` 走清单管理，不建则走目录自动扫描（约定：页面文件小写开头或 index.vue，组件 PascalCase）。
4. 样式用 `utility.scss` 原子类 + `variables.scss` 的 `$color-*` 变量；页面跳转用别名 `router.push('xxx')`。

## 页面跳转（router）

`main.js` 已挂全局：模板里直接 `router.push(...)`，script 里也可用 `this.$router` / 全局 `router`（无需 import）。

```js
router.push('login')                          // 别名跳转（uni.navigateTo）
router.push('orderInfo', { id: 1, filter: { page: 1 } })  // 对象参数自动序列化
router.replace('home')                        // tab 页自动降级 reLaunch
router.back()                                 // 栈底自动回首页

// 页面 onLoad 还原参数：
import { parseParams } from '@/utils/router'
onLoad((options) => { const params = parseParams(options) })
```

内置能力：tab 页自动 `switchTab`（参数被忽略并告警）、300ms 防连点、页面栈 10 层自动 `redirectTo`、跳转失败降级。别名有 TS 类型提示（`routes.ts` 的 `as const`），拼错有编译期报错。

## 样式约定

- **px 自动转 rpx**（编译期 PostCSS，1px = 1rpx，按 750 设计稿直接写 px）；`0px`、`1px`（细边框）保留；行内注释 `/* no */` 或 `/* px */` 可跳过转换。
- 颜色统一用 `src/styles/variables.scss` 的 `$color-*` 变量；常用布局/间距/圆角用 `src/styles/utility.scss` 原子类。
- 页面样式独立 `.scss` 文件与 `.vue` 成对存放（参照 `src/pages/*` 现状）。

## 状态管理与请求

- Store：`src/stores/`（Pinia，`persist` 选项持久化到 uni storage）。
- 接口：`src/api/` 按域拆分，底层走 `src/utils/request.js`；环境相关前缀由 `env.webRoot` 等字段决定。
- 全局组件（无需 import）：`NavBar`、`BasePopup`、`MonthSelect`；其余组件从 `src/components/` 按需引入。

## 校验与故障排查

| 现象 | 原因与处理 |
|---|---|
| `未知构建环境 mode="xxx"` 构建终止 | mode 没在 `features.config.mjs` 的 `environments` 注册（或拼错），按报错列出的可用环境核对 |
| `配置了不存在的页面: [xxx]` | 分包 `pages.config.mjs` 里的 path 没有对应 `.vue` 文件 |
| `路由别名冲突` 警告 | 两个页面生成了同一别名，后者覆盖；在 `routes-alias.mjs` 里给其中一个改名 |
| dev 启动时 `routeCheck` 警告 | `routes.ts` 与 `pages.json` 不一致，重启一次 dev 让生成器先跑 |
| pages.json / routes.ts 意外变更 | 生成器内容不变会跳写；若出现 diff 说明路由确实变了，属正常，随功能一起提交 |

## AI 协作快速上下文

给 AI 助手的速览（人类也可参考）：

- **禁改**：`src/pages.json`、`src/utils/routes.ts`（自动生成，改了会被覆盖）。
- **路由入口**：主包 → `src/pages.base.json`；分包 → `src/pages-*/pages.config.mjs`；白名单/预下载 → `src/config/features.config.mjs`；别名 → `src/config/routes-alias.mjs`。改这四个地方即可，不要直接碰生成产物。
- **新页面**：以 `src/pages-template/pagesBasic` 为骨架（`index.vue + index.scss`），注册进分包清单；组件放分包内用 PascalCase 命名（不会被登记为页面）。
- **验证命令**：`node scripts/gen-pages.mjs [mode]`（应看到各子包挂载/排除日志且 exit 0）；拼错 mode 必须报错退出。
- **环境**：新增环境必须同时改 `environments.ts`（连接信息）与 `features.config.mjs`（子包白名单），缺任意一侧都直接构建失败；`environments.ts` 里 `origin`=后端域名、`webRoot`=API 路径前缀（不要再新增同义的 `prefix` 字段）。
- **样式**：写 px 即可（自动转 rpx）；颜色只用 `$color-*`；优先 utility 原子类。
- **跳转**：一律用 `@/utils/router` 的别名跳转，参数用 `parseParams` 还原；tab 页不支持参数。
- **生成器健壮性**：行尾已做 CRLF 归一化（autocrlf 检出也不误重写）；`features.config.mjs` 保持纯数据（禁 TS 语法/外部依赖）。
