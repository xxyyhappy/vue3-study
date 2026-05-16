<!--
  CustomDirectivesDemo.vue —— 自定义指令演示页

  涵盖：v-focus、v-permission、v-debounce、v-copy、v-longpress
-->
<script setup>
import { ref } from "vue";

// 1. 定义指令：v-focus
// 钩子函数接收两个参数：el (绑定的元素) 和 binding (包含值、修饰符等对象)
// ===== v-color 演示 =====
const vColor = {
  mounted: (el, binding) => {
    el.style.backgroundColor = binding.value;
  },
  updated: (el, binding) => {
    el.style.backgroundColor = binding.value;
  },
};
const isActive = ref(true);
function colorChange() {
  console.log("改变颜色");
  // if (isActive.value) {
  //   isActive.value = false;
  // } else {
  //   isActive.value = true;
  // }
  isActive.value = !isActive.value;
}

const searchQuery = ref("");

// ===== v-permission 演示 =====
const showAll = ref(false);

// ===== v-debounce 演示 =====
const clickLog = ref([]);
function onDebouncedClick(e) {
  const msg = `点击了 ${new Date().toLocaleTimeString()}`;
  clickLog.value.push(msg);
  console.log(msg);
}
function clearLog() {
  clickLog.value = [];
}

// ===== v-copy 演示 =====
const copyText = ref("要复制的内容在这里");

// ===== v-longpress 演示 =====
const longpressMsg = ref("");
function onLongpress() {
  longpressMsg.value = "✅ 长按触发！时间是 " + new Date().toLocaleTimeString();
}
</script>

<template>
  <div class="demo-page">
    <h1>自定义指令</h1>
    <h1 v-color="isActive ? '' : 'yellow'">局部自定义指令v-color</h1>
    <button class="btn" @click="colorChange">切换颜色</button>
    <p class="subtitle">用 <code>app.directive()</code> 扩展 Vue 的模板语法</p>

    <!-- ============================================ -->
    <!-- 第一节：概念讲解 -->
    <!-- ============================================ -->
    <section class="section">
      <h2>1. 什么是自定义指令？</h2>
      <div class="explain-card">
        <p>
          <strong>指令</strong>就是 <code>v-xxx</code> 这种写法。 Vue
          自带了很多：<code>v-if</code>、<code>v-show</code>、<code>v-model</code>……
        </p>
        <p>
          但有时候你需要一些"专属功能"——比如"输入框自动聚焦"、"检查权限"。
          这时候就可以<strong>自己写指令</strong>。
        </p>
        <div class="analogy">
          💡 <strong>类比</strong>：Vue
          内置指令是"手机自带功能"，自定义指令是"你去应用商店下载的
          App"——想装什么功能都行。
        </div>
      </div>

      <h3>指令生命周期钩子</h3>
      <table class="table">
        <thead>
          <tr>
            <th>钩子</th>
            <th>触发时机</th>
            <th>常用场景</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>mounted</code></td>
            <td>元素挂载到 DOM</td>
            <td>初始化、事件绑定、DOM 操作</td>
          </tr>
          <tr>
            <td><code>updated</code></td>
            <td>元素所在的组件更新</td>
            <td>响应数据变化</td>
          </tr>
          <tr>
            <td><code>unmounted</code></td>
            <td>元素从 DOM 移除</td>
            <td>清理定时器、移除事件</td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- ============================================ -->
    <!-- 第二节：v-focus -->
    <!-- ============================================ -->
    <section class="section">
      <h2>2. v-focus —— 自动聚焦</h2>
      <div class="explain-card">
        <p>页面加载后，输入框自动获得焦点，不用手动点一下。</p>
        <div class="code-demo">
          <code>&lt;input v-focus placeholder="打开页面自动聚焦" /&gt;</code>
        </div>
      </div>
      <div class="demo-box">
        <label>搜索框：</label>
        <input
          v-focus
          v-model="searchQuery"
          placeholder="打开页面自动聚焦"
          class="input"
        />
        <span class="hint">👆 自动获取了焦点，可以直接打字</span>
      </div>
    </section>

    <!-- ============================================ -->
    <!-- 第三节：v-permission -->
    <!-- ============================================ -->
    <section class="section">
      <h2>3. v-permission —— 权限控制</h2>
      <div class="explain-card">
        <p>根据用户角色，决定某个按钮/元素能不能看到。</p>
        <p class="note">
          当前模拟权限：<strong>user</strong>（普通用户）。
          管理员才能看到"删除"按钮。
        </p>
      </div>
      <div class="demo-box">
        <button class="btn" v-permission="'admin'">
          🗑️ 删除用户（管理员可见）
        </button>
        <button class="btn" v-permission="'user'">
          👁️ 查看详情（所有用户可见）
        </button>
        <div class="hint">
          v-permission="'admin'" 的元素被隐藏了，因为当前用户只有 "user" 权限
        </div>
      </div>
    </section>

    <!-- ============================================ -->
    <!-- 第四节：v-debounce -->
    <!-- ============================================ -->
    <section class="section">
      <h2>4. v-debounce —— 防抖</h2>
      <div class="explain-card">
        <p>防止按钮被疯狂点击。指定时间内只执行最后一次。</p>
        <div class="code-demo">
          <code
            >&lt;button v-debounce:2000="onSubmit"&gt;提交&lt;/button&gt;</code
          >
        </div>
        <p class="note">
          参数 <code>:2000</code> 表示防抖等待 2 秒，不传默认 300ms
        </p>
      </div>
      <div class="demo-box">
        <button class="btn" v-debounce:2000="onDebouncedClick">
          快速点击我（防抖 2 秒）
        </button>
        <button class="btn btn-secondary" @click="clearLog">清空日志</button>
        <div class="log-box">
          <div v-for="(msg, i) in clickLog" :key="i" class="log-item">
            {{ msg }}
          </div>
          <div v-if="clickLog.length === 0" class="log-empty">
            还没有点击记录
          </div>
        </div>
        <div class="hint">
          试试疯狂点击按钮，只有停下来等 2 秒后才会记录一次
        </div>
      </div>
    </section>

    <!-- ============================================ -->
    <!-- 第五节：v-copy -->
    <!-- ============================================ -->
    <section class="section">
      <h2>5. v-copy —— 一键复制</h2>
      <div class="explain-card">
        <p>点击按钮把指定文本复制到剪贴板。</p>
      </div>
      <div class="demo-box">
        <div class="copy-row">
          <input v-model="copyText" class="input" style="flex: 1" />
          <button class="btn" v-copy="copyText">📋 复制</button>
        </div>
        <div class="hint">修改输入框的内容再点复制，会复制新的内容</div>
      </div>
    </section>

    <!-- ============================================ -->
    <!-- 第六节：v-longpress -->
    <!-- ============================================ -->
    <section class="section">
      <h2>6. v-longpress —— 长按</h2>
      <div class="explain-card">
        <p>按住元素超过 500ms 触发回调。</p>
      </div>
      <div class="demo-box">
        <button class="btn btn-longpress" v-longpress="onLongpress">
          按住我 0.5 秒
        </button>
        <div class="longpress-result">{{ longpressMsg }}</div>
      </div>
    </section>

    <!-- ============================================ -->
    <!-- 总结 -->
    <!-- ============================================ -->
    <section class="section summary">
      <h2>总结</h2>
      <table class="table">
        <thead>
          <tr>
            <th>指令</th>
            <th>作用</th>
            <th>核心钩子</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>v-focus</code></td>
            <td>自动聚焦</td>
            <td><code>mounted</code></td>
          </tr>
          <tr>
            <td><code>v-permission</code></td>
            <td>权限控制</td>
            <td><code>mounted</code>、<code>updated</code></td>
          </tr>
          <tr>
            <td><code>v-debounce</code></td>
            <td>防抖</td>
            <td><code>mounted</code>、<code>unmounted</code></td>
          </tr>
          <tr>
            <td><code>v-copy</code></td>
            <td>一键复制</td>
            <td><code>mounted</code></td>
          </tr>
          <tr>
            <td><code>v-longpress</code></td>
            <td>长按检测</td>
            <td><code>mounted</code>、<code>unmounted</code></td>
          </tr>
        </tbody>
      </table>
      <div class="think-questions">
        <h3>思考题</h3>
        <ol>
          <li>v-permission 如何改成从 Pinia store 中读取权限？</li>
          <li>
            v-debounce
            如果有多个元素用同一个防抖指令，定时器会冲突吗？怎么解决？
          </li>
          <li>尝试写一个 v-watermark（给页面加水印）的指令</li>
        </ol>
      </div>
    </section>

    <section class="section summary">
      <h2>水印练习</h2>
      <div
        class="content"
        v-water-mark="{
          text: 'Top Secret',
          color: 'rgba(255,0,0,0.2)',
          fontSize: 20,
        }"
      >
        <h1>红色大字号水印</h1>
      </div>
    </section>
  </div>
</template>

<style scoped>
.demo-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
  color: #42b883;
}

.subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 30px;
}

.subtitle code {
  background: #f0f0f0;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 14px;
}

.section {
  margin-bottom: 40px;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

.section h2 {
  color: #2c3e50;
  margin-bottom: 16px;
}

.explain-card {
  background: #f8f9fa;
  padding: 16px;
  border-radius: 6px;
  margin-bottom: 16px;
  line-height: 1.8;
}

.analogy {
  background: #e8f5e9;
  padding: 10px 14px;
  border-radius: 6px;
  margin-top: 10px;
}

.code-demo {
  background: #2c3e50;
  color: #e0e0e0;
  padding: 10px 14px;
  border-radius: 6px;
  margin-top: 10px;
  font-size: 14px;
  overflow-x: auto;
}

.note {
  color: #666;
  font-size: 14px;
  margin-top: 8px;
}

.demo-box {
  background: white;
  padding: 20px;
  border: 1px dashed #ddd;
  border-radius: 6px;
}

.input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s;
}

.input:focus {
  border-color: #42b883;
}

.btn {
  padding: 8px 20px;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin-right: 8px;
  transition: background 0.3s;
}

.btn:hover {
  background: #38a073;
}

.btn-secondary {
  background: #909399;
}

.btn-secondary:hover {
  background: #7a7f87;
}

.btn-longpress {
  background: #e6a23c;
  min-width: 160px;
  padding: 12px 24px;
  font-size: 16px;
}

.btn-longpress:hover {
  background: #cf9236;
}

.hint {
  color: #999;
  font-size: 13px;
  margin-top: 8px;
}

.log-box {
  margin-top: 12px;
  max-height: 150px;
  overflow-y: auto;
  background: #f5f5f5;
  border-radius: 4px;
  padding: 8px;
}

.log-item {
  padding: 4px 8px;
  font-size: 13px;
  color: #333;
  border-bottom: 1px solid #eee;
}

.log-empty {
  color: #ccc;
  font-size: 13px;
  text-align: center;
  padding: 20px;
}

.copy-row {
  display: flex;
  gap: 10px;
  align-items: center;
}

.longpress-result {
  margin-top: 12px;
  color: #e6a23c;
  font-weight: bold;
}

.table {
  width: 100%;
  border-collapse: collapse;
  margin: 16px 0;
}

.table th,
.table td {
  border: 1px solid #ddd;
  padding: 10px 14px;
  text-align: left;
}

.table th {
  background: #42b883;
  color: white;
}

.table code {
  background: #f0f0f0;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 13px;
}

.summary {
  background: #f0faf4;
}

.think-questions {
  margin-top: 20px;
  padding: 16px;
  background: white;
  border-radius: 6px;
}

.think-questions ol {
  margin-left: 20px;
  line-height: 2;
}

.content {
  min-height: 300px;
  background: white;
  padding: 40px;
  border-radius: 8px;
  border: 2px dashed #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
