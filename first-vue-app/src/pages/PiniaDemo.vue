<!-- ============================================
  PiniaDemo.vue —— Pinia 状态管理演示页

  功能：
  1. 解释什么是"状态管理"（为什么要用）
  2. 手写方案 vs Pinia 方案对比
  3. Pinia 三核心：State / Getter / Action
  4. 计数器交互 Demo
  5. Auth Store 登录演示
  6. 在路由守卫中使用 Pinia
  7. DevTools 介绍
============================================ -->

<template>
  <div class="pinia-page">
    <!-- ============================================ -->
    <!-- 第一部分：概念讲解 -->
    <!-- ============================================ -->
    <h1>📦 Pinia 状态管理</h1>
    <p class="subtitle">把"共享数据"放到一个集中的地方，让所有组件都能访问</p>

    <div class="concept-card">
      <h2>什么是"状态管理"？</h2>

      <div class="analogy">
        <div class="analogy-text">
          <p><strong>大白话</strong>：状态管理就像商场的<strong>公共储物柜</strong>。</p>
          <ul>
            <li>你买完东西（某个组件产生的数据）→ 存到储物柜（Store）</li>
            <li>
              你老公要用（另一个组件需要数据）→ 去同一个储物柜取
            </li>
            <li>你退掉东西（修改数据）→ 储物柜自动更新，大家都看到最新状态</li>
          </ul>
          <p class="highlight">
            ✅ 没有 Pinia：数据在组件之间传来传去，像"人肉传话"<br />
            ✅ 有了 Pinia：数据放在 Store 里，谁用谁自己去拿
          </p>
        </div>
      </div>
    </div>

    <!-- ============================================ -->
    <!-- 第二部分：手写 vs Pinia 对比 -->
    <!-- ============================================ -->
    <div class="compare-card">
      <h2>手写方案 vs Pinia 方案</h2>
      <p class="compare-hint">以之前写的 useAuth.js 为例，看看用了 Pinia 有什么区别</p>

      <div class="compare-row">
        <div class="compare-side">
          <h3>❌ 手写方案（useAuth.js）</h3>
          <pre class="code-block">
// 1. 模块级 ref
const user = ref(null)

// 2. 需要单独导出 ref
//    因为路由守卫里不能用 useAuth()
export { user }

// 3. 还得写个 useAuth() 组合式
//    供组件用
export function useAuth() {
  const isLoggedIn = computed(...)
  function login() { ... }

  return { user, isLoggedIn, login }
}

// 4. 路由里要单独导入 user
import { user } from './useAuth.js'</pre>
        </div>

        <div class="compare-vs">
          <span class="vs-badge">VS</span>
        </div>

        <div class="compare-side">
          <h3>✅ Pinia 方案（auth Store）</h3>
          <pre class="code-block">
// 1. 全部用 defineStore 包裹
export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isLoggedIn = computed(...)

  function login() { ... }

  return { user, isLoggedIn, login }
})

// 2. 路由里直接 useAuthStore()
//    不需要额外导出！
import { useAuthStore } from './stores/auth'</pre>
        </div>
      </div>

      <div class="compare-summary">
        <p><strong>Pinia 的核心优势：</strong></p>
        <ol>
          <li><strong>统一 API</strong> —— 组件和路由都用 <code>useXxxStore()</code>，不再需要"额外导出"</li>
          <li><strong>DevTools 支持</strong> —— 可以查看、修改、时间旅行调试所有 state</li>
          <li><strong>类型推断</strong> —— TypeScript 项目里自动推导类型，不用手写接口</li>
          <li><strong>模块化</strong> —— 每个 Store 一个文件，按功能拆分，不像 vuex 那样要 mutations</li>
        </ol>
      </div>
    </div>

    <!-- ============================================ -->
    <!-- 第三部分：三核心概念 -->
    <!-- ============================================ -->
    <div class="core-card">
      <h2>Pinia 的三个核心</h2>

      <table class="core-table">
        <tr>
          <th>概念</th>
          <th>对应 Vue</th>
          <th>大白话</th>
          <th>注意</th>
        </tr>
        <tr>
          <td><span class="tag-state">State 状态</span></td>
          <td><code>ref()</code></td>
          <td>数据存在哪（储物格里的东西）</td>
          <td>直接修改：<code>store.count++</code></td>
        </tr>
        <tr>
          <td><span class="tag-getter">Getter 计算属性</span></td>
          <td><code>computed()</code></td>
          <td>数据怎么变形（标签上写的编号）</td>
          <td>自动缓存，依赖不变就不重算</td>
        </tr>
        <tr>
          <td><span class="tag-action">Action 动作</span></td>
          <td><code>function()</code></td>
          <td>怎么改数据（存/取东西的操作）</td>
          <td>普通函数，可异步（async/await）</td>
        </tr>
      </table>
    </div>

    <!-- ============================================ -->
    <!-- 第四部分：计数器 Demo（最直观的 Pinia 例子） -->
    <!-- ============================================ -->
    <div class="demo-card">
      <h2>🎮 计数器 —— 最简单直观的 Pinia 示例</h2>

      <div class="counter-box">
        <div class="counter-display">
          <div class="counter-section">
            <span class="counter-label">State：count</span>
            <span class="counter-value">{{ counter.count }}</span>
          </div>
          <div class="counter-section">
            <span class="counter-label">Getter：double（count × 2）</span>
            <span class="counter-value double">{{ counter.double }}</span>
          </div>
        </div>

        <div class="counter-buttons">
          <button @click="counter.decrement" class="btn-counter btn-minus">−</button>
          <button @click="counter.increment" class="btn-counter btn-plus">+</button>
          <button @click="counter.reset" class="btn-counter btn-reset">重置</button>
        </div>

        <div class="counter-input">
          <label>直接设置：</label>
          <input type="number" :value="counter.count" @input="handleSetCount" />
        </div>

        <div class="counter-code">
          <p>对应 Store 代码（<code>stores/counter.js</code>）：</p>
          <pre>
export const useCounterStore = defineStore('counter', () => {
  // State
  const count = ref(0)

  // Getter
  const double = computed(() => count.value * 2)

  // Action
  function increment() { count.value++ }
  function decrement() { count.value-- }
  function reset() { count.value = 0 }

  return { count, double, increment, decrement, reset }
})</pre>
        </div>
      </div>
    </div>

    <!-- ============================================ -->
    <!-- 第五部分：Auth Store 演示 -->
    <!-- ============================================ -->
    <div class="auth-demo-card">
      <h2>🔐 Auth Store —— 管理登录状态</h2>

      <div class="auth-status" :class="authStore.isLoggedIn ? 'logged-in' : 'logged-out'">
        <div class="auth-status-header">
          <span class="auth-badge" :class="authStore.isLoggedIn ? 'badge-in' : 'badge-out'">
            {{ authStore.isLoggedIn ? '✅ 已登录' : '❌ 未登录' }}
          </span>
          <span class="auth-user" v-if="authStore.isLoggedIn">
            用户：<strong>{{ authStore.username }}</strong>
          </span>
        </div>

        <div class="auth-actions">
          <div v-if="!authStore.isLoggedIn" class="auth-form">
            <input v-model="loginName" placeholder="输入用户名" />
            <button @click="handleLogin" class="btn-login-sm">登录</button>
          </div>
          <button v-else @click="handleLogout" class="btn-logout-sm">退出登录</button>
        </div>
      </div>

      <!-- Store 源码对比 -->
      <div class="code-compare">
        <h3>useAuth.js（手写）vs stores/auth.js（Pinia）</h3>
        <div class="code-row">
          <div class="code-side">
            <h4>❌ 手写方案的问题</h4>
            <pre>
// useAuth.js 需要额外导出 user
// 因为路由里不能调用 useAuth()
export { user }
export function useAuth() {
  ...
}

// 路由里：
import { user } from './useAuth'
// ↑ 要在守卫里访问 user.value</pre>
          </div>
          <div class="code-side">
            <h4>✅ Pinia 统一调用</h4>
            <pre>
// 组件里：
const authStore = useAuthStore()
authStore.isLoggedIn  // ✅

// 路由守卫里：
const authStore = useAuthStore()
authStore.isLoggedIn  // ✅ 一样！

// 不需要额外导出 ref！
// 不需要两种导入方式！</pre>
          </div>
        </div>
      </div>
    </div>

    <!-- ============================================ -->
    <!-- 第六部分：在路由守卫中使用 -->
    <!-- ============================================ -->
    <div class="router-card">
      <h2>🛡️ 在路由守卫中使用 Pinia</h2>
      <p class="router-hint">
        这是 Pinia 最大的好处之一：在路由守卫里调用 Store 跟组件里完全一样！
      </p>

      <pre class="code-block">
// router/index.js —— 路由守卫
import { useAuthStore } from '../stores/auth.js'

router.beforeEach((to, from) => {
  // ★ 直接在守卫里调用 useAuthStore()
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    // 没登录 → 重定向
    return { name: 'login', query: { redirect: to.fullPath } }
  }
})</pre>

      <div class="key-point">
        <p><strong>💡 关键区别</strong></p>
        <p>之前手写方案需要在 useAuth.js 里多导出一个 <code>user</code> ref，</p>
        <p>因为路由守卫里<strong>不能</strong>调用 <code>useAuth()</code>（会报错）。</p>
        <p>用了 Pinia 之后，<code>useAuthStore()</code> 在<strong>任何地方都能用</strong>！</p>
      </div>
    </div>

    <!-- ============================================ -->
    <!-- 第七部分：DevTools -->
    <!-- ============================================ -->
    <div class="devtools-card">
      <h2>🔧 Vue DevTools + Pinia</h2>
      <p>安装 Vue DevTools 浏览器扩展后，可以看到 Pinia 的完整状态：</p>

      <table class="devtools-table">
        <tr>
          <th>功能</th>
          <th>说明</th>
        </tr>
        <tr>
          <td>查看 State</td>
          <td>实时看到所有 Store 的当前数据</td>
        </tr>
        <tr>
          <td>修改 State</td>
          <td>直接在 DevTools 里改值，页面实时更新</td>
        </tr>
        <tr>
          <td>时间旅行</td>
          <td>回退到某个操作之前，观察状态变化</td>
        </tr>
        <tr>
          <td>追踪 Action</td>
          <td>看到每次 action 调用、谁调用的、传了什么参</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useCounterStore } from "../stores/counter.js";
import { useAuthStore } from "../stores/auth.js";

// ===== 计数器 Store =====
const counter = useCounterStore();

function handleSetCount(e) {
  const val = parseInt(e.target.value);
  if (!isNaN(val)) {
    counter.setCount(val);
  }
}

// ===== Auth Store =====
const authStore = useAuthStore();
const loginName = ref("");

function handleLogin() {
  if (loginName.value) {
    authStore.login(loginName.value);
  }
}

function handleLogout() {
  authStore.logout();
}
</script>

<style scoped>
.pinia-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 30px;
}

h1 {
  color: #42b883;
  text-align: center;
  margin-bottom: 10px;
}

.subtitle {
  text-align: center;
  color: #999;
  margin-bottom: 30px;
}

/* ===== 通用卡片 ===== */
.concept-card,
.compare-card,
.core-card,
.demo-card,
.auth-demo-card,
.router-card,
.devtools-card {
  background: #f8f8f8;
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 25px;
}

/* ===== 概念卡片 ===== */
.concept-card {
  border: 2px solid #42b883;
}
.concept-card h2 { color: #42b883; }

.analogy ul {
  padding-left: 20px;
  line-height: 2;
}

.analogy li {
  font-size: 14px;
  color: #555;
}

.highlight {
  background: #fff3cd;
  padding: 12px;
  border-radius: 6px;
  font-size: 14px;
  line-height: 1.8;
  margin-top: 10px;
}

/* ===== 对比卡片 ===== */
.compare-card {
  border: 2px solid #e67e22;
}
.compare-card h2 { color: #e67e22; }

.compare-hint {
  font-size: 14px;
  color: #999;
  margin-bottom: 20px;
}

.compare-row {
  display: flex;
  gap: 15px;
  align-items: stretch;
}

.compare-side {
  flex: 1;
}

.compare-side h3 {
  font-size: 14px;
  margin-bottom: 10px;
}

.compare-vs {
  display: flex;
  align-items: center;
  justify-content: center;
}

.vs-badge {
  display: inline-block;
  background: #e67e22;
  color: white;
  padding: 5px 12px;
  border-radius: 15px;
  font-weight: bold;
  font-size: 14px;
}

.code-block {
  background: #1e1e1e;
  color: #0f0;
  padding: 15px;
  border-radius: 8px;
  font-family: monospace;
  font-size: 12px;
  line-height: 1.6;
  overflow-x: auto;
  white-space: pre-wrap;
}

.compare-summary {
  margin-top: 20px;
  padding: 15px;
  background: #e8f5e9;
  border-radius: 8px;
}

.compare-summary ol {
  padding-left: 20px;
  line-height: 2;
}

.compare-summary li {
  font-size: 14px;
}

.compare-summary code {
  background: #d0ebd6;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 13px;
}

/* ===== 核心概念卡片 ===== */
.core-card {
  border: 2px solid #3498db;
}
.core-card h2 { color: #3498db; }

.core-table {
  width: 100%;
  border-collapse: collapse;
}

.core-table th,
.core-table td {
  padding: 12px;
  border: 1px solid #ddd;
  text-align: left;
}

.core-table th {
  background: #3498db;
  color: white;
}

.core-table td {
  font-size: 14px;
}

.core-table code { font-size: 13px; }

.tag-state {
  display: inline-block;
  background: #42b883;
  color: white;
  padding: 3px 10px;
  border-radius: 10px;
  font-size: 13px;
}

.tag-getter {
  display: inline-block;
  background: #3498db;
  color: white;
  padding: 3px 10px;
  border-radius: 10px;
  font-size: 13px;
}

.tag-action {
  display: inline-block;
  background: #e67e22;
  color: white;
  padding: 3px 10px;
  border-radius: 10px;
  font-size: 13px;
}

/* ===== 计数器 Demo ===== */
.demo-card {
  border: 2px solid #9b59b6;
}
.demo-card h2 { color: #9b59b6; }

.counter-box {
  background: white;
  border-radius: 10px;
  padding: 25px;
  border: 1px solid #eee;
}

.counter-display {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.counter-section {
  flex: 1;
  text-align: center;
  padding: 20px;
  background: #f8f8f8;
  border-radius: 8px;
}

.counter-label {
  display: block;
  font-size: 13px;
  color: #999;
  margin-bottom: 10px;
}

.counter-value {
  display: block;
  font-size: 48px;
  font-weight: bold;
  color: #42b883;
}

.counter-value.double {
  color: #9b59b6;
}

.counter-buttons {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-bottom: 20px;
}

.btn-counter {
  width: 60px;
  height: 60px;
  border: none;
  border-radius: 50%;
  font-size: 24px;
  font-weight: bold;
  color: white;
  cursor: pointer;
  transition: transform 0.2s;
}

.btn-counter:hover {
  transform: scale(1.1);
}

.btn-plus {
  background: #42b883;
}

.btn-minus {
  background: #e74c3c;
}

.btn-reset {
  width: auto;
  padding: 0 25px;
  border-radius: 30px;
  background: #95a5a6;
  font-size: 16px;
}

.counter-input {
  text-align: center;
  margin-bottom: 20px;
}

.counter-input label {
  font-size: 14px;
  color: #666;
  margin-right: 10px;
}

.counter-input input {
  width: 100px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
  text-align: center;
}

.counter-code {
  background: #1e1e1e;
  border-radius: 8px;
  padding: 15px;
}

.counter-code p {
  color: #42b883;
  font-size: 13px;
  margin-bottom: 10px;
}

.counter-code code {
  color: #0f0;
}

.counter-code pre {
  color: #0f0;
  font-family: monospace;
  font-size: 12px;
  line-height: 1.6;
}

/* ===== Auth Demo ===== */
.auth-demo-card {
  border: 2px solid #e74c3c;
}
.auth-demo-card h2 { color: #e74c3c; }

.auth-status {
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
  transition: all 0.3s;
}

.auth-status.logged-in {
  background: #f0f9f4;
  border: 1px solid #42b883;
}

.auth-status.logged-out {
  background: #fdf0ef;
  border: 1px solid #e74c3c;
}

.auth-status-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}

.auth-badge {
  padding: 5px 15px;
  border-radius: 15px;
  font-size: 14px;
  font-weight: bold;
}

.badge-in {
  background: #42b883;
  color: white;
}

.badge-out {
  background: #e74c3c;
  color: white;
}

.auth-user {
  font-size: 15px;
  color: #333;
}

.auth-form {
  display: flex;
  gap: 10px;
}

.auth-form input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
}

.btn-login-sm {
  padding: 10px 25px;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.btn-login-sm:hover { background: #3aa876; }

.btn-logout-sm {
  padding: 10px 25px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.btn-logout-sm:hover { background: #c0392b; }

/* 代码对比 */
.code-compare h3 {
  font-size: 15px;
  margin-bottom: 15px;
}

.code-row {
  display: flex;
  gap: 15px;
}

.code-side {
  flex: 1;
}

.code-side h4 {
  font-size: 13px;
  margin-bottom: 8px;
  color: #666;
}

.code-side pre {
  background: #1e1e1e;
  color: #0f0;
  padding: 12px;
  border-radius: 8px;
  font-family: monospace;
  font-size: 11px;
  line-height: 1.5;
  white-space: pre-wrap;
}

/* ===== 路由守卫中使用的卡片 ===== */
.router-card {
  border: 2px solid #2c3e50;
}
.router-card h2 { color: #2c3e50; }

.router-hint {
  font-size: 14px;
  color: #999;
  margin-bottom: 15px;
}

.key-point {
  margin-top: 15px;
  padding: 15px;
  background: #fff3cd;
  border-radius: 8px;
  font-size: 14px;
  line-height: 1.8;
  color: #856404;
}

/* ===== DevTools ===== */
.devtools-card {
  border: 2px solid #2ecc71;
}
.devtools-card h2 { color: #2ecc71; }

.devtools-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
}

.devtools-table th,
.devtools-table td {
  padding: 12px;
  border: 1px solid #ddd;
  text-align: left;
}

.devtools-table th {
  background: #2ecc71;
  color: white;
}

.devtools-table td {
  font-size: 14px;
}
</style>
