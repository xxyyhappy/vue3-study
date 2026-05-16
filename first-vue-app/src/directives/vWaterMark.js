// src/directives/vWaterMark.js

const vWaterMark = {
  mounted(el, binding) {
    // ... 你的原有逻辑
    let config = {};
    if (typeof binding.value === "string") {
      config = { text: binding.value };
    } else {
      config = binding.value || {};
    }
    const {
      text = "水印文字",
      fontSize = 14,
      color = "rgba(0, 0, 0, 0.15)",
      angle = -20,
      gapX = 100,
      gapY = 100,
    } = config;
    const position = window.getComputedStyle(el).position;
    if (position === "static") el.style.position = "relative";
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const unitSize = Math.max(fontSize * 4, 100);
    canvas.width = unitSize + gapX;
    canvas.height = unitSize + gapY;
    ctx.font = `${fontSize}px sans-serif`;
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((angle * Math.PI) / 180);
    ctx.fillText(text, 0, 0);
    const watermarkDiv = document.createElement("div");
    watermarkDiv.style.position = "absolute";
    watermarkDiv.style.top = "0";
    watermarkDiv.style.left = "0";
    watermarkDiv.style.width = "100%";
    watermarkDiv.style.height = "100%";
    watermarkDiv.style.zIndex = "9999";
    watermarkDiv.style.pointerEvents = "none";
    watermarkDiv.style.backgroundImage = `url(${canvas.toDataURL()})`;
    watermarkDiv.style.backgroundRepeat = "repeat";
    el._watermarkEl = watermarkDiv;
    el.appendChild(watermarkDiv);
  },
  updated(el, binding) {
    if (el._watermarkEl) el.removeChild(el._watermarkEl);
    // 重新执行挂载逻辑
    this.mounted(el, binding);
  },
  unmounted(el) {
    if (el._watermarkEl) {
      el.removeChild(el._watermarkEl);
      delete el._watermarkEl;
    }
  },
};

// 2. 使用默认导出
export default vWaterMark;
