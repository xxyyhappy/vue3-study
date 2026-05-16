/*
  vDebounce.js —— 防抖指令

  用法：<button v-debounce="handleClick">提交</button>
  作用：防止按钮被快速重复点击，只在最后一次点击后等待 delay 毫秒执行
  场景：提交按钮、搜索输入
*/

import { directiveDebounceMs as defaultDelay } from "./index.js";

const vDebounce = {
  // mounted：元素挂载时，劫持点击事件
  mounted: (el, binding) => {
    // binding.arg：指令参数，如 v-debounce:2000 → arg = "2000"
    // 没传参数时用默认值
    const delay = binding.arg ? Number(binding.arg) : defaultDelay;
    let timer = null;

    el.addEventListener("click", (e) => {
      // 防抖核心：每次点击都清除上一次的定时器
      clearTimeout(timer);
      // 重新设置定时器，delay 毫秒后才真正执行
      timer = setTimeout(() => {
        binding.value(e);
      }, delay);
    });
  },
  // unmounted：元素卸载时清理定时器，防止内存泄漏
  unmounted: (el) => {
    // 注意：实际项目中需要用 map 保存每个元素的 timer
    // 这里简化处理
  },
};

export default vDebounce;
