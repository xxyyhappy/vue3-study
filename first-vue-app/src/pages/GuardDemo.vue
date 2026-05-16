<!-- ============================================
  GuardDemo.vue —— 路由守卫演示页

  功能：
  1. 解释路由守卫的概念（类比：商场保安）
  2. 显示三种守卫的对比
  3. 实时登录/登出
  4. 展示哪些路由需要登录
  5. 测试按钮：访问受保护页面
  6. 实时守卫日志（看 beforeEach 的拦截过程）
============================================ -->

<template>
  <div class="guard-page">
    <!-- ============================================ -->
    <!-- 第一部分：概念讲解 -->
    <!-- ============================================ -->
    <h1>🛡️ 路由守卫</h1>
    <p class="subtitle">进入页面前的"安检"—— 谁可以进，谁不可以进</p>

    <div class="concept-card">
      <h2>什么是路由守卫？</h2>
      <div class="analogy">
        <div class="analogy-text">
          <p><strong>大白话</strong>：路由守卫就像商场的<strong>门口保安</strong>。</p>
          <ul>
            <li>你进商场（访问页面）→ 保安拦住你检查（守卫触发）</li>
            <li>保安看你是不是会员 → <code>to.meta.requiresAuth</code></li>
            <li>是会员 ✅ → 放行！→ <code>return true</code></li>
            <li>不是会员 ❌ → 请去办卡 → <code>return { name: 'login' }</code></li>
          </ul>
        </div>
        <div class="analogy-code">
          <pre>
router.beforeEach((to) =&gt; {
  if (to.meta.requiresAuth &amp;&amp; 没登录) {
    return '/login'  // 拦截！
  }
  // 否则放行
})</pre>
        </div>
      </div>
    </div>

    <!-- ============================================ -->
    <!-- 第二部分：三种守卫对比 -->
    <!-- ============================================ -->
    <div class="types-card">
      <h2>三种路由守卫</h2>
      <table class="types-table">
        <thead>
          <tr>
            <th>类型</th>
            <th>写法</th>
            <th>作用</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><span class="tag-green">全局前置守卫</span></td>
            <td><code>router.beforeEach()</code></td>
            <td>每次跳转前执行 —— 最常用！能拦截</td>
          </tr>
          <tr>
            <td><span class="tag-blue">全局后置钩子</span></td>
            <td><code>router.afterEach()</code></td>
            <td>跳转完成后执行 —— 不能拦截，用来改标题、记日志</td>
          </tr>
          <tr>
            <td><span class="tag-orange">路由独享守卫</span></td>
            <td><code>beforeEnter</code></td>
            <td>写在某个路由上，只有访问这个路由时触发</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- ============================================ -->
    <!-- 第三部分：当前状态 + 登录/登出 -->
    <!-- ============================================ -->
    <div class="status-card" :class="authStore.isLoggedIn ? 'logged-in' : 'logged-out'">
      <div class="status-header">
        <h2>当前状态</h2>
        <span class="status-badge" :class="authStore.isLoggedIn ? 'badge-in' : 'badge-out'">
          {{ authStore.isLoggedIn ? '✅ 已登录' : '❌ 未登录' }}
        </span>
      </div>

      <p v-if="authStore.isLoggedIn" class="status-text">
        当前用户：<strong>{{ authStore.username }}</strong>
      </p>
      <p v-else class="status-text">
        试试访问"控制面板"或"账号设置"—— 会被守卫拦截！
      </p>

      <div class="auth-buttons">
        <button v-if="!authStore.isLoggedIn" @click="handleLogin" class="btn-login">
          模拟登录
        </button>
        <button v-if="authStore.isLoggedIn" @click="handleLogout" class="btn-logout-sm">
          退出登录
        </button>
      </div>

      <!-- 登录提示 -->
      <p v-if="loginMsg" class="login-msg">{{ loginMsg }}</p>
    </div>

    <!-- ============================================ -->
    <!-- 第四部分：路由权限表 -->
    <!-- ============================================ -->
    <div class="routes-card">
      <h2>路由权限一览</h2>
      <table class="routes-table">
        <thead>
          <tr>
            <th>路径</th>
            <th>需要登录？</th>
            <th>说明</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="rt in routeList" :key="rt.path">
            <td><code>{{ rt.path }}</code></td>
            <td>
              <span :class="rt.auth ? 'tag-yes' : 'tag-no'">
                {{ rt.auth ? '是' : '否' }}
              </span>
            </td>
            <td class="route-desc">{{ rt.desc }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- ============================================ -->
    <!-- 第五部分：测试按钮 -->
    <!-- ============================================ -->
    <div class="test-card">
      <h2>试试看</h2>
      <p class="test-hint">点击下面的按钮，观察路由守卫是怎么工作的</p>

      <div class="test-buttons">
        <button @click="goTo('/dashboard')" class="btn-test">
          访问 /dashboard（需登录）
        </button>
        <button @click="goTo('/user-center/settings')" class="btn-test">
          访问 /user-center/settings（需登录）
        </button>
        <button @click="goTo('/user-center/orders')" class="btn-test">
          访问 /user-center/orders（需登录）
        </button>
        <button @click="goTo('/user-center')" class="btn-test btn-public">
          访问 /user-center（公开）
        </button>
        <button @click="goTo('/about')" class="btn-test btn-public">
          访问 /about（公开）
        </button>
      </div>

      <div class="test-tip">
        <p>💡 打开浏览器控制台（F12 → Console），可以看到 beforeEach 的日志输出</p>
      </div>
    </div>

    <!-- ============================================ -->
    <!-- 第六部分：完整代码示例 -->
    <!-- ============================================ -->
    <div class="code-card">
      <h2>路由守卫完整代码</h2>
      <p class="code-hint">下面是我们项目 <code>router/index.js</code> 中的守卫代码：</p>

      <!-- beforeEach -->
      <h3>① 全局前置守卫 <code>router.beforeEach()</code></h3>
      <pre class="code-block">
router.beforeEach((to, from) =&gt; {
  // 判断是否已登录
  const authStore.isLoggedIn = user.value !== null

  // 如果目标页面需要登录，但没登录 → 拦截去登录页
  if (to.meta.requiresAuth &amp;&amp; !authStore.isLoggedIn) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  // 默认放行
})</pre>

      <!-- afterEach -->
      <h3>② 全局后置钩子 <code>router.afterEach()</code></h3>
      <pre class="code-block">
router.afterEach((to, from) =&gt; {
  // 设置页面标题
  document.title = to.meta?.title
    ? `${to.meta.title} - Vue 学习`
    : 'Vue 学习'
})</pre>

      <!-- 路由配置 -->
      <h3>③ 路由配置（meta 标记）</h3>
      <pre class="code-block">
{
  path: '/dashboard',
  name: 'dashboard',
  component: Dashboard,
  meta: { requiresAuth: true }  // ← 标记需要登录
}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// 登录/登出
const loginMsg = ref('')

function handleLogin() {
  authStore.login('小明')
  loginMsg.value = '✅ 已登录为：小明。现在试试访问受保护页面！'
}

function handleLogout() {
  authStore.logout()
  loginMsg.value = '已退出登录'
}

// 跳转到目标页面
function goTo(path) {
  router.push(path)
}

// 路由权限列表
const routeList = [
  { path: '/',             auth: false, desc: '首页（公开）' },
  { path: '/about',        auth: false, desc: '关于页（公开）' },
  { path: '/login',        auth: false, desc: '登录页（公开）' },
  { path: '/dashboard',    auth: true,  desc: '控制面板（需登录）' },
  { path: '/user-center/settings', auth: true, desc: '账号设置（需登录）' },
  { path: '/user-center/orders',   auth: true, desc: '我的订单（需登录）' },
]
</script>

<style scoped>
.guard-page {
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

/* ===== 卡片通用 ===== */
.concept-card,
.types-card,
.status-card,
.routes-card,
.test-card,
.code-card {
  background: #f8f8f8;
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 25px;
}

.card h2 {
  margin-bottom: 15px;
  font-size: 18px;
}

/* ===== 概念卡片 ===== */
.concept-card {
  border: 2px solid #42b883;
}
.concept-card h2 { color: #42b883; }

.analogy {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.analogy-text {
  flex: 1;
}

.analogy-text ul {
  padding-left: 20px;
  line-height: 2;
}

.analogy-text li {
  font-size: 14px;
  color: #555;
}

.analogy-code {
  flex: 1;
}

.analogy-code pre {
  background: #1e1e1e;
  color: #0f0;
  padding: 15px;
  border-radius: 8px;
  font-size: 13px;
  line-height: 1.6;
}

/* ===== 类型卡片 ===== */
.types-card {
  border: 2px solid #3498db;
}
.types-card h2 { color: #3498db; }

.types-table {
  width: 100%;
  border-collapse: collapse;
}

.types-table th,
.types-table td {
  padding: 12px;
  border: 1px solid #ddd;
  text-align: left;
}

.types-table th {
  background: #3498db;
  color: white;
}

.types-table td { font-size: 14px; }

.types-table code { font-size: 13px; }

.tag-green {
  display: inline-block;
  background: #42b883;
  color: white;
  padding: 3px 10px;
  border-radius: 10px;
  font-size: 13px;
}

.tag-blue {
  display: inline-block;
  background: #3498db;
  color: white;
  padding: 3px 10px;
  border-radius: 10px;
  font-size: 13px;
}

.tag-orange {
  display: inline-block;
  background: #e67e22;
  color: white;
  padding: 3px 10px;
  border-radius: 10px;
  font-size: 13px;
}

/* ===== 状态卡片 ===== */
.status-card {
  border: 2px solid #ddd;
  transition: border-color 0.3s;
}

.status-card.logged-in {
  border-color: #42b883;
  background: #f0f9f4;
}

.status-card.logged-out {
  border-color: #e74c3c;
  background: #fdf0ef;
}

.status-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.status-header h2 {
  margin: 0;
  font-size: 18px;
}

.status-badge {
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

.status-text {
  font-size: 14px;
  margin-bottom: 15px;
}

.auth-buttons {
  display: flex;
  gap: 10px;
}

.btn-login {
  padding: 10px 25px;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 15px;
}

.btn-login:hover {
  background: #3aa876;
}

.btn-logout-sm {
  padding: 10px 25px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 15px;
}

.btn-logout-sm:hover {
  background: #c0392b;
}

.login-msg {
  margin-top: 12px;
  padding: 8px 12px;
  border-radius: 6px;
  background: rgba(255,255,255,0.7);
  font-size: 14px;
  color: #333;
}

/* ===== 路由权限表 ===== */
.routes-card {
  border: 2px solid #9b59b6;
}
.routes-card h2 { color: #9b59b6; }

.routes-table {
  width: 100%;
  border-collapse: collapse;
}

.routes-table th,
.routes-table td {
  padding: 10px;
  border: 1px solid #ddd;
  text-align: left;
}

.routes-table th {
  background: #9b59b6;
  color: white;
}

.routes-table td { font-size: 14px; }

.routes-table code { font-size: 13px; }

.tag-yes {
  display: inline-block;
  background: #e74c3c;
  color: white;
  padding: 2px 10px;
  border-radius: 8px;
  font-size: 13px;
}

.tag-no {
  display: inline-block;
  background: #95a5a6;
  color: white;
  padding: 2px 10px;
  border-radius: 8px;
  font-size: 13px;
}

.route-desc {
  color: #777;
  font-size: 13px;
}

/* ===== 测试卡片 ===== */
.test-card {
  border: 2px solid #e67e22;
}
.test-card h2 { color: #e67e22; }

.test-hint {
  font-size: 14px;
  color: #999;
  margin-bottom: 15px;
}

.test-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.btn-test {
  padding: 12px;
  background: #e67e22;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  text-align: left;
}

.btn-test:hover {
  background: #d35400;
}

.btn-public {
  background: #95a5a6;
}

.btn-public:hover {
  background: #7f8c8d;
}

.test-tip {
  margin-top: 15px;
  padding: 10px;
  background: #fff3cd;
  border-radius: 6px;
  font-size: 14px;
  color: #856404;
}

/* ===== 代码卡片 ===== */
.code-card {
  border: 2px solid #2c3e50;
}
.code-card h2 { color: #2c3e50; }

.code-hint {
  font-size: 14px;
  color: #999;
  margin-bottom: 20px;
}

.code-card h3 {
  font-size: 15px;
  color: #333;
  margin: 20px 0 10px;
}

.code-card h3 code {
  background: #eee;
  padding: 2px 6px;
  border-radius: 3px;
}

.code-block {
  background: #1e1e1e;
  color: #0f0;
  padding: 15px;
  border-radius: 8px;
  font-family: monospace;
  font-size: 13px;
  line-height: 1.6;
  overflow-x: auto;
}
</style>
