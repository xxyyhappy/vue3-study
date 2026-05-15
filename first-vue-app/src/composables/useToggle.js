/*
  useToggle.js —— 开关组合式函数

  作用：管理 true/false 状态的切换
  常用于：弹窗开关、菜单展开/收起、暗黑模式切换

  就像"电灯开关"：
  - 按一下 toggle → 灯亮了（true）
  - 再按一下 → 灯灭了（false）
  - setTrue → 强制开灯
  - setFalse → 强制关灯
*/

import { ref } from 'vue'

export function useToggle(initialValue = false) {
  const value = ref(initialValue)

  function toggle() { value.value = !value.value }
  function setTrue() { value.value = true }
  function setFalse() { value.value = false }

  return { value, toggle, setTrue, setFalse }
}
