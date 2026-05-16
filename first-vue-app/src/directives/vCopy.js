/*
  vCopy.js —— 一键复制指令

  用法：<button v-copy="'要复制的文本'">复制</button>
  作用：点击按钮将指定文本复制到剪贴板
  场景：复制订单号、分享链接、API Key
*/

const vCopy = {
  // mounted：绑定点击事件
  mounted: (el, binding) => {
    el.addEventListener("click", () => {
      // binding.value：要复制的文本
      const text = binding.value;

      if (!text) return;

      // 方案一：Clipboard API（现代浏览器）
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
          showTip(el, "已复制！");
        });
      } else {
        // 方案二：execCommand（兼容老浏览器）
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        showTip(el, "已复制！");
      }
    });
  },
};

// 在元素旁边显示一个临时提示
function showTip(el, msg) {
  const tip = document.createElement("span");
  tip.textContent = msg;
  tip.style.cssText = `
    margin-left: 8px;
    color: #42b883;
    font-size: 12px;
    transition: all 0.3s;
  `;
  el.parentNode?.insertBefore(tip, el.nextSibling);
  // 1.5 秒后自动移除
  setTimeout(() => tip.remove(), 1500);
}

export default vCopy;
