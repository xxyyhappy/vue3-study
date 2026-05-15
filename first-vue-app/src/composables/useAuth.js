/*
  useAuth.js —— 登录状态管理

  作用：
  - 管理用户登录/登出
  - 用 localStorage 记住登录状态（刷新页面不丢失）
  - 让路由守卫能判断"是否已登录"

  就像商场的"会员卡"：
  - 你办卡（登录）→ 商场记下你的信息
  - 你亮卡（isLoggedIn）→ 保安知道你是会员，放你进 VIP 区
  - 你退卡（登出）→ 保安不再让你进 VIP 区
*/

import { ref, computed } from 'vue'

// localStorage 的 key 名
const STORAGE_KEY = 'auth_user'

// 在模块级定义响应式数据 —— 这样所有组件共享同一个状态
const user = ref(null) // { username: 'xxx' } 或 null

// 导出 user ref，让路由守卫可以直接访问（不需要调用 useAuth）
export { user }

// 初始化：从 localStorage 读取上次的登录状态
const savedUser = localStorage.getItem(STORAGE_KEY)
if (savedUser) {
  user.value = JSON.parse(savedUser)
}

// ===== 导出组合式函数 =====
export function useAuth() {
  // 是否已登录
  const isLoggedIn = computed(() => user.value !== null)

  // 当前用户名
  const username = computed(() => user.value?.username ?? '')

  // 登录
  function login(username) {
    user.value = { username }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user.value))
  }

  // 登出
  function logout() {
    user.value = null
    localStorage.removeItem(STORAGE_KEY)
  }

  return {
    user,
    isLoggedIn,
    username,
    login,
    logout
  }
}
