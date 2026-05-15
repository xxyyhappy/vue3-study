<!-- ============================================
  Dashboard.vue —— 受保护页面（需要登录才能访问）

  功能：
  1. 只有登录用户才能看到这个页面
  2. 未登录直接访问 → 被路由守卫拦截 → 跳转到登录页
  3. 登录后自动跳转回来（通过 ?redirect= 参数）
  4. 显示当前用户信息
============================================ -->

<template>
  <div class="dashboard-page">
    <h1>📊 控制面板</h1>
    <p class="subtitle">
      这个页面只有登录后才能看到（路由守卫的功劳！）
    </p>

    <!-- 用户信息卡片 -->
    <div class="info-card">
      <div class="avatar">
        {{ authStore.username.charAt(0).toUpperCase() }}
      </div>
      <div class="user-info">
        <h2>欢迎回来，{{ authStore.username }}！</h2>
        <p>你已成功登录，可以看到这个受保护的页面。</p>
      </div>
    </div>

    <!-- 模拟面板内容 -->
    <div class="stats-row">
      <div class="stat-card">
        <span class="stat-number">42</span>
        <span class="stat-label">项目数</span>
      </div>
      <div class="stat-card">
        <span class="stat-number">128</span>
        <span class="stat-label">任务数</span>
      </div>
      <div class="stat-card">
        <span class="stat-number">7</span>
        <span class="stat-label">进行中</span>
      </div>
    </div>

    <!-- 路由守卫信息 -->
    <div class="guard-info">
      <h3>🛡️ 你是怎么到这的？</h3>
      <ol>
        <li>
          <strong>路由守卫</strong>（<code>router.beforeEach</code>）检查了你是否已登录
        </li>
        <li>
          因为你已登录，守卫<strong>放行</strong>了
        </li>
        <li>
          如果没有登录，守卫会把你重定向到<strong>登录页</strong>，并带上
          <code>?redirect=/dashboard</code>
        </li>
        <li>
          登录成功后，再根据 <code>redirect</code> 参数跳回这里
        </li>
      </ol>
    </div>

    <!-- 登出按钮 -->
    <button @click="handleLogout" class="btn-logout">
      退出登录
    </button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'

const router = useRouter()
const authStore = useAuthStore()

function handleLogout() {
  authStore.logout()
  router.push('/')
}
</script>

<style scoped>
.dashboard-page {
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

/* 用户信息卡片 */
.info-card {
  display: flex;
  align-items: center;
  gap: 20px;
  background: linear-gradient(135deg, #42b883, #3aa876);
  color: white;
  padding: 25px;
  border-radius: 12px;
  margin-bottom: 25px;
}

.avatar {
  width: 60px;
  height: 60px;
  background: rgba(255,255,255,0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: bold;
}

.user-info h2 {
  margin-bottom: 5px;
  color: white;
}

.user-info p {
  opacity: 0.9;
  font-size: 14px;
}

/* 统计卡片 */
.stats-row {
  display: flex;
  gap: 15px;
  margin-bottom: 25px;
}

.stat-card {
  flex: 1;
  background: #f8f8f8;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  border: 1px solid #eee;
}

.stat-number {
  display: block;
  font-size: 32px;
  font-weight: bold;
  color: #42b883;
}

.stat-label {
  display: block;
  font-size: 14px;
  color: #999;
  margin-top: 5px;
}

/* 守卫信息 */
.guard-info {
  background: #f0f9f4;
  border: 1px solid #42b883;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 25px;
}

.guard-info h3 {
  color: #42b883;
  margin-bottom: 12px;
}

.guard-info ol {
  padding-left: 20px;
  line-height: 1.8;
}

.guard-info li {
  font-size: 14px;
  color: #555;
}

.guard-info code {
  background: #e8f5e9;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 13px;
}

/* 登出按钮 */
.btn-logout {
  width: 100%;
  padding: 12px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
}

.btn-logout:hover {
  background: #c0392b;
}
</style>
