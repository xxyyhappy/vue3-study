<!-- ============================================
  UserProfile.vue —— 个人资料（嵌套路由子页面）

  访问 /user/profile 时显示
============================================ -->

<template>
  <div class="user-profile">
    <h2>📋 个人资料</h2>

    <!-- 用户信息表 -->
    <table class="info-table">
      <tbody>
        <tr>
          <td class="label">头像</td>
          <td>
            <div class="avatar">👤</div>
          </td>
        </tr>
        <tr>
          <td class="label">昵称</td>
          <td>小明同学</td>
        </tr>
        <tr>
          <td class="label">邮箱</td>
          <td>xiaoming@example.com</td>
        </tr>
        <tr>
          <td class="label">手机</td>
          <td>138****8888</td>
        </tr>
        <tr>
          <td class="label">注册时间</td>
          <td>2026-01-15</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
// 个人资料页面 —— 模拟显示用户信息
// 实际项目中从后端 API 或 Pinia store 获取
</script>

<style scoped>
.user-profile h2 {
  color: #42b883;
  margin-bottom: 20px;
}

/* 信息表格 */
.info-table {
  width: 100%;
  border-collapse: collapse;
}

.info-table tr {
  border-bottom: 1px solid #eee;
}

.info-table td {
  padding: 15px 10px;
  text-align: left;
}

.info-table .label {
  width: 100px;
  color: #999;
  font-size: 14px;
}

/* 头像占位 */
.avatar {
  width: 60px;
  height: 60px;
  background: #42b883;
  color: white;
  border-radius: 50%;
  font-size: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
