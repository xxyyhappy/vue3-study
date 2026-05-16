/*
  vFocus.js —— 自动聚焦指令

  用法：<input v-focus />
  作用：元素挂载后自动获取焦点
  场景：搜索框、登录页的第一个输入框
*/

const vFocus = {
  // mounted：指令绑定元素挂载到 DOM 后执行
  // el：指令绑定的 DOM 元素
  mounted: (el) => {
    // 找到元素里的 input（也可能是 el 本身就是 input）
    const input = el.tagName === "INPUT" ? el : el.querySelector("input");
    if (input) {
      input.focus();
    } else {
      el.focus();
    }
  },
};

export default vFocus;
