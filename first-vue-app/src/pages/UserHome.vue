<!-- ============================================
  UserHome.vue —— 用户中心首页（默认子路由）

  访问 /user 时显示这个页面（path 为空的子路由）
============================================ -->

<template>
  <div class="user-home">
    <h2>🏠 用户中心首页</h2>
    <p>欢迎来到用户中心！请从左侧菜单选择功能。</p>
    <div class="tips">
      <p>💡 点击左侧菜单可以切换不同页面：</p>
      <ul>
        <li>个人资料 —— 查看和修改你的信息</li>
        <li>账号设置 —— 修改密码、绑定邮箱</li>
        <li>我的订单 —— 查看订单列表</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
// 默认子路由页面，只是个欢迎页
</script>

<style scoped>
.user-home {
  text-align: center;
}

h2 {
  color: #42b883;
}

.tips {
  background: #f0f9f4;
  border-radius: 8px;
  padding: 20px;
  margin-top: 20px;
}

.tips ul {
  list-style: none;
  padding: 0;
}

.tips li {
  padding: 8px 0;
  color: #555;
}
</style>