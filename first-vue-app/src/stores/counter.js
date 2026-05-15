/*
  stores/counter.js —— 计数器 Pinia Store（最简单的 Pinia 示例）

  作用：展示 Pinia 的三个核心概念
  - state（状态）= 数据
  - getter（计算属性）= 从 state 衍生出的数据
  - action（动作）= 修改 state 的方法
*/

import { defineStore } from "pinia";
import { ref, computed } from "vue";

// defineStore('store 名称', 回调函数)
// 名称 'counter' 在 Pinia DevTools 中显示，方便调试
export const useCounterStore = defineStore("counter", () => {
  // ===== state（状态）=====
  // 就像组件里的 ref —— 存储数据
  const count = ref(0);

  // ===== getter（计算属性）=====
  // 就像组件里的 computed —— 从 state 衍生数据
  const double = computed(() => count.value * 2);

  // ===== action（动作）=====
  // 就是普通函数 —— 用来修改 state
  function increment() {
    count.value++;
  }

  function decrement() {
    count.value--;
  }

  function reset() {
    count.value = 0;
  }

  function setCount(val) {
    count.value = val;
  }

  // 把所有东西返回出去，组件就能用了
  return { count, double, increment, decrement, reset, setCount };
});
