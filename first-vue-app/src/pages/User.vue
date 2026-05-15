<!-- ============================================
  User.vue —— 用户详情页（小白入门版）

  模拟从后台获取数据，根据 URL 中的 id 显示不同用户
============================================ -->

<template>
  <div class="page">
    <!-- 跳转按钮 -->
    <div class="button-group">
      <button  
        v-for="value in userList" 
        :key="value.id" 
        @click="goUser(value.id)">
        {{ value.name }}
    </button>
    </div>
  <!-- 显示当前用户信息 -->
    <h2>用户详情</h2>
    <p>用户 ID：{{ userId }}</p>
    <p>用户名：{{ userName }}</p>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { ref, computed } from 'vue'

// ===== 第一步：准备假的"后台数据" =====
// 实际项目中，这些数据来自后端 API
// 这里用数组模拟，方便理解
const userList = [
  { id: 1, name: '张三' },
  { id: 2, name: '李四' },
  { id: 3, name: '王五' }
]

// ===== 第二步：获取当前 URL 中的 id =====
// 访问 /user/1 时，route.params.id 就是 "1"
const route = useRoute()
const userId = computed(() => { 
  const id = Number(route.params.id)
 console.log(id);
 
  return isNaN(id) ? 1 : id
})

// ===== 第三步：根据 id 从数据中找用户 =====
// userList.find() 是 JS 数组方法，意思是"找到第一个符合条件的"
const userName = computed(() => {
  // 找到 id 等于当前 URL id 的那个用户
  const user = userList.find(u => u.id === userId.value)
  // 返回用户名，找不到就返回"不存在"
  return user ? user.name : '用户不存在'
})

// ===== 第四步：跳转函数 =====
const router = useRouter()

function goUser(id) {
console.log(id);
 if (id) {
  // 跳转到 /user/:id
  router.push(`/user/${id}`)
 } else {
  // 跳转到 /user/1
  router.push('/user/1')
 }
  
}
</script>

<style scoped>
.page {
  text-align: center;
  padding: 40px;
}

h2 {
  color: #42b883;
}

p {
  font-size: 18px;
  margin: 10px 0;
}

button {
  margin: 5px;
  padding: 8px 16px;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.button-group {
  display: grid;
  /* Exactly 3 columns of equal width */
  grid-template-columns: repeat(3, 1fr);
  /* Space between grid items */
  gap: 10px; 
  justify-content: center;
  max-width: 600px; /* Optional: prevents columns from getting too wide on large screens */
  margin: 0 auto;   /* Centers the grid container itself */
}
</style>