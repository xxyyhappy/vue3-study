/*
  stores/auth.js —— 用户认证 Pinia Store

  作用：用 Pinia 管理登录状态（替代手写的 useAuth.js）

  对比 useAuth.js：
  - useAuth.js：手写的 ref + computed，需要额外导出 user 给路由用
  - Pinia 版本：用 defineStore 包裹，自带响应式，路由直接 useAuthStore()

  Pinia 的最大优势：
  1. 不用额外导出 raw ref —— 路由守卫直接 useAuthStore() 就能用
  2. 自带 DevTools 支持 —— 可以时间旅行调试
  3. 代码更统一、更规范
*/

import { defineStore } from "pinia";
import { ref, computed } from "vue";

const STORAGE_KEY = "auth_user";

export const useAuthStore = defineStore("auth", () => {
  // ===== state =====
  // 当前登录用户 { username: 'xxx' } 或 null
  const user = ref(null);

  // ===== getter =====
  // 是否已登录
  const isLoggedIn = computed(() => user.value !== null);
  // 当前用户名
  const username = computed(() => user.value?.username ?? "");

  // ===== action =====
  // 登录
  function login(name) {
    user.value = { username: name };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user.value));
  }

  // 登出
  function logout() {
    user.value = null;
    localStorage.removeItem(STORAGE_KEY);
  }

  // 初始化：从 localStorage 恢复登录状态
  const savedUser = localStorage.getItem(STORAGE_KEY);
  if (savedUser) {
    user.value = JSON.parse(savedUser);
  }

  return { user, isLoggedIn, username, login, logout };
});
