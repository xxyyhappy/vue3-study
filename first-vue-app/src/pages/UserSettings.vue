<!-- ============================================
  UserSettings.vue —— 账号设置（嵌套路由子页面）

  访问 /user/settings 时显示
============================================ -->

<template>
  <div class="user-settings">
    <h2>⚙️ 账号设置</h2>

    <!-- 修改密码 -->
    <div class="setting-section">
      <h3>修改密码</h3>
      <div class="form-group">
        <label>当前密码：</label>
        <input type="password" v-model="oldPassword" placeholder="请输入当前密码" />
      </div>
      <div class="form-group">
        <label>新密码：</label>
        <input type="password" v-model="newPassword" placeholder="请输入新密码" />
      </div>
      <button @click="changePassword" class="btn-primary">保存修改</button>
    </div>

    <!-- 绑定邮箱 -->
    <div class="setting-section">
      <h3>绑定邮箱</h3>
      <div class="form-group">
        <label>邮箱地址：</label>
        <input type="email" v-model="email" placeholder="请输入邮箱" />
      </div>
      <button @click="bindEmail" class="btn-primary">绑定邮箱</button>
    </div>

    <!-- 操作反馈 -->
    <p class="feedback" v-if="feedbackMsg">{{ feedbackMsg }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 密码和邮箱的数据
const oldPassword = ref('')
const newPassword = ref('')
const email = ref('')
const feedbackMsg = ref('')

// 修改密码（模拟）
function changePassword() {
  if (!oldPassword.value || !newPassword.value) {
    feedbackMsg.value = '⚠️ 请填写完整信息'
    return
  }
  feedbackMsg.value = '✅ 密码修改成功！'
  oldPassword.value = ''
  newPassword.value = ''
}

// 绑定邮箱（模拟）
function bindEmail() {
  if (!email.value) {
    feedbackMsg.value = '⚠️ 请填写邮箱地址'
    return
  }
  feedbackMsg.value = '✅ 邮箱绑定成功！'
  email.value = ''
}
</script>

<style scoped>
.user-settings h2 {
  color: #42b883;
  margin-bottom: 20px;
}

.setting-section {
  background: #f8f8f8;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}

.setting-section h3 {
  color: #333;
  margin-bottom: 15px;
  font-size: 16px;
}

.form-group {
  margin-bottom: 12px;
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

.btn-primary {
  background: #42b883;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 10px;
}

.btn-primary:hover {
  background: #3aa876;
}

.feedback {
  text-align: center;
  padding: 10px;
  background: #e8f5e9;
  border-radius: 6px;
  color: #42b883;
}
</style>