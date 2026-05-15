<!--
  TabC.vue —— 动态组件演示 Tab C
-->
<script setup>
import { ref } from 'vue'

const items = ref(['学习 Vue', '练习代码', '做项目'])
const newItem = ref('')

function addItem() {
  if (newItem.value.trim()) {
    items.value.push(newItem.value.trim())
    newItem.value = ''
  }
}
</script>

<template>
  <div class="tab-c">
    <h3>✅ 标签 C —— 待办列表</h3>
    <ul>
      <li v-for="(item, i) in items" :key="i">{{ item }}</li>
    </ul>
    <div class="add-row">
      <input v-model="newItem" placeholder="新增待办..." class="tab-input"
        @keyup.enter="addItem" />
      <button @click="addItem" class="tab-btn">添加</button>
    </div>
  </div>
</template>

<style scoped>
.tab-c {
  padding: 20px;
  background: #e3f2fd;
  border-radius: 8px;
  margin: 10px 0;
}

.tab-c ul {
  padding-left: 20px;
}

.tab-c li {
  margin: 5px 0;
}

.add-row {
  display: flex;
  gap: 8px;
}

.tab-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.tab-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background: #42b883;
  color: white;
  cursor: pointer;
}
</style>
