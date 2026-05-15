# Vue 3 学习笔记 —— 第八阶段：组合式函数（Composables）

> **学习日期：** 2026-05-15
> **本阶段目标：** 理解组合式函数的概念，学会把可复用的逻辑提取成独立的函数

---

## 01. 什么是组合式函数？

### 大白话

**组合式函数就是一个带"响应式能力"的函数。**

你平时写函数是为了复用一段逻辑（比如格式化日期、计算总价）。但那些函数是"一次性"的——调用完返回结果就结束了。

组合式函数不一样：它返回的是 **响应式数据**，组件拿着它，数据变了页面自动更新。

打个比方：

- 普通函数 = 计算器 —— 按一下出个结果，用完就完
- 组合式函数 = 温度计 —— 一直插在组件里，温度变了它跟着变，页面也跟着变

### 相关概念

```
组件逻辑复用方式演进：

混入 (Mixins)      →   Vue 2 时代，问题：命名冲突、来源不清晰
组合式函数 (Composables) →   Vue 3 时代，问题全解决了
```

### 组合式函数遵循的规范

1. **命名**：以 `use` 开头（`useCounter`、`useAuth`）
2. **参数**：可以接收配置参数（`useCounter(10)` 从 10 开始计数）
3. **返回值**：返回 `ref` / `reactive` / 函数，组件解构后使用,为什么是响应式，就是因为js中使用了ref和reactive
4. **内部**：可以使用所有组合式 API（`ref`、`computed`、`watch`、生命周期等）

---

## 02. useCounter —— 第一个组合式函数

最简单的例子：计数器。

```js
// src/composables/useCounter.js
import { ref, computed } from "vue";

export function useCounter(initialValue = 0) {
  const count = ref(initialValue); // 响应式数据
  const double = computed(() => count.value * 2); // 自动翻倍

  function increment() {
    count.value++;
  } // +1
  function decrement() {
    count.value--;
  } // -1
  function reset() {
    count.value = initialValue;
  } // 重置

  return { count, double, increment, decrement, reset };
}
```

在组件中使用：

```vue
<script setup>
import { useCounter } from "../composables/useCounter.js";

const { count, double, increment, decrement, reset } = useCounter(5);
//                                                         ↑ 从 5 开始计数
</script>

<template>
  <div>
    <p>计数：{{ count }}</p>
    <!-- 5 → 6 → 7 ... -->
    <p>翻倍：{{ double }}</p>
    <!-- 10 → 12 → 14 ... -->
    <button @click="increment">+1</button>
    <button @click="decrement">-1</button>
    <button @click="reset">重置</button>
  </div>
</template>
```

| 函数          | 作用                              |
| ------------- | --------------------------------- |
| `count`       | 当前计数值（ref，模板中直接显示） |
| `double`      | 计数值 × 2，自动更新（computed）  |
| `increment()` | 计数 +1                           |
| `decrement()` | 计数 -1                           |
| `reset()`     | 回到初始值                        |
| `add(n)`      | 计数 + n                          |

---

## 03. useToggle —— 开关

很多场景需要"开/关"状态（弹窗、菜单、主题），每次都写一个 `ref(false)` + `toggle()` 函数太啰嗦了，抽成组合式函数。

```js
// src/composables/useToggle.js
import { ref } from "vue";

export function useToggle(initialValue = false) {
  const value = ref(initialValue);

  function toggle() {
    value.value = !value.value;
  }
  function setTrue() {
    value.value = true;
  }
  function setFalse() {
    value.value = false;
  }

  return { value, toggle, setTrue, setFalse };
}
```

在组件中使用：

```vue
<script setup>
import { useToggle } from "../composables/useToggle.js";

const { value: isOpen, toggle: toggleMenu } = useToggle();
//   ↑ 解构时重命名，语义更清晰
</script>

<template>
  <div>
    <button @click="toggleMenu">
      {{ isOpen ? "收起" : "展开" }}
    </button>
    <div v-if="isOpen">
      <p>这是菜单内容</p>
    </div>
  </div>
</template>
```

**小技巧**：解构时可以重命名，`{ value: isOpen }` 让语义更清晰。

---

## 04. useLocalStorage —— 数据持久化

把数据同步存到 `localStorage`，刷新页面不丢失。

```js
// src/composables/useLocalStorage.js
import { ref, watch } from "vue";

export function useLocalStorage(key, defaultValue = null) {
  // 启动时从 localStorage 读取，没有就用默认值
  const stored = localStorage.getItem(key);
  const data = ref(stored ? JSON.parse(stored) : defaultValue);

  // 数据变了 → 自动写回 localStorage
  watch(
    data,
    (newVal) => {
      if (newVal === null || newVal === undefined) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, JSON.stringify(newVal));
      }
    },
    { deep: true },
  );

  return data;
}
```

在组件中使用：

```vue
<script setup>
import { useLocalStorage } from "../composables/useLocalStorage.js";

const name = useLocalStorage("name", "匿名用户");
const todos = useLocalStorage("todos", []);
</script>

<template>
  <div>
    <input v-model="name" placeholder="输入你的名字" />
    <p>你好，{{ name }}！</p>
    <!-- 刷新页面后，name 还是上次输入的值 -->
  </div>
</template>
```

**原理**：

```
用户输入 → ref 数据变化 → watch 触发 → localStorage.setItem() → 下次打开页面还在
```

---

## 05. useMousePosition —— 生命周期+事件

组合式函数里也能用 `onMounted`、`onUnmounted` 这些生命周期钩子。

```js
// src/composables/useMousePosition.js
import { ref, onMounted, onUnmounted } from "vue";

export function useMousePosition() {
  const x = ref(0);
  const y = ref(0);

  function update(event) {
    x.value = event.clientX;
    y.value = event.clientY;
  }

  // 组件出现在页面上时 → 开始追踪
  onMounted(() => window.addEventListener("mousemove", update));

  // 组件从页面上移除时 → 停止追踪（防止内存泄漏）
  onUnmounted(() => window.removeEventListener("mousemove", update));

  return { x, y };
}
```

**为什么需要 onUnmounted？**

如果不移除事件监听，组件销毁了但回调还在运行。就像你退房了但还把空调开着——浪费资源（内存泄漏）。

---

## 06. 组合式函数的底层原理

学完了例子，你可能在想：**组合式函数到底是怎么"连"上组件的？怎么就自动更新了？**

来，一层层拆开看。

### 原理一：组合式函数就是在 `setup()` 期间执行的普通函数

这一点最重要——**组合式函数没有任何"魔法"**。

`<script setup>` 里的代码会在组件创建时执行一次。当你调用 `useCounter()`，那个函数的代码就在那个组件的上下文中跑了一遍。

```js
// 组件 A
<script setup>
const { count, increment } = useCounter(5)
// 相当于你手动写了：
//   const count = ref(5)
//   function increment() { count.value++ }
</script>

// 组件 B
<script setup>
const { count, increment } = useCounter(100)
// 相当于你手动写了：
//   const count = ref(100)
//   function increment() { count.value++ }
</script>
```

**每调用一次 `useCounter()`，就创建一组全新的 `ref`**，互不干扰。

### 原理二：每个组件有自己的"副本"

把组合式函数想象成**月饼模具**：

- 模具（组合式函数）只有一个
- 但你按一下（调用一次），就做出一个月饼（一组响应式数据）
- 组件 A 按一下 → 得到自己的 count → 组件 A 用
- 组件 B 按一下 → 得到自己的 count → 组件 B 用
- 两个 count 互不干涉

所以组合式函数解决的是**逻辑复用**，不是**状态共享**。

```
调用 useCounter(0) → 创建独立的 ref(0)
调用 useCounter(0) → 又创建独立的 ref(0)
调用 useCounter(0) → 再创建独立的 ref(0)
```

**如果想让所有组件共享同一个状态怎么办？**
把 `ref` 定义在函数外面（模块作用域），就像 `useAuth.js` 那样：

```js
// 模块作用域 —— 只执行一次
const user = ref(null);

export function useAuth() {
  // 所有组件调用 useAuth() 拿到的都是同一个 user
  return { user };
}
```

### 原理三：Vue 如何知道"数据变了要更新哪个组件"？

这个问题问得好。

每个 `ref` 内部有一个"小本子"，记录了哪些地方在用它的值：

```
count = ref(0)
  └── 小本本：[组件 A, 组件 C]

count.value = 5
  → 翻小本本：哦，组件 A 和 C 用了我
  → 通知组件 A 和 C："我变了，你们重新渲染吧"
```

具体流程：

```
1. 组件 A 的 <script setup> 执行
2. 遇到 {{ count }} 或 count.value
3. Vue 记下："组件 A 依赖了 count"
4. 你在某个地方改了 count.value++
5. Vue 翻小本本 → "组件 A 需要更新"
6. 组件 A 重新渲染，页面刷新
```

这就是 Vue 的**依赖追踪**机制。组合式函数只是利用了这套机制——你在函数里创建 `ref`，组件在使用函数时建立了依赖关系，剩下的 Vue 自动搞定。

### 原理四：为什么解构不会丢失响应式？

这其实是一个"表象 vs 本质"的问题。

```js
// 组合式函数返回的是：
return { count, double, increment, decrement, reset }

// 你在组件里解构：
const { count, ... } = useCounter()
```

**因为 `count` 本身是一个 `ref` 对象**（不是普通数值），解构拿到的是这个对象的引用，不是它的值。

```
count = ref(0)
count 的实际结构：
{
  __v_isRef: true,  // 标记：我是 ref
  _value: 0,         // 实际存的值
  value: 0,          // 暴露给外层的接口
  // ...还有 getter/setter 用于依赖追踪
}

解构 const { count } = useCounter()
→ 你拿到了 ref 对象本身
→ count.value 依然能读写
→ Vue 依然能追踪
```

所以你解构拿到的本质是**引用**，不是复制。Vue 的响应式链条没断。

### 原理五：Computed 是怎么"自动更新"的？

```js
const count = ref(0);
const double = computed(() => count.value * 2);
```

`computed` 内部也创建了一个 `ref`。它做了两件事：

1. **读**：当你读 `double.value` 时，它去执行 `() => count.value * 2`，同时被 Vue 记下"double 依赖了 count"
2. **缓存**：只要 count 没变，每次读 double 都返回缓存的值，不重复计算
3. **更新**：count 变了 → Vue 告诉 double "你的依赖变了" → double 重新计算 → 告诉组件"我变了" → 组件重新渲染

```
流程：
count.value = 3
  → count 通知所有依赖它的人："我变了"
  → double 收到通知："哦，count 变了，那我重新算一下"
  → double 重新算：3 × 2 = 6
  → double 通知所有依赖它的人："我也变了"
  → 组件收到通知："double 变了，重新渲染"
  → 页面上的 {{ double }} 从 4 变成 6
```

### 一张图看完整流程

```
[组件 A 渲染]
     │
     ▼
<script setup> 执行
     │
     ▼
调用 useCounter(5)
     │
     ▼
ref(5) 创建  ───  count: 5
computed() 创建 ───  double: 10
     │
     ▼
模板中用到了 {{ count }} 和 {{ double }}
     │
     ▼
Vue 记下："组件 A → 依赖 count, double"
     │
     ▼
你点了 +1 按钮 ──→ increment() ──→ count.value = 6
     │
     ▼
Vue 翻小本本："组件 A 用了 count，需要更新"
     │
     ▼
double 自动重算：6 × 2 = 12
     │
     ▼
组件 A 重新渲染，页面显示 count=6, double=12
```

### 小结：组合式函数的工作原理

| 你看到的"魔法"         | 背后的真相                                    |
| ---------------------- | --------------------------------------------- |
| 数据变了页面自动更新   | 依赖追踪：Vue 记下了谁依赖了什么              |
| 解构出来的还是响应式的 | 因为拿到的是 ref 对象引用，不是值             |
| computed 自动重新计算  | computed 内建了依赖监听和缓存                 |
| 每个组件有自己的数据   | 因为每次调用函数都执行一遍，创建新 ref        |
| 生命周期钩子也能用     | 因为函数在 setup 期间执行，Vue 注册了这些钩子 |

---

## 07. 组合多个组合式函数

组合式函数可以互相调用，像搭积木一样组合。

```js
// 把一个计数器和一个 toggle 组合起来
export function useCounterWithResetConfirm(initialValue = 0) {
  const counter = useCounter(initialValue);
  const confirmReset = useToggle(false);

  function resetWithConfirm() {
    confirmReset.setTrue();
  }

  function doReset() {
    counter.reset();
    confirmReset.setFalse();
  }

  function cancelReset() {
    confirmReset.setFalse();
  }

  return {
    ...counter,
    confirmReset,
    resetWithConfirm,
    doReset,
    cancelReset,
  };
}
```

这种"组合"能力是组合式函数最大的优势——你可以用小函数拼出复杂功能，每个小函数都能单独测试、单独复用。

---

## 08. 总结

### 组合式函数解决了什么问题？

| 问题                                               | 方案                             |
| -------------------------------------------------- | -------------------------------- |
| 多个组件用同一套逻辑（如计数、开关）               | 提取成组合式函数，各组件调用即可 |
| Mixins 命名冲突（两个 mixin 都定义了同一个方法）   | 显式解构，来源清晰               |
| Mixins 不知道数据从哪来的                          | 每个返回值都来自明确的函数调用   |
| 逻辑分散在选项里（data、methods、computed 分开写） | 逻辑内聚在一个函数里             |

### 你学到了什么？

| 知识点                                                  | 是否掌握  |
| ------------------------------------------------------- | --------- |
| 组合式函数是"带响应式能力的函数"，以 `use` 开头         | □ 是 □ 否 |
| useCounter：封装计数逻辑                                | □ 是 □ 否 |
| useToggle：封装开关逻辑                                 | □ 是 □ 否 |
| useLocalStorage：数据持久化到 localStorage              | □ 是 □ 否 |
| useMousePosition：生命周期 + 事件监听                   | □ 是 □ 否 |
| 组合式函数可以互相调用、组合使用                        | □ 是 □ 否 |
| 依赖追踪：Vue 自动记录组件依赖了哪些数据                | □ 是 □ 否 |
| 每个组件调用组合式函数得到独立的 ref 副本               | □ 是 □ 否 |
| 模块级 state（函数外定义）vs 实例级 state（函数内定义） | □ 是 □ 否 |

### 思考题

1. 组合式函数和普通函数有什么区别？（提示：看返回值是不是响应式）
2. `useLocalStorage` 为什么不需要返回 `set` 函数？（提示：`v-model` 可以直接修改 ref）
3. 如果不用组合式函数，两个页面都需要计数功能，你会怎么做？（提示：复制粘贴 vs 复用）
4. `useMousePosition` 里不加 `onUnmounted` 会有什么后果？（提示：切走页面后鼠标移动还在触发）
5. 为什么两个组件各自调用 `useCounter()`，它们的 count 互不影响？（提示：每次调用都执行一遍函数体）
6. 如果把 `useCounter` 的 `const count = ref(0)` 移到函数外面（模块作用域），会有什么效果？（提示：所有组件共享同一个 count）
