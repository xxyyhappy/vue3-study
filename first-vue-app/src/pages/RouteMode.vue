<!-- ============================================
  RouteMode.vue —— 路由模式演示（hash vs history）

  功能：
  1. 显示当前 URL
  2. 显示当前使用的路由模式
  3. 展示两种模式的代码对比
  4. 部署要点说明
============================================ -->

<template>
  <div class="mode-page">
    <h1>🌐 路由模式对比</h1>
    <p class="subtitle">hash vs history —— 看 URL 的区别</p>

    <!-- ===== 当前 URL 显示 ===== -->
    <div class="card current-card">
      <h2>当前 URL</h2>
      <div class="url-display">
        <code>{{ currentUrl }}</code>
      </div>
      <p class="mode-label">
        当前模式：
        <span :class="currentMode === 'history' ? 'tag-history' : 'tag-hash'">
          {{ currentMode === 'history' ? 'History 模式' : 'Hash 模式' }}
        </span>
      </p>
      <p class="mode-desc">{{ modeDescription }}</p>
    </div>

    <!-- ===== 两种模式对比 ===== -->
    <div class="compare-row">
      <!-- Hash 模式 -->
      <div class="card hash-card">
        <h2>Hash 模式</h2>
        <p class="code-example">createWebHashHistory()</p>
        <p class="url-example">http://site.com/<span class="hash-mark">#/</span>about</p>
        <ul class="pros">
          <li>✅ 部署简单，不需要后端配合</li>
          <li>✅ 不会 404</li>
          <li>❌ URL 多一个 #</li>
        </ul>
      </div>

      <!-- History 模式 -->
      <div class="card history-card">
        <h2>History 模式</h2>
        <p class="code-example">createWebHistory()</p>
        <p class="url-example">http://site.com/about</p>
        <ul class="pros">
          <li>✅ URL 干净，没有 #</li>
          <li>✅ 可以直接复制分享</li>
          <li>❌ 部署需要配 Nginx</li>
        </ul>
      </div>
    </div>

    <!-- ===== 部署要点 ===== -->
    <div class="card deploy-card">
      <h2>🚀 部署要点</h2>
      <p>History 模式上线时，Nginx 必须配置：</p>
      <pre class="nginx-config">
location / {
  try_files $uri $uri/ /index.html;
}</pre>
      <p class="deploy-tip">
        这行的意思：用户访问任何路径 → 先找有没有对应文件 → 没有就返回 index.html → Vue 自己读 URL 显示正确的页面
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// 当前完整 URL（浏览器地址栏）
const currentUrl = computed(() => window.location.href)

// 判断当前模式（看 URL 有没有 #）
const currentMode = computed(() => {
  return window.location.hash ? 'hash' : 'history'
})

const modeDescription = computed(() => {
  return currentMode.value === 'history'
    ? 'URL 中没 #，看起来干净 —— 推荐开发时使用'
    : 'URL 中有 #，# 后面的路径不会发给服务器 —— 部署省心'
})
</script>

<style scoped>
.mode-page {
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

.card {
  background: #f8f8f8;
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 25px;
}

.card h2 {
  margin-bottom: 15px;
  font-size: 18px;
}

/* 当前 URL 卡片 */
.current-card {
  border: 2px solid #42b883;
  text-align: center;
}
.current-card h2 { color: #42b883; }

.url-display {
  background: #1e1e1e;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 15px;
}

.url-display code {
  color: #0f0;
  font-size: 18px;
  word-break: break-all;
}

.mode-label {
  font-size: 16px;
  margin-bottom: 10px;
}

.tag-hash, .tag-history {
  display: inline-block;
  padding: 3px 12px;
  border-radius: 12px;
  color: white;
  font-weight: bold;
  font-size: 14px;
}

.tag-hash { background: #e67e22; }
.tag-history { background: #42b883; }

.mode-desc {
  color: #666;
  font-size: 14px;
}

/* 并排对比 */
.compare-row {
  display: flex;
  gap: 20px;
}

.compare-row .card {
  flex: 1;
}

.hash-card { border: 2px solid #e67e22; }
.hash-card h2 { color: #e67e22; }

.history-card { border: 2px solid #3498db; }
.history-card h2 { color: #3498db; }

.code-example {
  font-family: monospace;
  background: #eee;
  padding: 8px;
  border-radius: 4px;
  text-align: center;
  font-size: 14px;
}

.url-example {
  text-align: center;
  font-size: 15px;
  margin: 10px 0;
  padding: 8px;
  background: #fff;
  border-radius: 4px;
  font-family: monospace;
}

.hash-mark {
  background: #fff3cd;
  color: #e67e22;
  font-weight: bold;
}

.pros {
  list-style: none;
  padding: 0;
}

.pros li {
  padding: 4px 0;
  font-size: 14px;
}

/* 部署卡片 */
.deploy-card {
  border: 2px solid #e74c3c;
}
.deploy-card h2 { color: #e74c3c; }

.nginx-config {
  background: #1e1e1e;
  color: #0f0;
  padding: 15px;
  border-radius: 8px;
  font-family: monospace;
  margin: 10px 0;
}

.deploy-tip {
  background: #fff3cd;
  padding: 10px;
  border-radius: 6px;
  color: #856404;
  font-size: 14px;
}
</style>
