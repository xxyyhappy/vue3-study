<!--
  ComposablesDemo.vue —— 组合式函数演示页

  涵盖：useCounter、useToggle、useLocalStorage、useMousePosition
-->
<script setup>
import { useCounter } from "../composables/useCounter.js";
import { useToggle } from "../composables/useToggle.js";
import {
  useLocalStorage,
  resetLocalStorage,
} from "../composables/useLocalStorage.js";
import { useMousePosition } from "../composables/useMousePosition.js";
import { defineStore } from "pinia";

// ===== useCounter =====
const { count, double, increment, decrement, reset, add } = useCounter(5);

// ===== useToggle =====
const { value: isVisible, toggle: toggleVisibility } = useToggle(false);

// ===== useLocalStorage =====
const username = useLocalStorage("username", "");
const message = useLocalStorage("message", "");
const resetfny = () => {
  resetLocalStorage("username", "");
  resetLocalStorage("message", "");
  username.value = "";
  message.value = "";
  console.log("移除");
};

// ===== useMousePosition =====
const { x, y } = useMousePosition();
</script>

<template>
  <div class="demo-page">
    <h1>组合式函数（Composables）</h1>
    <p class="subtitle">把可复用的逻辑提取成独立的函数</p>

    <!-- ============================================ -->
    <!-- 第一部分：useCounter -->
    <!-- ============================================ -->
    <section class="section">
      <h2>一、useCounter —— 计数器</h2>
      <p class="desc">
        封装计数逻辑，<code>useCounter(5)</code> 从 5 开始计数。
      </p>

      <div class="demo-zone">
        <div class="counter-display">
          <div class="counter-value">
            <span class="number">{{ count }}</span>
            <span class="label">当前值</span>
          </div>
          <div class="counter-value">
            <span class="number double">{{ double }}</span>
            <span class="label">翻倍（computed）</span>
          </div>
        </div>

        <div class="btn-group">
          <button class="btn" @click="decrement">−1</button>
          <button class="btn" @click="increment">+1</button>
          <button class="btn add5" @click="add(5)">+5</button>
          <button class="btn reset-btn" @click="reset">重置</button>
        </div>

        <p class="hint">
          useCounter 返回：count({{ count }}) / double({{ double }}) / increment
          / decrement / reset / add
        </p>
      </div>
    </section>

    <!-- ============================================ -->
    <!-- 第二部分：useToggle -->
    <!-- ============================================ -->
    <section class="section">
      <h2>二、useToggle —— 开关</h2>
      <p class="desc">管理 true/false 状态，适合弹窗、菜单展开等场景。</p>

      <div class="demo-zone">
        <button class="btn" @click="toggleVisibility">
          {{ isVisible ? "隐藏内容" : "显示内容" }}
        </button>

        <!-- 用 v-show，体验 toggle 的效果 -->
        <div v-show="isVisible" class="toggle-content">
          <p>🎉 你通过 useToggle 控制了我的显示和隐藏！</p>
          <p class="hint">isVisible = {{ isVisible }}</p>
        </div>
      </div>
    </section>

    <!-- ============================================ -->
    <!-- 第三部分：useLocalStorage -->
    <!-- ============================================ -->
    <section class="section">
      <h2>三、useLocalStorage —— 数据持久化</h2>
      <p class="desc">数据自动同步到 localStorage，刷新页面不丢失。</p>

      <div class="demo-zone">
        <div class="form-row">
          <label>你的名字：</label>
          <input v-model="username" placeholder="输入名字..." />
        </div>
        <div class="form-row">
          <label>留言内容：</label>
          <textarea v-model="message" placeholder="写点什么..." rows="2" />
        </div>

        <div class="storage-result">
          <p><strong>当前数据：</strong></p>
          <p>用户名：{{ username || "（未填写）" }}</p>
          <p>留言：{{ message || "（未填写）" }}</p>
        </div>
        <button class="btn" @click="resetfny">清空数据</button>

        <p class="hint">刷新页面试试，数据还在！← 这就是 localStorage 的作用</p>
      </div>
    </section>

    <!-- ============================================ -->
    <!-- 第四部分：useMousePosition -->
    <!-- ============================================ -->
    <section class="section">
      <h2>四、useMousePosition —— 鼠标追踪</h2>
      <p class="desc">
        实时显示鼠标位置，展示了组合式函数中使用生命周期（onMounted /
        onUnmounted）。
      </p>

      <div class="demo-zone mouse-zone">
        <div class="mouse-info">
          <p>
            X：<strong>{{ x }}</strong> px
          </p>
          <p>
            Y：<strong>{{ y }}</strong> px
          </p>
        </div>
        <p class="hint">在页面上移动鼠标，坐标实时更新 ↑</p>
      </div>
    </section>

    <!-- ============================================ -->
    <!-- 代码展示区 -->
    <!-- ============================================ -->
    <section class="section">
      <h2>五、核心代码</h2>

      <div class="demo-zone code-zone">
        <h3>useCounter.js</h3>
        <pre><code>import { ref, computed } from 'vue'

export function useCounter(initialValue = 0) {
  const count = ref(initialValue)
  const double = computed(() => count.value * 2)

  function increment() { count.value++ }
  function decrement() { count.value-- }
  function reset() { count.value = initialValue }
  function add(amount) { count.value += amount }

  return { count, double, increment, decrement, reset, add }
}</code></pre>
      </div>

      <div class="demo-zone code-zone">
        <h3>在组件中使用</h3>
        <pre><code>import { useCounter } from "../composables/useCounter.js"

// 解构出需要的东西
const { count, double, increment, decrement, reset } = useCounter(5)</code></pre>
      </div>
    </section>
  </div>
</template>

<style scoped>
.demo-page {
  max-width: 860px;
  margin: 0 auto;
  padding: 30px;
}

h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 5px;
}

.subtitle {
  text-align: center;
  color: #999;
  font-size: 14px;
  margin-bottom: 30px;
}

.section {
  background: #f8f8f8;
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 25px;
  border: 2px solid #ddd;
}

.section h2 {
  color: #2c3e50;
  margin: 0 0 15px 0;
  font-size: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #42b883;
}

.desc {
  font-size: 13px;
  color: #999;
  margin: 0 0 15px 0;
}

.desc code {
  background: #e8e8e8;
  padding: 2px 6px;
  border-radius: 4px;
}

/* ===== 演示区域 ===== */
.demo-zone {
  background: white;
  border-radius: 8px;
  padding: 15px;
  border: 1px solid #eee;
  margin-bottom: 15px;
}

.demo-zone:last-child {
  margin-bottom: 0;
}

.demo-zone h3 {
  margin: 0 0 10px 0;
  font-size: 15px;
  color: #555;
}

/* ===== 计数器 ===== */
.counter-display {
  display: flex;
  gap: 30px;
  justify-content: center;
  margin-bottom: 20px;
}

.counter-value {
  text-align: center;
}

.number {
  display: block;
  font-size: 48px;
  font-weight: bold;
  color: #42b883;
}

.number.double {
  color: #e67e22;
}

.label {
  font-size: 12px;
  color: #999;
}

.btn-group {
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  padding: 8px 20px;
  border: none;
  border-radius: 6px;
  background: #42b883;
  color: white;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;
}

.btn:hover {
  background: #38a076;
}

.add5 {
  background: #3498db;
}

.add5:hover {
  background: #2980b9;
}

.reset-btn {
  background: #e74c3c;
}

.reset-btn:hover {
  background: #c0392b;
}

/* ===== Toggle ===== */
.toggle-content {
  margin-top: 15px;
  padding: 20px;
  background: #e8f8f5;
  border-radius: 8px;
  text-align: center;
  font-size: 16px;
}

.toggle-content p {
  margin: 5px 0;
}

/* ===== localStorage ===== */
.form-row {
  margin-bottom: 12px;
}

.form-row label {
  display: block;
  font-size: 13px;
  color: #555;
  margin-bottom: 4px;
}

.form-row input,
.form-row textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  box-sizing: border-box;
}

.form-row input:focus,
.form-row textarea:focus {
  outline: none;
  border-color: #42b883;
}

.storage-result {
  margin-top: 12px;
  padding: 12px;
  background: #f0f8ff;
  border-radius: 6px;
  font-size: 14px;
}

.storage-result p {
  margin: 3px 0;
}

/* ===== Mouse ===== */
.mouse-zone {
  min-height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.mouse-info {
  display: flex;
  gap: 30px;
  font-size: 24px;
}

.mouse-info strong {
  color: #e74c3c;
}

/* ===== Code ===== */
.code-zone pre {
  background: #2c3e50;
  color: #f8f8f2;
  padding: 15px;
  border-radius: 8px;
  overflow-x: auto;
  font-size: 13px;
  line-height: 1.5;
  margin: 0;
}

.code-zone code {
  font-family: "Courier New", Courier, monospace;
}

.hint {
  font-size: 12px;
  color: #999;
  margin-top: 8px;
  text-align: center;
}
</style>
