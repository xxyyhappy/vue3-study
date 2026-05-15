/*
  useMousePosition.js —— 鼠标位置组合式函数

  作用：实时追踪鼠标在页面上的位置
  展示了组合式函数如何使用生命周期钩子（onMounted / onUnmounted）

  就像"定位追踪器"：
  - 你打开页面 → 开始追踪鼠标位置（onMounted 添加事件监听）
  - 你关闭页面 → 停止追踪（onUnmounted 移除事件监听）
  - 省资源，不用的功能不占内存
*/

import { ref, onMounted, onUnmounted } from 'vue'

export function useMousePosition() {
  const x = ref(0)
  const y = ref(0)

  // 鼠标移动时更新坐标
  function update(event) {
    x.value = event.clientX
    y.value = event.clientY
  }

  // 组件挂载后：开始监听鼠标移动
  onMounted(() => window.addEventListener('mousemove', update))

  // 组件卸载前：移除监听（防止内存泄漏）
  onUnmounted(() => window.removeEventListener('mousemove', update))

  return { x, y }
}
