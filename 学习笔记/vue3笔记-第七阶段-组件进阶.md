# Vue 3 学习笔记 —— 第七阶段：组件进阶

> **学习日期**：2026-05-15
> **本阶段目标**：掌握 Vue 3 组件进阶用法，包括插槽、动态组件、KeepAlive、Teleport、Suspense

---

## 01. Slot 插槽 —— 让父组件"往子组件里塞东西"

### 大白话

插槽就像**家里的插座孔**：

- 子组件是一个"插座"——外壳固定，但插什么由你决定
- 父组件是"电器插头"——你想插台灯（放文字）就插台灯，想插充电器（放按钮）就插充电器
- 同一个插座，插不同的电器，功能就不同

### 01a. 基础插槽 —— 一个坑

```vue
<!-- SlotBasic.vue —— 基础插槽演示 -->
<template>
  <div class="card">
    <h3>卡片标题</h3>
    <!-- <slot> 就是一个"占位符"，父组件塞的内容会出现在这里 -->
    <slot />
    <!--   ↑ 写成 <slot></slot> 也一样 -->
  </div>
</template>
```

父组件使用：

```vue
<SlotBasic>
  <!-- 尖括号中间的内容全部被塞进子组件的 <slot /> 位置 -->
  <p>这是自定义内容</p>
  <button>点我</button>
</SlotBasic>
```

**渲染结果**：

```html
<div class="card">
  <h3>卡片标题</h3>
  <p>这是自定义内容</p>
  <button>点我</button>
</div>
```

### 01b. 后备内容 —— 插座默认值

子组件可以为插槽提供**默认显示的内容**，父组件没塞东西时就显示默认值：

```vue
<template>
  <button class="my-btn">
    <!-- 默认显示"提交"；父组件塞了内容就显示父组件的 -->
    <slot>提交</slot>
  </button>
</template>
```

使用：

```vue
<MyBtn />              <!-- 显示：提交 -->
<MyBtn>保存</MyBtn>    <!-- 显示：保存 -->
<MyBtn><span>🚀</span> 发送</MyBtn>  <!-- 显示：🚀 发送 -->
```

### 01c. 具名插槽 —— 多个坑

一个组件里可能有**多个插槽**，需要给每个插槽取名字：

```vue
<!-- SlotNamed.vue —— 具名插槽 -->
<template>
  <div class="layout-card">
    <!-- name="header"：这个插槽叫 header -->
    <slot name="header" />
    <!-- 没有 name 的 slot 叫"默认插槽" -->
    <slot />
    <slot name="footer" />
  </div>
</template>
```

父组件指定内容放到哪个插槽：

```vue
<SlotNamed>
  <!-- 默认插槽（不指定 name） -->
  <p>正文内容</p>

  <!-- v-slot:header 简写为 #header -->
  <template #header>
    <h2>标题区</h2>
  </template>

  <template #footer>
    <p>底部信息</p>
  </template>
</SlotNamed>
```

| 语法 | 简写 | 对应 |
|------|------|------|
| `<slot name="header" />` | — | 定义名为 header 的插槽 |
| `<template v-slot:header>` | `<template #header>` | 把内容塞进 header 插槽 |
| `<slot />`（无 name） | — | 默认插槽（name="default"） |

### 01d. 作用域插槽 —— 子传父数据

默认是父传子（props），**作用域插槽反过来**：子组件把数据传给父组件的插槽内容。

```vue
<!-- SlotScoped.vue —— 作用域插槽 -->
<script setup>
// 子组件有自己的数据
const items = [
  { id: 1, name: '苹果', price: 5 },
  { id: 2, name: '香蕉', price: 3 },
  { id: 3, name: '橘子', price: 4 },
]
</script>

<template>
  <div class="list">
    <h3>商品列表</h3>
    <!-- :item="item" = 把 item 变量传给插槽 -->
    <!-- :index="i"   = 把索引也传过去 -->
    <slot v-for="(item, i) in items" :item="item" :index="i" />
    <!--   ↑ 每个商品循环调用一次插槽，把 item 和 index 传出去 -->
  </div>
</template>
```

父组件接收数据：

```vue
<SlotScoped v-slot="{ item, index }">
  <!-- ↑ 解构子组件传过来的数据 -->
  <div class="item">
    <span>{{ index + 1 }}.</span>
    <span>{{ item.name }} —— ¥{{ item.price }}</span>
  </div>
</SlotScoped>
```

**数据流向**：

```
父组件 ──props──→ 子组件（普通传参）
子组件 ──slot──→ 父组件（作用域插槽，子传父）
```

### 插槽总结

| 类型 | 语法 | 适用场景 |
|------|------|---------|
| 基础插槽 | `<slot />` | 父组件自定义卡片/按钮内容 |
| 后备内容 | `<slot>默认值</slot>` | 按钮文字、占位文本 |
| 具名插槽 | `<slot name="x" />` + `#x` | 布局组件（页头/内容/页脚） |
| 作用域插槽 | `<slot :data="d" />` + `v-slot="{ data }"` | 列表渲染自定义样式 |

---

## 02. 动态组件 —— 同一个位置，切换显示不同的组件

### 大白话

动态组件就像**一个旋转寿司台**：

- `<component :is="xxx" />` 就是那个传送带
- 你想吃三文鱼（显示 A 组件），把 A 放上去
- 你想吃甜虾（显示 B 组件），换 B 上去
- 传送带位置不变，上面的"内容"随意切换

```vue
<script setup>
import { ref } from 'vue'
import TabA from './TabA.vue'
import TabB from './TabB.vue'
import TabC from './TabC.vue'

// currentTab 存的是"当前要显示哪个组件"
const currentTab = ref(TabA)  // 默认显示 TabA

const tabs = [
  { name: 'A', comp: TabA },
  { name: 'B', comp: TabB },
  { name: 'C', comp: TabC },
]

function switchTab(comp) {
  currentTab.value = comp
}
</script>

<template>
  <div>
    <!-- 切换按钮 -->
    <button v-for="tab in tabs" :key="tab.name" @click="switchTab(tab.comp)">
      标签{{ tab.name }}
    </button>

    <!-- ★ 动态组件：:is 指向哪个组件，就显示哪个 -->
    <component :is="currentTab" />
  </div>
</template>
```

**核心**：`:is` 的值可以是一个**组件对象**（import 进来的），也可以是一个**字符串**（如注册过的组件名）。

### 动态组件 vs v-if

| 方式 | 优点 | 缺点 |
|------|------|------|
| `v-if="page === 'a'"` | 直观，新手友好 | 组件多了代码很啰嗦 |
| `<component :is="xxx" />` | 简洁，切换方便 | 需要理解 `:is` 语法 |

---

## 03. KeepAlive —— 切来切去不丢状态

### 大白话

KeepAlive 就像**冰箱**：

- 不用动态组件时：每次切回 Tab → 重新创建组件（像每次重新买菜做饭）
- 用了 KeepAlive：切走的 Tab 被"冷藏"起来，再切回来时原封不动（像剩菜放冰箱，明天热一下就能吃）

### 问题演示

没有 KeepAlive 时，动态组件每次切换都会**销毁重建**：

```vue
<!-- TabInput.vue —— 在输入框里打字，切走再切回来，字就没了 -->
<script setup>
import { ref } from 'vue'
const text = ref('')
</script>

<template>
  <div>
    <p>输入点什么，然后切到其他 Tab 再切回来</p>
    <input v-model="text" placeholder="输入文字..." />
    <p>你输入的是：{{ text }}</p>
  </div>
</template>
```

### 用 KeepAlive 包裹

```vue
<!-- 丢失状态 ≈ 每次重新创建 -->
<component :is="currentTab" />

<!-- 保持状态 ≈ 用 KeepAlive 冷藏起来 -->
<KeepAlive>
  <component :is="currentTab" />
</KeepAlive>
```

就是这么简单 —— 包一层 `<KeepAlive>` 就搞定了。

### KeepAlive 的钩子

被 KeepAlive 包裹的组件会多出两个生命周期钩子：

| 钩子 | 触发时机 | 大白话 |
|------|---------|--------|
| `onActivated()` | 组件**被激活**（切回来时） | 从冰箱拿出来解冻 |
| `onDeactivated()` | 组件**被停用**（切走时） | 放回冰箱冷藏 |

```vue
<script setup>
import { onActivated, onDeactivated } from 'vue'

onActivated(() => {
  console.log('组件被激活了——用户切回来了')
})

onDeactivated(() => {
  console.log('组件被停用了——用户切走了')
})
</script>
```

### 限制缓存

```vue
<!-- 只缓存 TabA 和 TabB，TabC 每次重新创建 -->
<KeepAlive :include="[TabA, TabB]">
  <component :is="currentTab" />
</KeepAlive>
```

`include` 匹配的是组件的 `name` 选项。如果是 `<script setup>` 组件，可以通过 `defineOptions` 设置：

```vue
<script setup>
defineOptions({ name: 'TabA' })
</script>
```

---

## 04. Teleport —— 把组件"传送"到 DOM 的别的位置

### 大白话

Teleport 就像**快递柜**：

- 你在网上下单（在组件里写了模态框）
- 快递送到柜子里（Teleport 把内容渲染到 body 下）
- 你不用管物流怎么走的（不用操心 DOM 结构）

### 为什么要用 Teleport？

**问题**：模态框写在一个深层嵌套的组件里，它的 `z-index` 可能被父元素的 CSS 限制（比如父元素设了 `overflow: hidden`），导致模态框显示不全。

**解决**：用 Teleport 把模态框"传送"到 `<body>` 下，它就不受父组件 CSS 影响了。

```vue
<!-- TeleportModal.vue -->
<script setup>
import { ref } from 'vue'
const show = ref(false)
</script>

<template>
  <div>
    <button @click="show = true">打开模态框</button>

    <!-- to="body" = 把内容渲染到 <body> 下 -->
    <!-- 但逻辑上它还是这个组件的子组件！ -->
    <Teleport to="body">
      <div v-if="show" class="modal-overlay" @click.self="show = false">
        <div class="modal-box">
          <h3>模态框标题</h3>
          <p>这是通过 Teleport 传送到 body 下的内容</p>
          <button @click="show = false">关闭</button>
        </div>
      </div>
    </Teleport>
  </div>
</template>
```

**渲染后的 DOM 结构**：

```html
<body>
  <div id="app">
    <!-- 组件在这里... -->
    <button>打开模态框</button>
  </div>

  <!-- Teleport 把内容传送到 body 的直接子级 -->
  <div class="modal-overlay">
    <div class="modal-box">
      <h3>模态框标题</h3>
      ...
    </div>
  </div>
</body>
```

**重点**：虽然 DOM 结构变了，但**逻辑父子关系不变**——模态框里依然可以 emit 事件、访问父组件的 props。

### Teleport 适用场景

| 场景 | 为什么用 Teleport |
|------|-----------------|
| 模态框 / 弹窗 | 避免父组件 CSS 限制 |
| 通知 / Toast | 需要固定在页面特定位置 |
| 全局遮罩层 | 不受路由切换影响 |
| 右键菜单 | 需要根据鼠标位置定位 |

---

## 05. Suspense —— 等待异步组件加载

### 大白话

Suspense 就像**网站在加载时显示的"骨架屏"**：

- 你点开一个页面，内容还没加载完 → 先显示个"加载中..."
- 内容加载完了 → 自动替换成真正的内容
- 用户不用盯着白屏发呆

### 基本用法

```vue
<script setup>
import { ref } from 'vue'

// 模拟异步数据加载
const data = ref(null)

// 假装去请求 API
const promise = new Promise((resolve) => {
  setTimeout(() => {
    resolve('数据加载完成！')
  }, 2000)
})

// 在顶层 await（组件必须配合 Suspense 使用）
data.value = await promise
</script>

<template>
  <div>
    <p>异步数据：{{ data }}</p>
  </div>
</template>
```

父组件：

```vue
<Suspense>
  <!-- 加载完成后显示的内容 -->
  <AsyncComponent />

  <!-- 加载过程中显示的内容 -->
  <template #fallback>
    <div class="loading">
      <p>⏳ 加载中，请稍候...</p>
    </div>
  </template>
</Suspense>
```

### 注意事项

1. **组件必须在 `<script setup>` 顶层使用 `await`**，才能触发 Suspense
2. **开发环境**中 Suspense 可能行为不一致，以生产环境为准
3. Vue 3.5+ 中 Suspense 仍标记为**实验性**，但已经可以使用
4. **多个异步组件**可以共用一个 Suspense，等待所有都加载完再显示

---

## 06. 综合——各知识点对比

| 特性 | 作用 | 类比 | 关键语法 |
|------|------|------|---------|
| Slot | 父组件往子组件"塞 HTML" | 插座插电器 | `<slot />` / `#name` |
| 动态组件 | 同一个位置切换不同组件 | 旋转寿司台 | `<component :is="comp" />` |
| KeepAlive | 缓存组件状态，避免销毁重建 | 冰箱冷藏 | `<KeepAlive>` |
| Teleport | 把内容渲染到 DOM 其他位置 | 快递柜 | `<Teleport to="body">` |
| Suspense | 异步组件加载完成前显示占位 | 骨架屏 | `<Suspense>` + `#fallback` |

---

## 07. 总结

### 你学到了什么？

| 知识点 | 说明 | 是否掌握 |
|--------|------|---------|
| 基础插槽 | `<slot />` 放内容的"坑" | ☐ |
| 后备内容 | `<slot>默认值</slot>` | ☐ |
| 具名插槽 | `<slot name="x" />` + `#x` | ☐ |
| 作用域插槽 | 子传数据给父组件插槽 | ☐ |
| 动态组件 | `<component :is="xxx" />` 切换 | ☐ |
| KeepAlive | 包一层就能缓存组件状态 | ☐ |
| Teleport | 把内容传送到 body 下 | ☐ |
| Suspense | 异步组件加载时显示 loading | ☐ |

### 思考题

1. 插槽和 props 有什么区别？（提示：props 传数据，slot 传 HTML）
2. 什么场景下必须用作用域插槽？（提示：子组件循环渲染，父组件自定义样式）
3. 没有 KeepAlive 时，切换动态组件会怎样？（提示：每次销毁重建）
4. Teleport 改变了 DOM 结构，那事件冒泡怎么算？（提示：事件冒泡按逻辑结构，不按 DOM 结构）
5. Suspense 的 `#fallback` 什么时候会显示？（提示：子组件 async 没完成时）
