# Vue 3 学习笔记 —— 第九阶段：Provide / Inject（依赖注入）

> **学习日期：** 2026-05-15
> **本阶段目标：** 理解 Provide/Inject 的概念，学会用依赖注入解决 prop 逐层传递问题

---

## 01. 什么是 Provide / Inject？

### 问题场景

组件嵌套时，顶层数据要传给深层子组件，用 props 需要层层中转：

```
App（数据在这）
  └── Layout
        └── Sidebar
              └── UserInfo（要用数据）
```

用 props 的写法——每层都要转发一遍：

```vue
<!-- App → Layout -->
<Layout :user="user" />

<!-- Layout → Sidebar -->
<Sidebar :user="user" />

<!-- Sidebar → UserInfo -->
<UserInfo :user="user" />
```

这个问题叫 **prop 逐层透传（prop drilling）**。中间组件并不需要这个数据，只是帮忙传一手。

### Provide / Inject 的解决方案

```
App（provide: 我把数据放在这）
  └── Layout（不需要管）
        └── Sidebar（不需要管）
              └── UserInfo（inject: 我直接拿数据）
```

**不管隔了多少层，需要数据的组件直接拿，中间的不用管。**

### 大白话

- **provide** = 在楼顶放了个共享快递柜（存数据）
- **inject** = 去快递柜取件（拿数据）
- 中间的楼层不用管快递怎么送的

### 使用规范

| 角色 | 方法 | 在哪个组件 |
|------|------|-----------|
| 提供方 | `provide(key, value)` | 祖先组件（任何层级） |
| 注入方 | `inject(key, defaultValue)` | 后代组件（任何层级） |

---

## 02. 基础用法

### 父组件提供数据

```vue
<script setup>
import { provide } from "vue";

provide("message", "你好，这是来自顶层的数据！");
provide("count", 42);
</script>
```

### 子组件注入数据

```vue
<script setup>
import { inject } from "vue";

const message = inject("message"); // "你好，这是来自顶层的数据！"
const count = inject("count"); // 42
</script>

<template>
  <p>{{ message }}</p>
  <p>{{ count }}</p>
</template>
```

### 设置默认值

如果找不到对应的 provide，返回 `defaultValue`：

```vue
<script setup>
import { inject } from "vue";

// 如果祖先没有 provide("theme")，就用 "light"
const theme = inject("theme", "light");
</script>
```

### 完整示例

**App.vue（顶层）**

```vue
<script setup>
import { provide } from "vue";
import Child from "./Child.vue";

provide("appName", "Vue 学习项目");
provide("version", "1.0.0");
</script>

<template>
  <Child />
</template>
```

**Child.vue（中间层，不需要任何数据）**

```vue
<template>
  <GrandChild />
</template>
```

**GrandChild.vue（底层，直接拿数据）**

```vue
<script setup>
import { inject } from "vue";

const appName = inject("appName");
const version = inject("version", "未知版本");
</script>

<template>
  <p>{{ appName }} - v{{ version }}</p>
</template>
```

中间组件 `Child.vue` 完全不用管数据传递，这就是 Provide/Inject 解决的问题。

---

## 03. 注入响应式数据

provide 的数据可以是响应式的（ref / reactive），子组件改了数据，所有用到的地方都更新。

```vue
<!-- 父组件 -->
<script setup>
import { provide, ref, reactive } from "vue";

const count = ref(0);
const user = reactive({ name: "张三", age: 25 });

provide("count", count);
provide("user", user);

function increment() {
  count.value++;
}
</script>

<template>
  <div>
    <p>父组件：{{ count }}</p>
    <button @click="increment">+1</button>
    <ChildComponent />
  </div>
</template>
```

```vue
<!-- 子组件 -->
<script setup>
import { inject } from "vue";

const count = inject("count");
const user = inject("user");
</script>

<template>
  <div>
    <p>子组件拿到的 count：{{ count }}</p>
    <p>子组件拿到的 user：{{ user.name }}</p>
    <button @click="count++">子组件也能改</button>
  </div>
</template>
```

**注意**：子组件直接修改响应式数据是可行的，但会让数据流向不清晰。推荐用 `readonly` 保护。

---

## 04. 使用 readonly 保护数据

直接修改 inject 的数据会破坏"单向数据流"原则。用 `readonly` 包装后再 provide，子组件只能读不能改。

```vue
<script setup>
import { provide, ref, readonly } from "vue";

const count = ref(0);

// 提供原始引用（父组件可改）
provide("count", count);

// 提供只读版本（子组件只能读）
provide("readonlyCount", readonly(count));

function increment() {
  count.value++;
}
</script>
```

子组件尝试修改 readonly 的数据会报错（开发环境提醒）：

```vue
<script setup>
import { inject } from "vue";

const count = inject("readonlyCount");
// count.value++ → 报错！readonly 不可修改
</script>
```

### 最佳实践模式：provide + readonly + 修改函数

父组件提供数据和修改方法，子组件只能通过方法修改：

```vue
<script setup>
import { provide, ref, readonly } from "vue";

const count = ref(0);

function increment() {
  count.value++;
}
function reset() {
  count.value = 0;
}

// 给子组件只读的数据 + 修改方法
provide("count", readonly(count));
provide("increment", increment);
provide("reset", reset);
</script>
```

```vue
<!-- 子组件 -->
<script setup>
import { inject } from "vue";

const count = inject("count");
const increment = inject("increment");
const reset = inject("reset");
</script>

<template>
  <p>count：{{ count }}</p>
  <button @click="increment">+1</button>
  <button @click="reset">重置</button>
</template>
```

**数据流向清晰**：`子组件 → 调用方法 → 父组件改数据 → 自动更新 → 子组件重新渲染`

---

## 05. 使用 Symbol 作为 key

provide/inject 用字符串作为 key，如果有多个库都用 `"theme"` 这个 key，会互相覆盖。用 Symbol 可以避免命名冲突。

```js
// keys.js —— 统一管理注入 key
export const THEME_KEY = Symbol("theme");
export const USER_KEY = Symbol("user");
```

```vue
<!-- 父组件 -->
<script setup>
import { provide, ref } from "vue";
import { THEME_KEY, USER_KEY } from "./keys.js";

provide(THEME_KEY, ref("dark"));
provide(USER_KEY, { name: "李四", role: "admin" });
</script>
```

```vue
<!-- 子组件 -->
<script setup>
import { inject } from "vue";
import { THEME_KEY } from "./keys.js";

const theme = inject(THEME_KEY, "light");
</script>
```

**实际项目中推荐这种做法**：key 统一管理，不会冲突，语义清晰。

---

## 06. 应用层 Provide（app.provide）

不止组件可以 provide，整个应用也可以。所有组件都能 inject，不用任何父组件提供。

```js
// main.js
import { createApp } from "vue";
import App from "./App.vue";

const app = createApp(App);

// 全局提供配置 —— 所有组件都能 inject
app.provide("config", {
  apiBaseUrl: "https://api.example.com",
  version: "2.0",
});

app.mount("#app");
```

任何组件都可以直接 inject：

```vue
<script setup>
import { inject } from "vue";

const config = inject("config");
// config.apiBaseUrl → "https://api.example.com"
</script>
```

**适用场景**：全局配置、主题、当前用户信息等所有组件都可能需要的数据。

---

## 07. 总结

### Provide/Inject 解决了什么问题？

| 问题 | 方案 |
|------|------|
| prop 逐层透传（prop drilling） | 祖先 provide，子孙 inject，中间组件不用管 |
| 全局数据共享 | app.provide 让所有组件都能 inject |
| 数据流向混乱 | provide + readonly + 修改函数，保持单向数据流 |

### Provide vs Props vs Pinia 对比

| 特性 | Props | Provide/Inject | Pinia |
|------|-------|---------------|-------|
| 数据传递范围 | 父子之间 | 祖先 → 所有后代 | 所有组件 |
| 隔层传递 | 每层都要传 | 直接跨层 | 直接使用 |
| 数据来源清晰度 | 清晰 | 较清晰（用 Symbol 更好） | 清晰 |
| TypeScript 支持 | 好 | 中等（需额外类型标注） | 好 |
| 适合场景 | 组件自身配置 | 深层组件共享 | 全局状态 |

### 你学到了什么？

| 知识点 | 是否掌握 |
|--------|---------|
| Provide/Inject 解决 prop drilling 问题 | □ 是 □ 否 |
| `provide(key, value)` 提供数据 | □ 是 □ 否 |
| `inject(key, defaultValue)` 注入数据 | □ 是 □ 否 |
| inject 响应式数据 | □ 是 □ 否 |
| `readonly()` 保护 provide 数据 | □ 是 □ 否 |
| provide + readonly + 修改函数的模式 | □ 是 □ 否 |
| Symbol 作为 key 避免命名冲突 | □ 是 □ 否 |
| `app.provide()` 全局提供数据 | □ 是 □ 否 |

### 思考题

1. Provide/Inject 和直接用 Pinia 有什么区别？什么时候该用哪个？
2. 如果父组件 provide 了一个 ref，子组件 inject 后直接改了它的值，会有啥问题？
3. 为什么 recommend `readonly` + 修改函数的模式？
4. 用字符串作为 key 有什么风险？Symbol 怎么解决这个问题的？
5. `app.provide()` 和组件内 `provide()` 有什么区别？
