<!--
  TeleportModal.vue —— Teleport 传送门演示

  模态框用 Teleport 传送到 <body> 下，
  避免被父组件的 CSS（如 overflow: hidden、z-index 叠加上下文）影响。
-->
<script setup>
import { ref } from 'vue'

const show = ref(false)

function open() { show.value = true }
function close() { show.value = false }
</script>

<template>
  <div class="teleport-demo">
    <h3>📦 Teleport 模态框</h3>
    <button @click="open" class="open-btn">打开模态框</button>

    <!--
      ★ Teleport to="body"
      内容会被渲染到 <body> 的直接子级
      但事件、props 等逻辑关系仍然属于当前组件
    -->
    <Teleport to="body">
      <div v-if="show" class="modal-overlay" @click.self="close">
        <div class="modal-box">
          <h2>模态框</h2>
          <p>这个模态框被 Teleport 传送到 <code>&lt;body&gt;</code> 下了！</p>
          <p>看看浏览器的 Elements 面板，它不在 #app 里面。</p>
          <button @click="close" class="close-btn">关闭</button>
        </div>
      </div>
    </Teleport>

    <p class="hint">打开后按 F12 查看 DOM 结构，模态框在 &lt;body&gt; 下</p>
  </div>
</template>

<style scoped>
.teleport-demo {
  padding: 20px;
  background: #f3e5f5;
  border-radius: 8px;
  margin: 10px 0;
}

.open-btn {
  padding: 10px 24px;
  background: #9b59b6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.open-btn:hover {
  background: #8e44ad;
}

.hint {
  font-size: 12px;
  color: #999;
  margin-top: 10px;
}
</style>

<!--
  注意：Teleport 的内容虽然不在当前组件的 DOM 树中，
  但 scoped 样式依然不会影响到 Teleport 内部。
  所以 Teleport 内部的样式需要写在 非 scoped 的 <style> 中。
-->
<style>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-box {
  background: white;
  padding: 30px;
  border-radius: 12px;
  min-width: 350px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  text-align: center;
}

.modal-box h2 {
  margin: 0 0 15px 0;
  color: #333;
}

.modal-box p {
  margin: 10px 0;
  color: #666;
  font-size: 14px;
}

.modal-box code {
  background: #f0f0f0;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 13px;
}

.close-btn {
  margin-top: 15px;
  padding: 8px 24px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.close-btn:hover {
  background: #c0392b;
}
</style>
