/*
  useLocalStorage.js —— 本地存储组合式函数

  作用：创建一个和 localStorage 双向同步的响应式数据
  数据变了 → 自动存到 localStorage
  localStorage 有值 → 启动时自动读取

  就像"笔记本"：
  - 你在代码里改数据 → 自动记到本子上（localStorage）
  - 刷新页面 → 从本子上读回来
  - 关掉浏览器再打开 → 数据还在
*/

import { ref, watch } from "vue";

export function useLocalStorage(key, defaultValue = null) {
  // 从 localStorage 读取之前存的值，没有就用默认值
  const stored = localStorage.getItem(key);
  const data = ref(stored ? JSON.parse(stored) : defaultValue);

  // watch：data 变化时自动同步到 localStorage
  watch(
    data,
    (newVal) => {
      if (newVal === null || newVal === undefined) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, JSON.stringify(newVal));
      }
    },
    { deep: true }, // deep: 对象/数组内部变化也能监听到
  );

  return data;
}

export function resetLocalStorage(key, defaultValue = null) {
  localStorage.removeItem(key);
}
