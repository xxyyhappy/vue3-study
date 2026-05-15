# Vue 3 学习笔记 —— 第五阶段：Vue Router 路由

> **学习日期**：2026-05-13
> **本阶段目标**：掌握 Vue Router 的核心概念，理解路由的"URL ↔ 组件"映射关系，能配置路由、传递参数、使用导航守卫

---

## 01. 路由是什么

### 大白话

路由就是**「URL 地址 → 显示哪个组件」的映射表**。

- 你访问 `/home` → 显示 `Home.vue`
- 你访问 `/about` → 显示 `About.vue`
- 你访问 `/user/123` → 显示 `User.vue`

就像饭店的菜单：你点"宫保鸡丁"（URL），后厨就做宫保鸡丁（组件）。

### 为什么要用路由？

| 好处 | 大白话 |
|------|--------|
| **无刷新切换** | 点击链接页面变了，但浏览器不刷新，丝滑体验 |
| **支持历史记录** | 可以点"后退/前进"，可以复制链接分享 |
| **懒加载** | 访问到哪个页面才加载哪个页面，不浪费流量 |

---

## 02. 安装和配置路由

### 第一步：安装

```bash
npm install vue-router@4
```

### 第二步：创建路由器文件

项目里新建 `src/router/index.js`：

```js
// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

// 1. 定义路由规则（数组）
const routes = [
  {
    path: "/",                                  // URL 路径
    name: "home",                               // 路由名字（方便跳转）
    component: () => import("../pages/Home.vue"), // 懒加载
  },
  {
    path: "/about",
    name: "about",
    component: () => import("../pages/About.vue"),
  },
]

// 2. 创建路由器实例
const router = createRouter({
  history: createWebHistory(),  // URL 没有 # 号
  routes,
})

// 3. 导出
export default router
```

> **懒加载**：`component: () => import(...)` 意味着用户访问到这个页面时才去下载对应的 JS 文件，不是一次性全下载。

### 第三步：在 main.js 中注册

```js
// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'   // 引入路由器

const app = createApp(App)
app.use(router)                 // 告诉 Vue 使用路由器
app.mount('#app')
```

---

## 03. router-link 和 router-view —— 路由的两个核心组件

### router-view —— 组件"显示器"

`router-view` 是一个占位符，**当前 URL 匹配到哪个组件，就显示在 `<router-view />` 的位置**。

### router-link —— 导航链接

`router-link` 用来做页面跳转，比 `<a>` 标签强：

| 能力 | `<a>` 标签 | `<router-link>` |
|------|-----------|-----------------|
| 页面切换 | 刷新整个页面（白屏闪过） | JS 切换（无刷新） |
| 高亮当前链接 | 自己写 CSS | 自动加 `router-link-active` 类 |
| 阻止默认行为 | 自己写 `e.preventDefault()` | 内置处理 |

```vue
<template>
  <div>
    <!-- 方式 1：字符串路径 -->
    <router-link to="/home">首页</router-link>

    <!-- 方式 2：对象（带参数） -->
    <router-link :to="{ path: '/user/123' }">用户 123</router-link>

    <!-- 方式 3：按名字跳转（推荐，路径变了不用改代码） -->
    <router-link :to="{ name: 'about' }">关于我们</router-link>
  </div>
</template>
```

---

## 04. 动态路由 —— 一个组件适配多个 URL

### 大白话

一个商品详情页，URL 是 `/product/1`、`/product/2`、`/product/3`……难道要为每个商品写一条路由规则？**当然不用！用 `:参数名` 就行。**

```
/product/1   →  Product.vue（route.params.id = 1）
/product/2   →  Product.vue（route.params.id = 2）
/product/999 →  Product.vue（route.params.id = 999）
```

### 路由规则

```js
{
  // :id 表示"这里是动态的，叫什么名都行"
  path: "/product/:id",
  name: "product",
  component: () => import("../pages/Product.vue"),
}
```

### 组件中获取参数

```vue
<script setup>
import { useRoute } from "vue-router"
import { computed } from "vue"

const route = useRoute()
const productId = computed(() => route.params.id)
</script>

<template>
  <h1>商品详情</h1>
  <p>当前查看的是第 {{ productId }} 号商品</p>
  <router-link :to="{ name: 'product', params: { id: 5 } }">
    看第 5 号商品
  </router-link>
</template>
```

### 多个动态参数

```js
{ path: '/user/:userId/post/:postId', component: UserPost }

// URL  /user/5/post/100
// route.params  =>  { userId: '5', postId: '100' }
```

---

## 05. 嵌套路由 —— 页面里的子页面

### 大白话

嵌套路由就是**一个大页面里面套小页面**，大页面的框架不变，只有里面的小页面切换。

就像去商场：商场的外壳（电梯、走廊）是固定的，但每家店铺的内容不一样。你走进商场（父路由），然后选择进哪家店（子路由）。

```
普通路由：整个页面全部切换
  /home → 整个页面变成 Home.vue
  /about → 整个页面变成 About.vue

嵌套路由：只切换页面的一部分
  /user-center           → 显示用户中心框架（菜单 + 内容区）
  /user-center/profile   → 框架不变，右侧内容区变成"个人资料"
  /user-center/settings  → 框架不变，右侧内容区变成"账号设置"
```

### 核心流程图

```
用户访问 http://localhost:5174/user-center/profile

第一层匹配：path: '/user-center' → 显示 UserLayout.vue

  UserLayout.vue 渲染：
  ┌──────────────┬───────────────────────┐
  │ 左侧菜单     │  <router-view />       │ ← 第二层匹配
  │ (固定不变)   │                        │
  │              │  第二层：path: 'profile'│
  │ 📋个人资料   │  → 显示 UserProfile.vue │
  │ ⚙️账号设置   │                        │
  │ 📦我的订单   │                        │
  └──────────────┴───────────────────────┘
```

### 定义嵌套路由

```js
const routes = [
  {
    path: '/user-center',
    component: UserLayout,  // 父组件（布局框架）
    children: [
      // 子路由写法：path 不加 / 前缀！
      { path: 'profile',   component: UserProfile },   // /user-center/profile
      { path: 'settings',  component: UserSettings },   // /user-center/settings
      { path: 'orders',    component: UserOrders },     // /user-center/orders
      { path: '',          component: UserHome },        // /user-center（默认）
    ]
  }
]
```

### 嵌套层级关系

```
App.vue 里的 <router-view />          ← 第一层：管外层路由
  │
  │  匹配到 /user-center → 显示 UserLayout.vue
  │
  UserLayout.vue 里的 <router-view />  ← 第二层：管子路由
    │
    │  匹配到 profile  → 显示 UserProfile.vue
    │  匹配到 settings → 显示 UserSettings.vue
    │  匹配到 ''       → 显示 UserHome.vue（默认）
```

### 注意事项

1. **子路由 path 不要加 `/`** —— 加了就变成绝对路径，脱离父路由
2. **空字符串 path** 是默认子路由，访问父路径时显示
3. **嵌套可以多层**，但一般 2 层就够了

---

## 06. 编程式导航 —— 用 JS 代码跳转

### 大白话

除了用 `<router-link>` 点击跳转，也可以用 JavaScript 代码跳转（比如登录成功后自动跳首页）。

### 两个核心工具

```js
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()   // "动" —— 执行跳转操作
const route = useRoute()     // "看" —— 读取当前 URL 信息
```

| 工具 | 作用 | 类比 |
|------|------|------|
| `useRouter()` | 跳转、后退、前进 | 汽车的**方向盘** |
| `useRoute()` | 读当前 URL 的参数 | 汽车的**仪表盘** |

### push vs replace

| 方法 | 效果 | 能后退吗？ | 适用场景 |
|------|------|:----------:|----------|
| `router.push()` | 添加一条新记录 | 能 | 普通跳转 |
| `router.replace()` | 替换当前记录 | 不能 | 登录成功（不想回到登录页） |

### 四种跳转方式

```js
// 方式 1：字符串路径
router.push('/')

// 方式 2：对象 + 路径
router.push({ path: '/about' })

// 方式 3：对象 + 路由名字（推荐！）
router.push({ name: 'product', params: { id: 2 } })

// 方式 4：带查询参数
router.push({ path: '/about', query: { from: 'login' } })
// → URL = /about?from=login
```

> **特别提醒**：`params` 必须和 `name` 一起用！用 `path` 时加 `params` 不生效！

### 后退 / 前进

```js
router.back()       // 后退一步（等价于浏览器 ←）
router.forward()    // 前进一步（等价于浏览器 →）
router.go(-2)       // 后退两步
router.go(3)        // 前进三步
```

---

## 07. 路由模式 —— hash 与 history

### 大白话

Vue 是单页应用（SPA），整个网站只有一个真正的 HTML 文件。但用户希望 URL 能变化。两种模式用不同方式解决了这个问题。

| 模式 | URL 示例 | 创建方式 | 需要后端配合？ |
|------|---------|---------|:--------------:|
| Hash 模式 | `http://site.com/#/about` | `createWebHashHistory()` | ❌ 不需要 |
| History 模式 | `http://site.com/about` | `createWebHistory()` | ✅ 需要 |

### Hash 模式原理

URL 中 `#` 后面的内容变化时，浏览器**不会向服务器发请求**。`#` 后面的东西是给前端自己看的。

### History 模式原理

利用 HTML5 的 `history.pushState()` API，让浏览器不刷新页面也能改变 URL。但上线部署时需要 Nginx 把"所有路径都指向 index.html"。

### 部署配置（Nginx）

```nginx
server {
  listen 80;
  root /path/to/your/dist;

  location / {
    try_files $uri $uri/ /index.html;   # 所有路径都指向 index.html
  }
}
```

### 切换方式

只需改 `router/index.js` 中的一行：

```js
// Hash 模式
import { createWebHashHistory } from 'vue-router'
const router = createRouter({ history: createWebHashHistory(), routes })

// History 模式
import { createWebHistory } from 'vue-router'
const router = createRouter({ history: createWebHistory(), routes })
```

---

## 08. 404 页面

```js
// 404 必须放最后（路由匹配是从上往下，前面的都没匹配到才走到这）
{
  path: "/:pathMatch(.*)*",   // 正则：匹配所有字符
  name: "not-found",
  component: () => import("../pages/NotFound.vue"),
}
```

---

## 09. 路由守卫 —— 进入页面前"把个关"

### 大白话

路由守卫就是"页面的安检系统"。

就像去商场：
- 商场大门口有**保安**（`beforeEach`）：每个顾客进来前都要检查
- 商场里的 VIP 区门口还有**专属保安**（`beforeEnter`）：只有会员能进
- 你逛完离开时，门口有**迎宾员**（`afterEach`）：不能拦你，只能跟你说"谢谢光临"

### 三种路由守卫

| 类型 | 写法 | 特点 |
|------|------|------|
| 全局前置守卫 | `router.beforeEach()` | 每次跳转都触发，能拦截 |
| 路由独享守卫 | `beforeEnter` | 写在路由规则里，只针对某个路由 |
| 全局后置钩子 | `router.afterEach()` | 每次跳转都触发，不能拦截 |

### 完整流程

```
用户点击链接 → beforeEach(检查：需要登录吗？登录了吗？)
                         ↓ 放行
               beforeEnter(检查：这个页面是否有特殊权限？)
                         ↓ 放行
               组件渲染完成
                         ↓
               afterEach(改页面标题、记日志)
```

### Vue Router 4 的守卫写法

Vue Router 4 **废除了** `next()` 函数，改用**返回值**控制跳转：

| 返回值 | 效果 |
|--------|------|
| 不写 return | ✅ 放行 |
| `return false` | ❌ 拦截 |
| `return '/'` | 🔀 重定向 |
| `return { name: 'login' }` | 🔀 重定向到登录页 |

### meta 字段 —— 给路由打标签

```js
{
  path: '/dashboard',
  component: Dashboard,
  meta: {
    requiresAuth: true,   // 需要登录
    title: '控制面板',     // 页面标题
  }
}
```

然后在守卫里读取：

```js
router.beforeEach((to, from) => {
  if (to.meta.requiresAuth && !isLoggedIn) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
})
```

---

## 10. 总结

### 你学到了什么？

| 知识点 | 作用 | 关键语法 | 是否掌握 |
|--------|------|---------|:--------:|
| 创建路由器 | 定义 URL 和组件的对应关系 | `createRouter({ history, routes })` | ☐ |
| 注册路由器 | 让 Vue 应用认识路由 | `app.use(router)` | ☐ |
| `router-view` | 显示匹配到的组件（占位符） | `<router-view />` | ☐ |
| `router-link` | 页面跳转链接（无刷新） | `<router-link to="...">` | ☐ |
| 动态路由 | 一个组件适配多个 URL | `path: '/product/:id'` | ☐ |
| 获取参数 | 组件里读取 URL 参数 | `useRoute().params.id` | ☐ |
| 嵌套路由 | 页面里有子页面 | `children: [ ... ]` | ☐ |
| 编程式导航 | 用 JS 代码跳转 | `router.push()` / `router.replace()` | ☐ |
| 路由守卫 | 进入页面前做检查 | `router.beforeEach()` | ☐ |
| 404 页面 | 处理不存在的路径 | `path: '/:pathMatch(.*)*'` | ☐ |
| Hash 模式 | URL 带 `#`，部署简单 | `createWebHashHistory()` | ☐ |
| History 模式 | URL 干净，需后端配合 | `createWebHistory()` | ☐ |

### 常见问题

**Q：`useRoute()` 和 `useRouter()` 有什么区别？**

| | useRoute | useRouter |
|--|----------|-----------|
| 作用 | **读取**当前 URL 的参数 | **操作**跳转、后退 |
| 类比 | 仪表盘 | 方向盘 |

简单记：`useRoute` = 看，`useRouter` = 动。

**Q：嵌套路由里，两个层的 `<router-view>` 会混淆吗？**

不会。每个 `<router-view>` 只渲染自己那一层匹配到的组件。外层管第一层路由，内层管子路由，互不干扰。

### 思考题

1. 动态路由中 `:id` 匹配到的参数存在哪里？
2. `router.push()` 和 `router.replace()` 有什么区别？登录成功后应该用哪个？
3. 嵌套路由的子路由 path 为什么不能加 `/`？
4. Hash 模式和 History 模式分别适用于什么场景？
5. 路由守卫的 `beforeEach` 和 `beforeEnter` 有什么区别？
