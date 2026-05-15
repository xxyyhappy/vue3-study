# Vue 3 学习笔记 —— 第四阶段：组件化开发

> **学习日期**：2026-05-12
> **本阶段目标**：掌握组件化开发的核心概念，理解父子组件通信（props / emits）和插槽的使用

---

## 01. 什么是组件

### 大白话

**组件 = 页面上的一个独立功能块。**

就像搭乐高房子：房子由"屋顶"、"墙壁"、"窗户"、"门"拼起来。每个零件都是独立的，最后组装成一个整体。

```
页面（App.vue）
  ├── 搜索栏组件（SearchBar.vue）
  ├── 商品列表组件（ProductList.vue）
  └── 购物车组件（Cart.vue）
```

Vue 组件也一样——每个 `.vue` 文件就是一个组件，拼在一起就是完整的页面。

### 为什么要拆组件？

| 好处 | 大白话 |
|------|--------|
| **复用** | 同一个组件可以在多个地方用（比如按钮、卡片），不用重复写 |
| **好维护** | 改一个组件不影响别的，改 BUG 只需改一处 |
| **分工** | 每人写自己的组件，最后拼起来，互不干扰 |

---

## 02. 父传子 —— defineProps

### 大白话

**数据从父组件传到子组件**，就像水从水管流过去一样。

```
父组件（App.vue）                    子组件（Child.vue）

   const name = '小明'
        │
        │  :name="变量名"
        ├─────────────────────────────→  defineProps({ name: String })
        │                               props.name = '小明'

  模板中 <Child :name="name" />         模板中 {{ name }}
```

### 父组件写法

要做 2 件事：
1. 引入子组件
2. 在子组件标签上用 `:属性名="数据"` 传值

```vue
<script setup>
import Child from './components/Child.vue'

const parentName = '小明'
const list = [
  { id: 1, name: '小红', age: 20 },
  { id: 2, name: '小刚', age: 22 }
]
</script>

<template>
  <h2>父组件传数据给子组件</h2>

  <!-- 动态绑定：传 JS 变量（带冒号 :） -->
  <Child :name="parentName" :age="18" />

  <!-- 静态传值：传字符串字面量（不带冒号） -->
  <Child name="小明" age="18" />

  <!-- 不传值：子组件显示默认值 -->
  <Child />

  <!-- 循环传值 -->
  <Child v-for="item in list" :key="item.id"
    :name="item.name" :age="item.age" />
</template>
```

### 子组件写法

要做 2 件事：
1. 用 `defineProps` 声明要接收哪些数据
2. 在模板中直接用变量名显示

```vue
<script setup>
// defineProps 是 Vue 内置的宏，不用 import
const props = defineProps({
  name: {
    type: String,     // 限制类型：只接收字符串
    default: '未知'   // 默认值：父组件没传时显示"未知"
  },
  age: {
    type: Number,
    default: 0
  }
})

// 在 JS 中要用 props.name 读取
console.log(props.name)
// 在模板中可以直接写 {{ name }}，Vue 自动解包了
</script>

<template>
  <div class="child-box">
    <h3>子组件</h3>
    <p>我收到的名字：{{ name }}</p>
    <p>我收到的年龄：{{ age }}</p>
  </div>
</template>
```

### props 写法对照

```js
// 写法一：数组（只声明名字，不限制类型）
defineProps(['name', 'age'])

// 写法二：对象简写（只限制类型）
defineProps({ name: String, age: Number })

// 写法三：对象完整写法（类型 + 默认值 + 是否必填）★ 最常用
defineProps({
  name: { type: String, default: '未知' },
  age: { type: Number, required: true }
})
```

### 3 个重要规则

1. **只读** —— 子组件不能修改 props，改了也没用，Vue 会警告
2. **单向数据流** —— 数据只能父→子，不能子→父
3. **响应式** —— 父组件的变了，子组件自动更新

---

## 03. 子传父 —— defineEmits

### 大白话

Vue 的规矩是"数据向下流"（父→子）。但子组件想通知父组件做事情时，不能直接改父组件的数据。

**打个比方：孩子想吃零食，不能自己拿，要喊一声"妈！"，妈妈听到了去拿。**

```
孩子（子组件）                     妈妈（父组件）
    │                                │
    │   "妈！我想吃零食！"            │
    │──────────────────────────────→ │
    │     emit('eat-snack')          │
    │                                │  "好，我给你拿"
    │                                │   执行拿零食的逻辑
```

### 核心流程图

```
子组件（Child.vue）                  父组件（App.vue）

  defineEmits(['send-msg'])
        │
        │  emit('send-msg', '你好')
        ├─────────────────────────────→  @send-msg="handleMsg"
        │                               function handleMsg(msg) {
        │                                 msg === '你好'
        │                               }
```

### 子组件写法

```vue
<script setup>
// defineEmits 声明本组件可以触发哪些事件
const emit = defineEmits(['send-msg'])

function sendToParent() {
  // emit('事件名', 要传给父组件的数据)
  emit('send-msg', '你好，我是子组件！')
}
</script>

<template>
  <div class="child-box">
    <h3>子组件</h3>
    <button @click="sendToParent">发送消息给父组件</button>
  </div>
</template>
```

### 父组件写法

```vue
<script setup>
import { ref } from 'vue'
import Child from './components/Child.vue'

const childMsg = ref('')

function handleMessage(msg) {
  childMsg.value = msg
  console.log('收到子组件消息：', msg)
}
</script>

<template>
  <h2>父组件接收子组件的消息</h2>
  <Child @send-msg="handleMessage" />
  <p>收到子组件的消息：{{ childMsg }}</p>
</template>
```

### emit 传参对照

```js
// 子组件
emit('事件名')                  // 只通知，不带数据
emit('事件名', '你好')          // 带一个参数
emit('事件名', 参数1, 参数2)    // 带多个参数

// 父组件
@事件名="handle"                // handle(msg) 收到 '你好'
```

---

## 04. 插槽 slot —— 父组件往子组件塞 HTML

### 大白话

之前学的 props 只能传**数据**（字符串、数字、对象），但如果你想传一段 **HTML 结构**呢？

**插槽 = 在子组件里留一个"坑位"，父组件可以往里面填任何 HTML 内容。**

```
父组件                                 子组件

  <SlotChild>                        <div class="card">
    <p>任意HTML</p>      ──────→        <slot />    ← 这里显示"任意HTML"
    <button>点我</button>              </div>
  </SlotChild>
```

### 子组件写法（留坑）

```vue
<template>
  <div class="card">
    <h3>卡片组件</h3>
    <!-- <slot /> 就是一个"坑位"，父组件的内容会出现在这里 -->
    <div class="content">
      <slot />
    </div>
    <p class="footer">—— 卡片底部 ——</p>
  </div>
</template>
```

### 父组件写法（填坑）

写在子组件标签之间的内容，会被填到子组件的 `<slot />` 位置：

```vue
<script setup>
import SlotChild from './components/SlotChild.vue'
</script>

<template>
  <h2>插槽 slot 演示</h2>

  <!-- 第 1 个卡片：填文字和按钮 -->
  <SlotChild>
    <p>这是卡片里的内容</p>
    <button>点我</button>
  </SlotChild>

  <!-- 第 2 个卡片：填图片 -->
  <SlotChild>
    <img src="https://cn.vuejs.org/logo.svg" width="60" />
    <p>Vue 官方 logo</p>
  </SlotChild>

  <!-- 第 3 个卡片：填输入框 -->
  <SlotChild>
    <input v-model="text" placeholder="输入点什么..." />
  </SlotChild>
</template>
```

**效果：同一个组件，填不同的内容，显示不同的效果。**

### 插槽 vs props

| 方式 | 传什么 | 类比 |
|------|--------|------|
| props | 数据（字符串、数字、对象） | 传纸条 |
| slot | HTML 结构（标签、组件、布局） | 寄包裹 |

---

## 05. 具名插槽 —— 多个坑位，每个有名字

### 大白话

如果一个组件有多个位置需要父组件填充（比如头部、主体、底部），只有一个 `<slot />` 就不够了。

**给每个坑位取个名字，父组件就可以指定填到哪个坑。**

```
子组件 Layout.vue

┌───────────────────────────────┐
│ <slot name="header" />        │  ← 头部
├───────────────────────────────┤
│ <slot /> (默认坑位)            │  ← 主体
├───────────────────────────────┤
│ <slot name="footer" />        │  ← 底部
└───────────────────────────────┘
```

### 语法对照

| 插槽类型 | 子组件写法 | 父组件写法 |
|----------|-----------|-----------|
| 默认插槽 | `<slot />` | `<Child>内容</Child>` |
| 具名插槽 | `<slot name="header" />` | `<template #header>内容</template>` |

> `#header` 是 `v-slot:header` 的简写，就像 `:` 是 `v-bind:` 的简写。

---

## 06. 容器组件 vs 展示组件

### 为什么要拆分？

一个文件既管数据逻辑、又管显示界面，等页面复杂了会越来越乱。

**拆！把"管数据的"和"管显示的"分开：**

| 类型 | 负责什么 | 特点 |
|------|---------|------|
| **容器组件** | 管理数据、业务逻辑 | 定义数据、调用展示组件 |
| **展示组件** | 显示界面 | 通过 props 收数据，通过 emit 通知 |

### 数据流动图

```
容器（App.vue）                        展示组件（TodoItem.vue）
    │                                        │
    │  1. 定义数据 todoList                    │
    │                                        │
    │  2. :todo="item" ──props 传数据──────→  │  3. 收到 todo，显示
    │                                        │
    │                                        │  4. 用户点删除
    │                                        │
    │  6. 执行删除逻辑              ←─────────│  5. emit('deleteTodo', id)
    │     todoList.splice(...)     @deleteTodo│
```

### 判断方法

问自己一个问题：**这个组件有没有自己管理数据（定义变量、增删改查）？**

| 如果有 | → 容器组件 |
|--------|-----------|
| 如果没有，只靠 props 接收数据 | → 展示组件 |

---

## 07. 总结

### 你学到了什么？

| 概念 | 作用 | 关键写法 | 是否掌握 |
|------|------|---------|:--------:|
| 组件 | 页面上的独立功能块 | `.vue` 文件 | ☐ |
| `defineProps` | 父传子——子组件声明要接收哪些数据 | `defineProps({ name: String })` | ☐ |
| `defineEmits` | 子传父——子组件声明要触发哪些事件 | `defineEmits(['事件名'])` | ☐ |
| `emit()` | 子组件发出事件 | `emit('事件名', 数据)` | ☐ |
| `<slot />` | 默认插槽——子组件留一个坑位 | `<slot />` | ☐ |
| `<slot name="x" />` | 具名插槽——多个坑位 | `<slot name="header" />` | ☐ |
| `#xxx` | 父组件指定填到哪个坑 | `<template #header>` | ☐ |
| 展示组件 | 只负责显示 | props + emit | ☐ |
| 容器组件 | 管理数据和逻辑 | 定义数据、调用子组件 | ☐ |

### 思考题

1. props 是只读的吗？子组件改了会怎样？
2. 插槽和 props 的本质区别是什么？
3. 具名插槽的 `#header` 是哪个指令的简写？
4. 什么时候应该把组件拆成"容器"和"展示"两部分？
