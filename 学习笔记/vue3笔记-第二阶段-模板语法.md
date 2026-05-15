# Vue 3 学习笔记 —— 第二阶段：模板语法

> **学习日期**：2026-05-10
> **本阶段目标**：掌握 Vue 模板的核心指令，能在页面上显示数据、绑定属性、处理事件、实现双向绑定

---

## 01. 插值表达式 `{{ }}` —— 在页面上显示数据

### 大白话

插值表达式就像**在 HTML 里挖个洞，把 JS 变量的值填进去**。

你写 `<p>{{ name }}</p>`，Vue 会自动把 `name` 的值替换进去。

```html
<template>
  <!-- 显示变量 -->
  <p>{{ name }}</p>

  <!-- 数学运算 -->
  <p>{{ age + 10 }}</p>

  <!-- 拼接字符串 -->
  <p>{{ "前缀" + message }}</p>

  <!-- 调用 JS 方法 -->
  <p>{{ text.toUpperCase() }}</p>

  <!-- 三目运算 -->
  <p>{{ score >= 60 ? '及格' : '不及格' }}</p>
</template>
```

### 能写什么？

| 能写 ✅ | 不能写 ❌ |
|---------|----------|
| 变量名 `{{ name }}` | `if` 语句 |
| 数学运算 `{{ age + 10 }}` | `for` 循环 |
| 字符串拼接 `{{ "你好" + name }}` | 变量声明 `let x = 1` |
| 三目运算 | |
| 调用方法 `.toUpperCase()` | |

### 完整代码

```vue
<script setup>
const name = '小明'
const age = 18
const hobby = '打篮球'
const message = 'hello'
const score = 85
</script>

<template>
  <h1>大家好，我是 {{ name }}</h1>
  <p>我今年 {{ age }} 岁</p>
  <p>10 年后我 {{ age + 10 }} 岁</p>
  <p>{{ "我喜欢" + hobby }}</p>
  <p>转成大写：{{ message.toUpperCase() }}</p>
  <p>成绩：{{ score }} 分，{{ score >= 60 ? '及格' : '不及格' }}</p>
</template>
```

---

## 02. v-text 和 v-html —— 显示文本和 HTML

### 大白话

- `{{ }}` 和 `v-text`：把内容当**纯文本**显示（`<b>加粗</b>` 会显示成文字，不会变粗）
- `v-html`：把内容当 **HTML 标签**渲染（`<b>加粗</b>` 会真的显示粗体字）

就像看一篇文章：
- `v-text` = 看**源代码**（标签符号也显示出来）
- `v-html` = 看**渲染后的页面**（标签生效）

### 完整代码

```vue
<script setup>
const normalText = '这是一段普通文字'
const htmlText = '这是一段<b>加粗</b>的文字'

const articleContent = `
  <h3 style="color:#42b883;">文章标题</h3>
  <p>这是文章的第一段内容。</p>
`
</script>

<template>
  <h2>文本含 HTML 标签时的区别：</h2>
  <p>1. {{ }} 显示：{{ htmlText }}</p>           <!-- 显示：这是一段<b>加粗</b>的文字 -->
  <p>2. v-text 显示：<span v-text="htmlText"></span></p>  <!-- 同上 -->
  <p>3. v-html 显示：<span v-html="htmlText"></span></p>  <!-- 显示：这是一段加粗的文字 -->

  <!-- 实际场景：展示富文本内容 -->
  <div v-html="articleContent"></div>
</template>
```

### 区别对比

| 方式 | 显示变量 | 渲染 HTML 标签 |
|------|:--------:|:--------------:|
| `{{ }}` | ✅ | ❌ 当成纯文本 |
| `v-text="变量"` | ✅ | ❌ 当成纯文本 |
| `v-html="变量"` | ✅ | ✅ 渲染成 HTML |

### ⚠️ 安全提醒

`v-html` 有 XSS（跨站脚本攻击）风险。**用户输入的内容绝不要用 `v-html`**，只有自己或后台受信任的内容才可以用。

---

## 03. v-bind —— 动态绑定 HTML 属性

### 大白话

**简写**：`v-bind:src="变量"` → **`:src="变量"`**

HTML 属性的值本来是固定的（比如 `<img src="logo.png">`），用 `:src` 可以让属性值变成**动态的**——变量变了，属性值也跟着变。

就像**相框**：
- 普通 `src="photo.jpg"` = 相框里永远放同一张照片
- `:src="photoUrl"` = 相框可以根据你的指令自动换照片

### 完整代码

```vue
<script setup>
import { ref } from 'vue'

const logoUrl = 'https://cn.vuejs.org/logo.svg'
const logoWidth = 80
const linkUrl = 'https://cn.vuejs.org/'
const linkTitle = '点击访问 Vue 中文官网'
const isActive = ref(false)
const textColor = 'red'
const textSize = 24
const canClick = ref(false)
</script>

<template>
  <!-- 绑定图片 src 和 width -->
  <img :src="logoUrl" :width="logoWidth" />

  <!-- 绑定链接 href 和 title -->
  <a :href="linkUrl" :title="linkTitle" target="_blank">Vue 官网</a>

  <!-- 绑定 class（对象写法，动态切换） -->
  <p :class="{ active: isActive }" class="box"
     :style="{ color: textColor, fontSize: textSize + 'px' }">
    {{ isActive ? '现在是激活状态' : '点下方按钮激活我' }}
  </p>
  <button @click="isActive = !isActive">切换激活状态</button>

  <!-- 绑定 disabled -->
  <button :disabled="!canClick">点我</button>
  <label><input type="checkbox" v-model="canClick" /> 启用按钮</label>
</template>
```

### 常用绑定

| 绑定目标 | 写法 |
|----------|------|
| 图片地址 | `:src="变量"` |
| 链接地址 | `:href="变量"` |
| CSS 类名 | `:class="{ active: isActive }"` |
| 行内样式 | `:style="{ color: colorVar }"` |
| 禁用状态 | `:disabled="布尔值"` |

---

## 04. v-on —— 事件绑定

### 大白话

**简写**：`v-on:click="函数"` → **`@click="函数"`**

监听用户的操作（点击、输入、鼠标移动等），触发对应的 JS 函数。

就像**门铃**：有人按门铃（事件发生），你开门（执行函数）。

### 完整代码

```vue
<script setup>
import { ref } from 'vue'

const count = ref(0)
const boxMsg = ref('鼠标移入试试')
const showText = ref(true)

function add() { count.value++ }
function sub() { count.value-- }
function handleClick(e) {
  alert('点击位置：(' + e.clientX + ', ' + e.clientY + ')')
}
</script>

<template>
  <!-- 1. @click：点击事件 -->
  <h3>计数器：{{ count }}</h3>
  <button @click="add">+1</button>
  <button @click="sub">-1</button>
  <button @click="count = 0">归零</button>

  <!-- 2. @dblclick：双击事件 -->
  <p @dblclick="count = count + 10">双击我，+10</p>

  <!-- 3. @mouseenter / @mouseleave -->
  <div class="box"
    @mouseenter="boxMsg = '鼠标进来了！'"
    @mouseleave="boxMsg = '鼠标走了'">
    {{ boxMsg }}
  </div>

  <!-- 4. 事件对象 $event -->
  <button @click="handleClick($event)">点我，弹出点击位置</button>

  <!-- 5. 内联写法 -->
  <button @click="showText = !showText">切换文字显示</button>
  <p v-if="showText">这行文字可以显示/隐藏</p>
</template>
```

### 常用事件

| 事件 | 触发时机 | 类比 |
|------|---------|------|
| `@click` | 点击 | 按门铃 |
| `@dblclick` | 双击 | 快速按两下 |
| `@mouseenter` | 鼠标移入 | 脚踩到门槛 |
| `@mouseleave` | 鼠标移出 | 脚离开门槛 |
| `@keyup` | 键盘按键抬起 | 松开键盘按钮 |
| `@keyup.enter` | 按下回车键 | 按 Enter |

---

## 05. v-model —— 双向绑定

### 大白话

`v-model` 把输入框和 JS 变量"绑"在一起：

- 你在输入框打字 → 变量自动更新
- 变量变了 → 输入框自动更新

这叫**双向绑定**，就像**对讲机**：你说话（输入），对方听到；对方说话，你听到。

### 完整代码

```vue
<script setup>
import { ref } from 'vue'

const message = ref('默认文字')
const age = ref(18)
const intro = ref('')
const agree = ref(false)
const framework = ref('')
</script>

<template>
  <!-- 文本输入 -->
  <p><label>输入文字：<input v-model="message" /></label></p>
  <p>你输入的是：{{ message }}</p>

  <!-- 数字输入 -->
  <p><label>输入年龄：<input type="number" v-model.number="age" /></label></p>
  <p>明年你 {{ age + 1 }} 岁</p>

  <!-- 多行文本 -->
  <p>自我介绍：</p>
  <textarea v-model="intro" rows="4"></textarea>
  <p>预览：{{ intro }}</p>

  <!-- 复选框 -->
  <p><input type="checkbox" v-model="agree" /> 我同意以上条款</p>
  <p>是否同意：{{ agree }}</p>

  <!-- 下拉选择 -->
  <p>你最喜欢的框架：</p>
  <select v-model="framework">
    <option value="" disabled>—— 请选择 ——</option>
    <option value="vue">Vue</option>
    <option value="react">React</option>
    <option value="angular">Angular</option>
  </select>
  <p>你选了：{{ framework }}</p>
</template>
```

### 修饰符

| 修饰符 | 作用 |
|--------|------|
| `.number` | 自动转成数字类型 |
| `.trim` | 自动去掉首尾空格 |

---

## 06. 总结

### 你学到了什么？

| 指令 | 作用 | 简写 | 是否掌握 |
|------|------|:----:|:--------:|
| `{{ }}` | 显示数据 | — | ☐ |
| `v-text` | 显示纯文本 | — | ☐ |
| `v-html` | 渲染 HTML | — | ☐ |
| `v-bind` | 动态绑定属性 | `:` | ☐ |
| `v-on` | 绑定事件 | `@` | ☐ |
| `v-model` | 双向绑定（表单） | — | ☐ |

### 使用原则

1. **默认用 `{{ }}`** —— 最常用、最简单
2. **需要富文本**（带格式的内容）用 `v-html`，但注意安全
3. **动态属性**用简写 `:属性名`
4. **事件**用简写 `@事件名`
5. **表单输入**用 `v-model`

### 思考题

1. `{{ }}` 和 `v-text` 有什么区别？（提示：`{{ }}` 在加载时可能闪一下）
2. 什么情况下必须用 `v-bind`？（提示：属性值来自 JS 变量时）
3. `@click` 和原生 `onclick` 有什么区别？
4. `v-model` 是哪个指令的语法糖？（提示：`v-bind` + `v-on`）
