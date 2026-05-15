<!-- ============================================
  UserLayout.vue —— 用户中心布局（嵌套路由的父组件）

  功能：
  - 左侧：固定的导航菜单（个人资料、账号设置、我的订单）
  - 右侧：内容区，由子路由决定显示什么

  重点：父组件里也要放一个 <router-view />
  外层的 <router-view /> 显示这个布局组件
  内层的 <router-view /> 显示子路由匹配的页面
============================================ -->

<template>
  <div class="user-center">
    <!-- 左侧菜单（不会变化的部分） -->
    <aside class="sidebar">
      <h3>👤 用户中心1</h3>

      <!--
        这些链接的路径是子路由的完整路径
        /user/profile → 匹配子路由 path: "profile"
        /user/settings → 匹配子路由 path: "settings"
        /user/orders → 匹配子路由 path: "orders"
      -->
      <router-link to="/user-center/profile" class="menu-link">
        📋 个人资料1
      </router-link>
      <router-link to="/user-center/settings" class="menu-link">
        ⚙️ 账号设置1
      </router-link>
      <router-link to="/user-center/orders" class="menu-link">
        📦 我的订单
      </router-link>

      <!-- 默认子路由：访问 /user 时显示 -->
      <router-link to="/user" class="menu-link"> 🏠 用户首页 </router-link>
    </aside>

    <!-- 右侧内容区（子路由切换，这里变化） -->
    <!--
      重点！！！
      这里也有一个 <router-view />，但它跟 App.vue 里那个不一样
      App.vue 的 <router-view /> 管第一层路由（显示 UserLayout）
      这里的 <router-view /> 管第二层路由（显示 Profile、Settings 等）
      每层的 <router-view /> 只管自己这一层，互不干扰
    -->
    <main class="content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
// 这个布局组件只管"壳子"，不管"内容"
// 内容由子路由决定（Profile、Settings、Orders）
</script>

<style scoped>
/* 用户中心整体布局：左右分栏 */
.user-center {
  display: flex;
  max-width: 800px;
  margin: 0 auto;
  border: 2px solid #42b883;
  border-radius: 10px;
  overflow: hidden;
}

/* 左侧菜单 */
.sidebar {
  width: 180px;
  background: #f5f5f5;
  padding: 20px 15px;
  border-right: 1px solid #ddd;
}

.sidebar h3 {
  color: #42b883;
  margin-bottom: 20px;
  font-size: 16px;
}

/* 菜单链接 */
.menu-link {
  display: block;
  padding: 12px 10px;
  margin-bottom: 8px;
  text-decoration: none;
  color: #333;
  border-radius: 6px;
  transition: all 0.3s;
  font-size: 15px;
}

.menu-link:hover {
  background: #42b883;
  color: white;
}

/* 当前选中的菜单项高亮 */
.menu-link.router-link-active {
  background: #42b883;
  color: white;
}

/* 右侧内容区 */
.content {
  flex: 1;
  padding: 30px 25px;
  min-height: 300px;
}
</style>
