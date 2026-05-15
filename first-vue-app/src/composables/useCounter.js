/*
  useCounter.js —— 计数器组合式函数

  作用：提供一个带增/减/重置功能的计数器
  可以传初始值，不传则从 0 开始

  就像"计步器"：
  - 你走一步（increment）→ 数字 +1
  - 你退一步（decrement）→ 数字 -1
  - 你按重置（reset）→ 回到 0
*/

import { ref, computed } from 'vue'

export function useCounter(initialValue = 0) {
  // count 是响应式的，变了页面会自动更新
  const count = ref(initialValue)

  // computed：依赖 count 自动算出新值
  const double = computed(() => count.value * 2)

  function increment() { count.value++ }
  function decrement() { count.value-- }
  function reset() { count.value = initialValue }
  function add(amount) { count.value += amount }

  // 把需要的东西暴露出去，组件拿到后用
  return { count, double, increment, decrement, reset, add }
}
