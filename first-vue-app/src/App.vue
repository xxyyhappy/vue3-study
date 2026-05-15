<!-- ============================================
  App.vue —— 根组件

  现在用 Vue Router 替换刚才的 v-if 方案。
============================================ -->

<template>
  <div class="app">
    <h2>Vue3 练习版</h2>

    <!-- === 导航栏 === -->
    <nav class="navh">
      <router-link to="/" class="nav-linkh">首页</router-link>
      <router-link to="/about" class="nav-linkh">关于</router-link>
      <router-link to="/user/1" class="nav-linkh">用户</router-link>
      <router-link to="/product/1" class="nav-linkh">商品</router-link>
      <!-- 用户中心入口（嵌套路由演示） -->
      <router-link to="/user-center" class="nav-linkh">用户中心</router-link>
      <!-- 登录页入口（编程式导航演示） -->
      <router-link to="/login" class="nav-linkh">登录</router-link>
      <router-link to="/reactive-data" class="nav-linkh"
        >响应式数据</router-link
      >
      <router-link to="/template-syntax" class="nav-linkh"
        >模板语法</router-link
      >
    </nav>
    <nav class="navv">
      <!-- 路由模式演示 -->
      <router-link to="/route-mode" class="nav-linkh">路由模式</router-link>
      <!-- 路由守卫演示 -->
      <router-link to="/guard-demo" class="nav-linkh">路由守卫</router-link>
      <router-link to="/pinia-demo" class="nav-linkh">Pinia</router-link>
      <router-link to="/adv-components" class="nav-linkh">组件进阶</router-link>

      <router-link to="/component-basics" class="nav-linkh"
        >组件基础</router-link
      >
      <router-link to="/composables" class="nav-linkh">组合式函数</router-link>
    </nav>

    <!-- === 页面显示区域 === -->
    <!--
      router-view 就是之前 v-if 写的那一堆条件判断的"替代品"

      URL 是 /              → 显示 Home
      URL 是 /about         → 显示 About
      URL 是 /user-center   → 显示 UserLayout（嵌套路由的父组件）
        UserLayout 里面也有 <router-view />，显示子路由匹配的页面
    -->
    <router-view />

    <p class="hint">👆 查看浏览器地址栏，URL 会跟着变化</p>
  </div>
</template>

<script setup>
// 注意：这里不用写任何 currentPage 变量了
// 路由在背后帮我们做了这件事
</script>

<style scoped>
.app {
  max-width: auto;
  margin: 0 auto;
  padding: 20px;
}

h2 {
  text-align: center;
  color: #42b883;
}

.navh {
  display: flex;
  gap: 20px;
  justify-content: center;
  padding: 15px;
  background: #f5f5f5;
  border-radius: 8px;
  margin-bottom: 20px;
}
.navv {
  display: flex;
  gap: 20px;
  justify-content: center;
  padding: 15px;
  background: #f5f5f5;
  border-radius: 8px;
  margin-bottom: 20px;
}

.nav-linkh {
  text-decoration: none;
  font-size: 18px;
  color: #333;
  padding: 8px 20px;
  border-radius: 6px;
  transition: all 0.3s;
}

/* 当前选中的链接自动高亮 */
.nav-linkh.router-link-active {
  background: #42b883;
  color: white;
}

.hint {
  text-align: center;
  color: #999;
  font-size: 14px;
  margin-top: 20px;
}
</style>
