# Vue 3 学习笔记 —— 第三阶段：响应式数据

> **学习日期**：2026-05-11
> **本阶段目标**：掌握 Vue 3 的响应式系统，能使用 ref、reactive、computed、watch 管理数据状态

---

## 01. ref —— 定义单个响应式数据

### 大白话

普通的 JS 变量变了，Vue 不知道，所以页面不会更新：

```js
let count = 0
count = 5  // 页面还是显示 0，没反应 ❌
```

用 `ref()` 包装过的数据像**带传感器的设备**——值变了，Vue 立刻知道，页面自动更新：

```js
const count = ref(0)
count.value = 5  // 页面自动变成 5！✅
```

### 使用规则

```
┌────────────────────────────────────────────┐
│  JS 中读写：必须用 .value                    │
│  const count = ref(0)                       │
│  count.value++      ← 修改                  │
│  console.log(count.value)  ← 读取           │
├────────────────────────────────────────────┤
│  模板中：直接写变量名，不用 .value             │
│  <p>{{ count }}</p>   ← 不用写 count.value   │
└────────────────────────────────────────────┘
```

**记忆口诀**：**JS 加 .value，模板不加**

### 完整代码

```vue
<script setup>
import { ref } from 'vue'

const count = ref(0)
const name = ref('小明')
const isOn = ref(false)

function add() { count.value++ }
function sub() { count.value-- }
function reset() { count.value = 0 }
function toggleSwitch() { isOn.value = !isOn.value }
</script>

<template>
  <!-- 数字 -->
  <p>当前计数：{{ count }}</p>
  <button @click="add">+1</button>
  <button @click="sub">-1</button>
  <button @click="reset">归零</button>

  <!-- 字符串 -->
  <p>名字：{{ name }}（长度：{{ name.length }}）</p>
  <p><input v-model="name" placeholder="输入新名字" /></p>

  <!-- 布尔值 -->
  <p>开关状态：{{ isOn }}</p>
  <button @click="toggleSwitch">切换开关</button>
  <p v-if="isOn">💡 灯亮着</p>
  <p v-else>💡 灯灭了</p>
</template>
```

### 适用于什么类型？

数字、字符串、布尔值这些"单个值"都用 `ref()`。

---

## 02. reactive —— 定义对象 / 数组

### 大白话

`ref` 管单个值，`reactive` 管**对象和数组**。

区别在于 JS 中访问方式不同：

```js
// ref：要加 .value
const count = ref(0)
count.value++

// reactive：直接 .属性，不用 .value
const user = reactive({ name: '小明' })
user.name = '小红'
```

### 完整代码

```vue
<script setup>
import { reactive } from 'vue'

// 对象
const user = reactive({ name: '小明', age: 18 })

function updateUser() {
  user.name = '小红'   // 直接 .属性，不用 .value
  user.age = 20
}

// 数组
const todoList = reactive(['学 Vue 3', '写代码', '复习笔记'])

function addTodo() {
  todoList.push('新待办')
}
</script>

<template>
  <!-- reactive 在模板中直接 .属性名 -->
  <p>姓名：{{ user.name }}</p>
  <p>年龄：{{ user.age }}</p>
  <button @click="updateUser">修改用户信息</button>

  <!-- 数组 -->
  <ul>
    <li v-for="(item, index) in todoList" :key="index">{{ item }}</li>
  </ul>
  <button @click="addTodo">添加待办</button>
</template>
```

### ref vs reactive

| 对比项 | ref | reactive |
|--------|:---:|:--------:|
| 适用场景 | 数字、字符串、布尔 | 对象、数组 |
| JS 中访问 | `count.value` | `state.name`（不用 .value） |
| 模板中访问 | `{{ count }}` | `{{ state.name }}` |
| 能否用于基本类型 | ✅ 能 | ❌ 不能 |

---

## 03. computed —— 计算属性

### 大白话

`computed` 就像**Excel 里的公式**——你输入原始数据，它自动算出结果。而且有**缓存**，原始数据没变就不重新算。

手动计算 vs computed：
```
手动：每次都要重新算 → 浪费性能
computed：数据没变就不重算 → 有缓存，性能好
```

### 完整代码

```vue
<script setup>
import { ref, reactive, computed } from 'vue'

const price = ref(10)
const quantity = ref(1)

// computed：根据 price 和 quantity 自动算出总价
// 有缓存：price 或 quantity 没变就不重新计算
const total = computed(() => price.value * quantity.value)

const scores = reactive({ 语文: 85, 数学: 92, 英语: 78 })

const averageScore = computed(() => {
  const values = Object.values(scores)
  const sum = values.reduce((a, b) => a + b, 0)
  return (sum / values.length).toFixed(1)
})

const comment = computed(() => {
  const avg = averageScore.value
  if (avg >= 90) return '优秀'
  if (avg >= 80) return '良好'
  if (avg >= 70) return '中等'
  return '需要加油'
})
</script>

<template>
  <h3>购物车</h3>
  <p>单价：{{ price }} 元 | 数量：
    <button @click="quantity--">-</button>
    {{ quantity }}
    <button @click="quantity++">+</button>
  </p>
  <p>总价：<strong>{{ total }}</strong> 元</p>

  <h3>成绩单</h3>
  <p v-for="(score, subject) in scores" :key="subject">
    {{ subject }}：{{ score }}
  </p>
  <p>平均分：{{ averageScore }} | 评语：{{ comment }}</p>
</template>
```

### 重点

1. computed 函数内部引用的 ref 要加 `.value`
2. 模板中直接当变量用，**不加 ()**
3. computed **有缓存**，比方法性能好

---

## 04. watch —— 侦听器

### 大白话

`watch` 就像**门卫**——你告诉它"盯着某个人"，那个人一有动静，门卫就通知你。

```
watch(要盯着的数据, (新值, 旧值) => {
  // 数据变了，执行这里的代码
})
```

### 完整代码

```vue
<script setup>
import { ref, reactive, watch } from 'vue'

// 1. 监听 ref
const keyword = ref('')
watch(keyword, (newVal, oldVal) => {
  console.log(`搜索词从 "${oldVal}" 变成了 "${newVal}"`)
})

// 2. 监听 reactive（需要写成函数形式）
const user = reactive({ name: '小明', age: 18 })
watch(() => user.name, (newVal) => {
  console.log('姓名变了：', newVal)
})

// 3. 实际场景：问答机器人
const question = ref('')
const answer = ref('')
watch(question, (newVal) => {
  if (newVal.includes('你叫什么'))     answer.value = '我叫 Vue 3'
  else if (newVal.includes('几岁了'))   answer.value = '我 3 岁了'
  else if (newVal.length > 0)          answer.value = '你问的是：' + newVal + '，让我想想...'
  else                                 answer.value = ''
})
</script>

<template>
  <p>搜索：<input v-model="keyword" placeholder="输入搜索关键词" /></p>

  <h3>提问：{{ question }}</h3>
  <p><input v-model="question" placeholder="输入问题" /></p>
  <p><strong>回答：</strong>{{ answer }}</p>
</template>
```

---

## 05. v-if / v-show —— 条件渲染

### 大白话

- `v-if`：条件为真就渲染，为假就直接**删除**元素（DOM 里没有）
- `v-show`：一直渲染，条件为假时只是**隐藏**（`display: none`）

就像**店铺的招牌**：
- `v-if` = 可收起的招牌：不用的时候就收起来放仓库（DOM 中没有）
- `v-show` = 可开关的灯：灯一直装在那里，只是关掉（DOM 中还在）

### 区别对比

| 对比项 | v-if | v-show |
|--------|:----:|:------:|
| 原理 | 真渲染，假删除 | 一直渲染，假隐藏 |
| 切换成本 | 高（频繁切换别用） | 低 |
| 首次渲染 | 条件为假时啥也不渲染 | 始终渲染 |
| 适用场景 | 很少切换的 | 频繁切换的 |

---

## 06. v-for —— 列表渲染

### 语法

```html
<!-- 遍历数组 -->
<li v-for="(item, index) in list" :key="唯一标识">
  {{ index }} - {{ item }}
</li>

<!-- 遍历对象 -->
<li v-for="(value, key) in obj" :key="key">
  {{ key }}: {{ value }}
</li>
```

### :key 的作用

Vue 用 `:key` 来"追踪"每个元素。就像每个人都有**身份证号**——有了 key，列表更新时才高效。

**原则**：尽量用数据的唯一 `id`，没 id 才用 `index`。

### 完整代码

```vue
<script setup>
import { ref, reactive } from 'vue'

const fruits = ['苹果', '香蕉', '橘子', '西瓜']
const userList = reactive([
  { id: 1, name: '小明', age: 18 },
  { id: 2, name: '小红', age: 20 }
])
const person = reactive({ name: '张三', age: 25, city: '北京' })
const newTodo = ref('')
const todoList = reactive(['学 Vue 3', '写代码', '复习笔记'])

function addTodo() {
  if (newTodo.value.trim()) {
    todoList.push(newTodo.value)
    newTodo.value = ''
  }
}
function removeTodo(index) {
  todoList.splice(index, 1)
}
</script>

<template>
  <h3>水果列表</h3>
  <ul>
    <li v-for="(fruit, index) in fruits" :key="index">
      {{ index + 1 }}. {{ fruit }}
    </li>
  </ul>

  <h3>用户列表</h3>
  <table border="1" cellpadding="8">
    <tr v-for="user in userList" :key="user.id">
      <td>{{ user.id }}</td>
      <td>{{ user.name }}</td>
      <td>{{ user.age }}</td>
    </tr>
  </table>

  <h3>待办列表（可增删）</h3>
  <p>
    <input v-model="newTodo" @keyup.enter="addTodo" placeholder="输入待办" />
    <button @click="addTodo">添加</button>
  </p>
  <ul>
    <li v-for="(todo, index) in todoList" :key="index">
      {{ todo }} <button @click="removeTodo(index)">删除</button>
    </li>
  </ul>
</template>
```

---

## 07. 总结

### 你学到了什么？

| 工具 | 作用 | 注意点 | 是否掌握 |
|------|------|--------|:--------:|
| `ref()` | 定义响应式数据（数字/字符串/布尔） | JS 中要 `.value` | ☐ |
| `reactive()` | 定义响应式对象/数组 | 不用 `.value`，不能用于基本类型 | ☐ |
| `computed()` | 计算属性（有缓存） | 模板中不加 `()` | ☐ |
| `watch()` | 侦听器（数据变化时执行操作） | 可监听 ref 和 reactive | ☐ |
| `v-if` / `v-show` | 条件渲染 | v-if 真删假不渲染，v-show 只是隐藏 | ☐ |
| `v-for` | 列表渲染 | 记得加 `:key` | ☐ |

### 思考题

1. `ref` 和 `reactive` 分别适用于什么场景？
2. `computed` 和普通函数的区别是什么？（提示：缓存）
3. `watch` 能不能监听 `reactive` 对象的某个属性？（提示：要写成函数形式）
4. `v-if` 和 `v-show` 怎么选？
5. `v-for` 的 `:key` 有什么作用？
