<!--
  TabA.vue —— 动态组件演示 Tab A
-->
<script setup>
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <div class="tab-a">
    <h3>📄 标签 A —— 计数器</h3>
    <p>当前计数：{{ count }}</p>
    <button @click="count++" class="tab-btn">+1</button>
    <button @click="count--" class="tab-btn tab-btn-danger">-1</button>
    <p class="hint">试试切到其他 Tab 再切回来，计数会重置（因为没有 KeepAlive）</p>
  </div>
</template>

<style scoped>
.tab-a {
  padding: 20px;
  background: #e8f5e9;
  border-radius: 8px;
  margin: 10px 0;
}

.tab-btn {
  padding: 6px 16px;
  margin-right: 8px;
  border: none;
  border-radius: 4px;
  background: #42b883;
  color: white;
  cursor: pointer;
}

.tab-btn-danger {
  background: #e74c3c;
}

.hint {
  font-size: 12px;
  color: #999;
  margin-top: 10px;
}
</style>
