<!-- ============================================
  Login.vue —— 登录页（编程式导航演示）

  功能：
  1. 输入用户名和密码
  2. 点击登录按钮 → 登录成功后自动跳转首页
  3. 展示 router.push() 的多种跳转方式
  4. 展示 push vs replace 的区别
  5. 展示 back / forward / go 的用法
============================================ -->

<template>
  <div class="login-page">
    <h1>🔑 登录页</h1>
    <p class="subtitle">编程式导航演示 —— 用 JS 代码控制页面跳转</p>

    <!-- ===== 路由守卫重定向提示 ===== -->
    <div class="redirect-notice" v-if="redirectPath !== '/'">
      <p>🔒 请先登录以访问 <strong>{{ redirectPath }}</strong></p>
    </div>

    <!-- ===== 登录表单 ===== -->
    <div class="login-card">
      <h2>模拟登录</h2>

      <!-- 用户名输入框 -->
      <div class="form-group">
        <label>用户名：</label>
        <input type="text" v-model="username" placeholder="输入任意用户名" />
      </div>

      <!-- 密码输入框 -->
      <div class="form-group">
        <label>密码：</label>
        <input type="password" v-model="password" placeholder="输入任意密码" />
      </div>

      <!-- 登录按钮 -->
      <button @click="handleLogin" class="btn-login">登录（push 跳转）</button>

      <!-- 登录并替换按钮 -->
      <button @click="handleLoginReplace" class="btn-replace">
        登录（replace 跳转）
      </button>

      <!-- 登录结果提示 -->
      <p class="result" v-if="loginResult">{{ loginResult }}</p>
    </div>

    <!-- ===== push vs replace 对比 ===== -->
    <div class="explain-card">
      <h2>push vs replace 的区别</h2>
      <table class="compare-table">
        <tr>
          <th>方法</th>
          <th>效果</th>
          <th>能后退吗？</th>
          <th>适用场景</th>
        </tr>
        <tr>
          <td>router.push()</td>
          <td>添加一条新的历史记录</td>
          <td>✅ 能后退</td>
          <td>普通跳转（大部分场景）</td>
        </tr>
        <tr>
          <td>router.replace()</td>
          <td>替换当前历史记录</td>
          <td>❌ 不能后退</td>
          <td>登录后不应该回到登录页</td>
        </tr>
      </table>
      <p class="tip">
        💡 登录后用 replace 跳转：这样点"后退"不会回到登录页（更安全）
      </p>
    </div>

    <!-- ===== 跳转方式演示 ===== -->
    <div class="demo-card">
      <h2>各种跳转方式演示</h2>

      <!-- 方式1：字符串路径跳转 -->
      <button @click="goByPath" class="btn-demo">
        push('/') — 字符串路径跳首页
      </button>

      <!-- 方式2：对象 + 路径跳转 -->
      <button @click="goByPathObj" class="btn-demo">
        push({ path: '/about' }) — 对象跳关于页
      </button>

      <!-- 方式3：对象 + 路由名字跳转（推荐！） -->
      <button @click="goByName" class="btn-demo">
        push({ name: 'product', params: { id: 2 } }) — 按名字跳商品2
      </button>

      <!-- 方式4：带查询参数跳转 -->
      <button @click="goWithQuery" class="btn-demo">
        push({ path: '/about', query: { from: 'login' } }) — 带查询参数
      </button>

      <!-- 后退 / 前进 -->
      <div class="nav-group">
        <button @click="goBack" class="btn-nav">← back() 后退一步</button>
        <button @click="goForward" class="btn-nav">→ forward() 前一步</button>
        <button @click="goMinus2" class="btn-nav">go(-2) 后退两步</button>
      </div>

      <!-- 跳转日志 -->
      <div class="log-area" v-if="logs.length > 0">
        <p class="log-title">操作日志：</p>
        <p v-for="(log, index) in logs" :key="index" class="log-item">
          {{ log }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "../stores/auth.js";

// ===== 表单数据 =====
const username = ref("");
const password = ref("");
const loginResult = ref("");
const logs = ref([]); // 记录每次跳转操作，方便观察

// ===== 获取路由工具 =====
const router = useRouter(); // "动" —— 执行跳转
const route = useRoute(); // "看" —— 读取当前 URL 信息

// ===== auth Store（Pinia 状态管理）=====
const authStore = useAuthStore()

// ===== 登录成功后跳转的目标页 =====
// 如果 URL 上有 ?redirect=/dashboard，说明是路由守卫重定向过来的
// 登录成功后应该跳回那个页面
const redirectPath = route.query.redirect || "/"

// ===== 登录（push 跳转） =====
// push：添加历史记录，登录后能点"后退"回到登录页
function handleLogin() {
  if (!username.value || !password.value) {
    loginResult.value = "⚠️ 请输入用户名和密码";
    return;
  }

  // 写入登录状态
  authStore.login(username.value)

  loginResult.value = `✅ 登录成功！3 秒后跳转（push）到 ${redirectPath}`;
  addLog(`登录成功，3秒后 push 跳转到 ${redirectPath}`);

  // 模拟：3 秒后自动跳转
  setTimeout(() => {
    router.push(redirectPath); // push：能后退到登录页
  }, 3000);
}

// ===== 登录（replace 跳转） =====
// replace：替换历史记录，登录后不能点"后退"回到登录页
function handleLoginReplace() {
  if (!username.value || !password.value) {
    loginResult.value = "⚠️ 请输入用户名和密码";
    return;
  }

  // 写入登录状态
  authStore.login(username.value)

  loginResult.value = `✅ 登录成功！3 秒后跳转（replace）到 ${redirectPath}`;
  addLog(`登录成功，3秒后 replace 跳转到 ${redirectPath}`);

  setTimeout(() => {
    router.replace(redirectPath); // replace：不能后退到登录页
  }, 3000);
}

// ===== 各种跳转方式 =====

// 方式1：字符串路径
function goByPath() {
  loginResult.value = 'push("/") — 字符串路径跳首页';
  setTimeout(() => {
    addLog('push("/") — 字符串路径跳首页');
    router.push("/");
  }, 5000);
}

// 方式2：对象 + 路径
function goByPathObj() {
  router.push({ path: "/about" });
  addLog('push({ path: "/about" }) — 对象跳关于页');
}

// 方式3：对象 + 路由名字（推荐）
function goByName() {
  router.push({ name: "product", params: { id: 2 } });
  addLog('push({ name: "product", params: { id: 2 } }) — 按名字跳商品2');
}

// 方式4：带查询参数
// 跳转后 URL 会变成 /about?from=login
function goWithQuery() {
  router.push({ path: "/about", query: { from: "login" } });
  addLog('push({ path: "/about", query: { from: "login" } }) — 带查询参数');
}

// 后退 / 前进
function goBack() {
  router.back();
  addLog("back() — 后退一步");
}

function goForward() {
  router.forward();
  addLog("forward() — 前进一步");
}
function goForward2() {
  router.forward(2);
  addLog("forward() — 前进一步");
}

function goMinus2() {
  router.go(-2);
  addLog("go(-2) — 后退两步");
}

// 添加日志
function addLog(msg) {
  logs.value.push(`[${new Date().toLocaleTimeString()}] ${msg}`);
}
</script>

<style scoped>
.login-page {
  max-width: 700px;
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

/* 重定向提示 */
.redirect-notice {
  background: #fff3cd;
  border: 1px solid #ffc107;
  border-radius: 8px;
  padding: 12px 15px;
  margin-bottom: 20px;
  text-align: center;
  font-size: 15px;
  color: #856404;
}

/* 登录卡片 */
.login-card {
  background: #f8f8f8;
  border: 2px solid #42b883;
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 25px;
}

.login-card h2 {
  color: #42b883;
  margin-bottom: 20px;
  text-align: center;
}

/* 表单 */
.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  color: #666;
  font-size: 14px;
  margin-bottom: 5px;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
}

/* 登录按钮 */
.btn-login {
  width: 100%;
  padding: 12px;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 10px;
}

.btn-login:hover {
  background: #3aa876;
}

/* 替换登录按钮（用蓝色区分） */
.btn-replace {
  width: 100%;
  padding: 12px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 10px;
}

.btn-replace:hover {
  background: #2980b9;
}

/* 登录结果 */
.result {
  text-align: center;
  padding: 10px;
  background: #e8f5e9;
  border-radius: 6px;
  color: #42b883;
  margin-top: 10px;
}

/* 对比说明卡片 */
.explain-card {
  background: #f8f8f8;
  border: 2px solid #e74c3c;
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 25px;
}

.explain-card h2 {
  color: #e74c3c;
  margin-bottom: 15px;
}

/* 对比表格 */
.compare-table {
  width: 100%;
  border-collapse: collapse;
}

.compare-table th,
.compare-table td {
  padding: 10px;
  border: 1px solid #ddd;
  text-align: center;
}

.compare-table th {
  background: #e74c3c;
  color: white;
}

.tip {
  background: #fff3cd;
  padding: 10px;
  border-radius: 6px;
  margin-top: 15px;
  color: #856404;
}

/* 跳转演示卡片 */
.demo-card {
  background: #f8f8f8;
  border: 2px solid #3498db;
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 25px;
}

.demo-card h2 {
  color: #3498db;
  margin-bottom: 20px;
}

/* 演示按钮 */
.btn-demo {
  width: 100%;
  padding: 12px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  margin-bottom: 10px;
  text-align: left;
}

.btn-demo:hover {
  background: #2980b9;
}

/* 后退/前进按钮组 */
.nav-group {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.btn-nav {
  padding: 10px 15px;
  background: #f39c12;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
}

.btn-nav:hover {
  background: #e67e22;
}

/* 日志区域 */
.log-area {
  background: #1e1e1e;
  color: #0f0;
  padding: 15px;
  border-radius: 8px;
  margin-top: 20px;
  font-family: monospace;
}

.log-title {
  color: #42b883;
  font-weight: bold;
  margin-bottom: 10px;
}

.log-item {
  font-size: 13px;
  margin-bottom: 5px;
}
</style>
