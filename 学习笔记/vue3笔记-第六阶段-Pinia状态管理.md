# Vue 3 学习笔记 —— 第六阶段：Pinia 状态管理

> **学习日期**：2026-05-14
> **本阶段目标**：掌握 Pinia 状态管理，理解"为什么要用 Pinia"以及"Pinia 比手写好在哪"

---

## 01. 什么是"状态管理"

### 大白话

状态管理就像商场的**公共储物柜**：

- 你买完东西（某个组件产生的数据）→ 存到储物柜（Store）
- 你老公要用（另一个组件需要数据）→ 去同一个储物柜取
- 你退掉东西（修改数据）→ 储物柜自动更新，大家都看到最新状态

### 为什么需要状态管理？

Vue 组件之间经常需要**共享数据**：

| 场景 | 没有 Pinia | 有了 Pinia |
|------|-----------|-----------|
| 登录状态 | 需要在多个组件里传来传去 | 存在 auth Store，谁用谁拿 |
| 购物车数据 | props 一层层往下传，emits 一层层往上抛 | 存在 cart Store，哪里都能访问 |
| 用户设置 | 每个页面单独请求 | 存在 settings Store，全局共享 |

### 什么时候用 Pinia？

- ✅ 多个组件需要**读写同一份数据**
- ✅ 数据需要在**路由守卫**中使用
- ✅ 需要**跨页面/跨组件**共享状态
- ❌ 组件内部自用的数据，用 `ref()` 就够了

---

## 02. 安装 Pinia

```bash
npm install pinia
```

安装后在 `main.js` 中注册：

```js
// main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'

const app = createApp(App)

// ★ 注意：Pinia 要在路由之前注册！
// 这样路由守卫里才能用 useAuthStore()
const pinia = createPinia()
app.use(pinia)     // 先注册 Pinia
app.use(router)    // 再注册路由
app.mount('#app')
```

**重点**：`app.use(pinia)` 必须在 `app.use(router)` **之前**，否则路由守卫里调用 `useAuthStore()` 会报错。

---

## 03. Pinia 的三个核心概念

### 大白话

| 概念 | 对应 Vue | 大白话 | 注意 |
|------|---------|--------|------|
| **State** 状态 | `ref()` | 数据存在哪（储物格里的东西） | 可以直接修改 `store.count++` |
| **Getter** 计算属性 | `computed()` | 数据怎么变形（标签上写的编号） | 自动缓存，依赖不变不重算 |
| **Action** 动作 | `function()` | 怎么改数据（存/取的操作） | 普通函数，支持 async/await |

### 最简单的 Store —— 计数器

```js
// stores/counter.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// defineStore('唯一名称', 回调函数)
export const useCounterStore = defineStore('counter', () => {
  // ===== State =====
  const count = ref(0)

  // ===== Getter =====
  const double = computed(() => count.value * 2)

  // ===== Action =====
  function increment() { count.value++ }
  function decrement() { count.value-- }
  function reset() { count.value = 0 }

  return { count, double, increment, decrement, reset }
})
```

在组件中使用：

```vue
<script setup>
import { useCounterStore } from '../stores/counter.js'
const counter = useCounterStore()
</script>

<template>
  <p>count: {{ counter.count }}</p>
  <p>double: {{ counter.double }}</p>
  <button @click="counter.increment">+</button>
  <button @click="counter.decrement">-</button>
  <button @click="counter.reset">重置</button>
</template>
```

**语法要点**：
- `defineStore('名称', 回调)` —— 创建 Store
- `useXxxStore()` —— 在组件中获取 Store 实例
- `store.xxx` —— 直接访问 state 和 getter（不需要 `.value`）
- `store.xxx()` —— 调用 action

---

## 04. Auth Store —— 用 Pinia 管理登录状态

### 手写方案的问题

之前用 `useAuth.js` 手写登录状态管理时，有个麻烦的问题：

```js
// useAuth.js —— 必须把 user ref 单独导出来
const user = ref(null)
export { user }   // ★ 路由守卫要用，必须单独导出

// 路由守卫中：
import { user } from './useAuth.js'  // 用了不同的导入方式！
```

### Pinia 方案

```js
// stores/auth.js —— 用 defineStore 包裹，不需要额外导出
export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isLoggedIn = computed(() => user.value !== null)
  function login(name) { user.value = { username: name } }
  function logout() { user.value = null }
  return { user, isLoggedIn, login, logout }
})

// 组件和路由都用同一种方式：
// useAuthStore()  // 到处都能用！
```

### Auth Store 完整代码

```js
// stores/auth.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const STORAGE_KEY = 'auth_user'

export const useAuthStore = defineStore('auth', () => {
  // ===== State =====
  const user = ref(null)

  // ===== Getter =====
  const isLoggedIn = computed(() => user.value !== null)
  const username = computed(() => user.value?.username ?? '')

  // ===== Action =====
  function login(name) {
    user.value = { username: name }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user.value))
  }

  function logout() {
    user.value = null
    localStorage.removeItem(STORAGE_KEY)
  }

  // 初始化：从 localStorage 恢复登录状态
  const savedUser = localStorage.getItem(STORAGE_KEY)
  if (savedUser) {
    user.value = JSON.parse(savedUser)
  }

  return { user, isLoggedIn, username, login, logout }
})
```

---

## 05. 在路由守卫中使用 Pinia Store

这是 Pinia **最大的优势之一**：路由守卫和组件的调用方式完全一致。

```js
// router/index.js
import { useAuthStore } from '../stores/auth.js'

router.beforeEach((to, from) => {
  // ★ 直接在守卫里调用 useAuthStore()
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
})
```

**为什么之前不行？**
- `useAuth()` 是 Vue 组合式函数，只能在 `setup()` 中调用
- 路由守卫在组件之外执行，不能调用 `useAuth()`
- 所以之前不得不把 `user` ref 单独导出

**为什么 Pinia 可以？**
- Pinia Store 不依赖组件实例
- `useAuthStore()` 背后是个普通函数，返回一个共享的单例对象
- 所以在组件、路由守卫、普通 JS 文件中都能用

---

## 06. 在组件中使用 Store

### 读数据

```vue
<script setup>
import { useCounterStore } from '../stores/counter.js'
import { useAuthStore } from '../stores/auth.js'

const counter = useCounterStore()
const authStore = useAuthStore()
</script>

<template>
  <!-- 直接访问 state / getter -->
  <p>计数：{{ counter.count }}</p>
  <p>翻倍：{{ counter.double }}</p>

  <!-- 根据登录状态显示不同内容 -->
  <p v-if="authStore.isLoggedIn">欢迎，{{ authStore.username }}</p>
  <p v-else>请登录</p>
</template>
```

### 改数据

```vue
<script setup>
const counter = useCounterStore()
const authStore = useAuthStore()

function handleLogin(name) { authStore.login(name) }
function handleLogout() { authStore.logout() }
function addOne() { counter.count++ }  // 直接修改 state
</script>

<template>
  <button @click="handleLogin('小明')">登录</button>
  <button @click="handleLogout">登出</button>
  <button @click="addOne">+1</button>
</template>
```

### 注意事项

- **不要解构 state/getter** —— 会丢失响应式！使用 `store.xxx` 直接访问
- **action 可以解构** —— action 是普通函数，解构不影响
- **直接修改 state** —— Pinia 允许直接修改，但复杂操作推荐封装成 action

---

## 07. Vue DevTools + Pinia

安装 Vue DevTools 浏览器扩展后，Pinia 标签卡提供：

| 功能 | 说明 |
|------|------|
| 查看 State | 实时看到所有 Store 的当前数据 |
| 修改 State | 直接在 DevTools 里改值，页面实时更新 |
| 时间旅行 | 回退到某个操作之前，观察状态变化 |
| 追踪 Action | 看到每次 action 调用、谁调用的、传了什么参 |

---

## 08. Pinia vs Vuex（了解即可）

> Pinia 是 Vuex 的"接班人"，Vue 官方推荐优先使用 Pinia。

| 对比项 | Pinia | Vuex |
|--------|-------|------|
| 学习成本 | 低（就 3 个概念） | 高（state/mutations/actions/getters/modules） |
| 直接改 state | 支持 | 不支持（必须 commit） |
| 官方推荐 | ✅ 当前推荐 | ❌ 旧项目在用 |

对于新项目，**直接用 Pinia 就行**，不需要学 Vuex。

---

## 09. 总结

### 你学到了什么？

| 知识点 | 说明 | 是否掌握 |
|--------|------|:--------:|
| 什么是状态管理 | 共享数据的"公共储物柜" | ☐ |
| Pinia vs 手写 | Pinia 统一 API，不需要额外导出 ref | ☐ |
| 安装注册 | `npm install pinia` + `app.use(createPinia())` | ☐ |
| State | `const count = ref(0)` → `store.count` | ☐ |
| Getter | `const double = computed(...)` → `store.double` | ☐ |
| Action | `function increment() { ... }` → `store.increment()` | ☐ |
| 组件中使用 | `useAuthStore()` 获取 store 实例 | ☐ |
| 路由中使用 | 路由守卫里直接 `useAuthStore()` | ☐ |
| defineStore 语法 | `defineStore('名称', () => { ... return { ... } })` | ☐ |

### 常用 Store 模板

```js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useMyStore = defineStore('my-store', () => {
  // 1. State（数据）
  const data = ref(null)

  // 2. Getter（计算属性）
  const hasData = computed(() => data.value !== null)

  // 3. Action（方法）
  function setData(val) { data.value = val }
  function clearData() { data.value = null }

  // 4. 返回所有暴露的内容
  return { data, hasData, setData, clearData }
})
```

### 思考题

1. 为什么之前 `useAuth.js` 需要额外导出 `user` ref？
2. Pinia Store 为什么能在路由守卫中直接调用？
3. 什么情况下应该用 Pinia，什么情况下用 `ref()` 就够了？
4. 如果直接在模板里写 `authStore.count++` 会怎样？
