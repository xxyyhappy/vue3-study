<!--
  TabB.vue —— 动态组件演示 Tab B
-->
<script setup>
import { ref } from 'vue'

const text = ref('')
</script>

<template>
  <div class="tab-b">
    <h3>📝 标签 B —— 输入框</h3>
    <input v-model="text" placeholder="输入一些文字..." class="tab-input" />
    <p>你输入的是：<strong>{{ text || '（空）' }}</strong></p>
    <p class="hint">试试切到其他 Tab 再切回来，输入的文字会丢失</p>
  </div>
</template>

<style scoped>
.tab-b {
  padding: 20px;
  background: #fff3e0;
  border-radius: 8px;
  margin: 10px 0;
}

.tab-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

.hint {
  font-size: 12px;
  color: #999;
  margin-top: 10px;
}
</style>
