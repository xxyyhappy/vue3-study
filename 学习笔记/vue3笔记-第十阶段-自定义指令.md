# Vue 3 学习笔记 —— 第十阶段：自定义指令

> **学习日期：** 2026-05-16
> **本阶段目标：** 理解自定义指令的概念和生命周期，学会用 `app.directive()` 编写可复用的 DOM 操作逻辑

---

## 01. 什么是自定义指令？

### 大白话

**指令**就是 `v-xxx` 这种写法。Vue 自带了很多内置指令：

| 指令 | 作用 |
|---|---|
| `v-if` | 条件渲染 |
| `v-show` | 显示/隐藏 |
| `v-model` | 双向绑定 |
| `v-for` | 列表渲染 |
| `v-bind` | 绑定属性 |

但有时候你需要一些"专属功能"——比如"输入框自动聚焦"、"检查用户权限"。这时候就可以**自己写指令**。

> 💡 **类比**：Vue 内置指令是"手机自带功能"，自定义指令是"你去应用商店下载的 App"——想装什么功能都行。

### 什么时候用指令，什么时候用组件？

- **组件**：有模板、有样式、有交互逻辑 → 用 `.vue` 文件
- **指令**：只操作 DOM、没有模板 → 用 `directive`

比如"复制到剪贴板"这个功能，用组件太重了，用指令最合适。

---

## 02. 指令的生命周期钩子

一个自定义指令就是一个对象，里面可以写几个"钩子函数"（在特定时机自动执行）：

| 钩子 | 触发时机 | 常用场景 |
|---|---|---|
| `created` | 元素创建后，还没挂载 DOM | 初始化设置 |
| `mounted` | 元素挂载到 DOM | DOM 操作、事件绑定 |
| `updated` | 元素所在的组件更新了 | 响应数据变化 |
| `unmounted` | 元素从 DOM 移除 | 清理定时器、移除事件 |

**最常用的两个**：`mounted`（初始化）和 `unmounted`（清理）。

### 钩子函数的参数

```js
mounted(el, binding, vnode, prevVnode) {
  // el：指令绑定的 DOM 元素（最常用）
  // binding：指令的详细信息
  //   binding.value    → 传给指令的值，如 v-permission="'admin'" → "admin"
  //   binding.arg      → 指令的参数，如 v-debounce:2000 → "2000"
  //   binding.modifiers → 指令的修饰符，如 v-copy.once → { once: true }
  // vnode：元素的虚拟节点
}
```

---

## 03. v-focus —— 最简单的指令

自动聚焦是最经典的自定义指令例子。

```js
// directives/vFocus.js
const vFocus = {
  // mounted：元素挂载到 DOM 后执行
  mounted: (el) => {
    // el：指令绑定的 DOM 元素
    const input = el.tagName === "INPUT" ? el : el.querySelector("input");
    if (input) {
      input.focus(); // 让输入框获得焦点
    } else {
      el.focus();
    }
  },
};

export default vFocus;
```

**作用**：页面加载后输入框自动聚焦，用户不用手动点一下再打字。

**语法说明**：

- 指令名写成 `vFocus`（驼峰），模板里用 `v-focus`（烤串）
- `mounted` 是最常用的钩子，元素一出现在页面上就会触发

---

## 04. v-permission —— 权限控制

后台管理系统经常用到：不同角色看到不同的按钮。

```js
// directives/vPermission.js
const vPermission = {
  mounted: (el, binding) => {
    // binding.value 就是指令的值
    const requiredPermission = binding.value; // 比如 "admin"

    // 检查当前用户有没有这个权限
    if (!userPermissions.includes(requiredPermission)) {
      // 没有权限 → 从 DOM 中移除元素
      el.parentNode?.removeChild(el);
    }
  },
};
```

**用法**：

```html
<button v-permission="'admin'">删除用户</button>
<button v-permission="'user'">查看详情</button>
```

**重点**：

- `binding.value` 接收指令的值
- 实际项目中权限列表应该从 Pinia store 获取
- `updated` 钩子可以在权限变化时重新检查

---

## 05. v-debounce —— 防抖（指令参数）

防止按钮被快速重复点击，比如"提交订单"按钮。

```js
// directives/vDebounce.js
const vDebounce = {
  mounted: (el, binding) => {
    // binding.arg：指令的参数，自动转成字符串
    const delay = binding.arg ? Number(binding.arg) : 300;
    let timer = null;

    el.addEventListener("click", (e) => {
      clearTimeout(timer);      // 清除上一次的定时器
      timer = setTimeout(() => { // 重新计时
        binding.value(e);       // delay 毫秒后执行
      }, delay);
    });
  },
};
```

**用法**：

```html
<button v-debounce:2000="handleClick">提交</button>
```

**指令参数**（`:2000`）：

- `v-debounce` → 默认 300ms
- `v-debounce:2000` → 2000ms（2 秒）

**防抖原理**：

```
用户点击 → 开始计时
再点击  → 重置计时（之前的取消）
再点击  → 重置计时
停止点  → 计时结束 → 执行
```

---

## 06. v-copy —— 一键复制

点击按钮复制文本到剪贴板。

```js
const vCopy = {
  mounted: (el, binding) => {
    el.addEventListener("click", () => {
      const text = binding.value; // 要复制的文本

      if (navigator.clipboard) {
        // 方案一：Clipboard API（现代浏览器）
        navigator.clipboard.writeText(text);
      } else {
        // 方案二：execCommand（兼容老浏览器）
        const textarea = document.createElement("textarea");
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
    });
  },
};
```

**用法**：

```html
<button v-copy="'订单号: 123456'">复制订单号</button>
```

---

## 07. v-longpress —— 长按检测

按住元素超过一定时间触发回调（如长按删除、长按录音）。

```js
const vLongpress = {
  mounted: (el, binding) => {
    const callback = binding.value;
    if (typeof callback !== "function") return;

    let timer = null;

    // 按下时开始计时
    const onStart = () => {
      timer = setTimeout(() => {
        callback();
        timer = null;
      }, 500); // 500ms 算长按
    };

    // 松开时取消计时
    const onEnd = () => {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
    };

    // 把函数存到元素上，方便移除
    el._longpressData = { onStart, onEnd };

    el.addEventListener("mousedown", onStart);
    el.addEventListener("mouseup", onEnd);
    el.addEventListener("mouseleave", onEnd);
    el.addEventListener("touchstart", onStart);
    el.addEventListener("touchend", onEnd);
  },
  unmounted: (el) => {
    // 必须清理！防止内存泄漏
    if (el._longpressData) {
      const { onStart, onEnd } = el._longpressData;
      el.removeEventListener("mousedown", onStart);
      el.removeEventListener("mouseup", onEnd);
      el.removeEventListener("mouseleave", onEnd);
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchend", onEnd);
      delete el._longpressData;
    }
  },
};
```

**关键点**：

- 用 `setTimeout` + `clearTimeout` 实现"按住计时"
- 同时处理鼠标和触屏事件
- **必须在 `unmounted` 中清理事件**，否则组件销毁了事件还在监听

---

## 08. 全局注册 vs 局部注册

### 全局注册（推荐，所有组件都能用）

```js
// main.js
import vFocus from "./directives/vFocus.js";

const app = createApp(App);
app.directive("focus", vFocus); // 全局注册，所有组件都能用 v-focus
```

### 批量注册

```js
// directives/index.js
const directives = [
  { name: "focus", directive: vFocus },
  { name: "permission", directive: vPermission },
  // ...
];

export function registerDirectives(app) {
  directives.forEach(({ name, directive }) => {
    app.directive(name, directive);
  });
}

// main.js
import { registerDirectives } from "./directives/index.js";
registerDirectives(app);
```

### 局部注册（只在某个组件里用）

```vue
<script setup>
// 局部注册：文件名用 vXxx 格式（驼峰）
const vFocus = {
  mounted: (el) => el.focus(),
};
</script>

<template>
  <input v-focus />
</template>
```

---

## 09. 完整示例汇总

| 指令 | 作用 | 核心钩子 | 学到了什么 |
|---|---|---|---|
| `v-focus` | 自动聚焦 | `mounted` | 最简单的指令结构 |
| `v-permission` | 权限控制 | `mounted`, `updated` | 读取 `binding.value` |
| `v-debounce` | 防抖 | `mounted`, `unmounted` | 指令参数 `binding.arg` |
| `v-copy` | 一键复制 | `mounted` | DOM API 操作 |
| `v-longpress` | 长按检测 | `mounted`, `unmounted` | 事件绑定 + 清理 |

---

## 10. 总结

| 知识点 | 内容 |
|---|---|
| 自定义指令是什么 | 用 `app.directive()` 扩展 `v-xxx` 语法 |
| 指令生命周期 | `mounted`（挂载）、`updated`（更新）、`unmounted`（卸载） |
| 指令参数 | `el`（元素）、`binding.value`（值）、`binding.arg`（参数） |
| 全局注册 | `app.directive("name", obj)`，所有组件可用 |
| 局部注册 | `const vName = { ... }`，只在当前组件可用 |
| 使用场景 | DOM 操作、事件绑定、第三方库集成 |
| 注意事项 | 在 `unmounted` 中清理事件和定时器，防止内存泄漏 |

### 思考题

1. v-permission 如何改成从 Pinia store 中读取权限列表？
2. v-debounce 如果有多个元素同时使用，定时器会互相干扰吗？怎么解决？
3. 尝试实现一个 `v-watermark` 指令，给页面加上水印文字
4. 实现一个 `v-ellipsis` 指令，超出指定行数显示省略号
5. 如果指令需要同时接收值和参数（如 `v-xxx:arg="value"`），如何获取？
