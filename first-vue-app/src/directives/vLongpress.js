/*
  vLongpress.js —— 长按指令

  用法：<button v-longpress="onLongpress">长按我</button>
  作用：按住元素超过 500ms 触发回调
  场景：长按删除、长按录音、长按拖拽
*/

const vLongpress = {
  mounted: (el, binding) => {
    // binding.value：长按触发的回调函数
    const callback = binding.value;
    if (typeof callback !== "function") return;

    let timer = null;
    // 长按阈值（按住多久算"长按"，单位毫秒）
    const delay = 500;

    // 鼠标按下开始计时
    const onStart = () => {
      timer = setTimeout(() => {
        callback();
        timer = null;
      }, delay);
    };

    // 松开/离开取消计时
    const onEnd = () => {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
    };

    // 把事件处理函数存到元素上，方便 unmounted 时移除
    el._longpressData = { onStart, onEnd };

    el.addEventListener("mousedown", onStart);
    el.addEventListener("mouseup", onEnd);
    el.addEventListener("mouseleave", onEnd);
    // 触屏支持
    el.addEventListener("touchstart", onStart);
    el.addEventListener("touchend", onEnd);
  },
  unmounted: (el) => {
    // 组件卸载时一定要移除事件监听，防止内存泄漏
    if (el._longpressData) {
      const { onStart, onEnd } = el._longpressData;
      el.removeEventListener("mousedown", onStart);
      el.removeEventListener("mouseup", onEnd);
      el.removeEventListener("mouseleave", onEnd);
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchend", onEnd);
      delete el._longpressData;
    }
  },
};

export default vLongpress;
