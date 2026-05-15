<!--
  AsyncComp.vue —— Suspense 异步组件演示

  注意：这个组件在 <script setup> 的顶层使用了 await，
  所以它必须放在 <Suspense> 中使用。
  没有 Suspense 包裹的话，会报错。
-->
<script setup>
import { ref } from 'vue'

// ★ 顶层 await —— 这是触发 Suspense 的关键
// 模拟请求 API：等 2 秒后返回数据
const data = ref(null)
const detail = ref('')

// 假装第一次请求
data.value = await new Promise((resolve) => {
  setTimeout(() => resolve('用户数据加载完毕 ✅'), 2000)
})

// 假装第二次请求（展示多个异步操作）
detail.value = await new Promise((resolve) => {
  setTimeout(() => resolve('详细数据：共 42 条记录 📊'), 1000)
})
</script>

<template>
  <div class="async-comp">
    <h3>⏳ 异步组件（已加载完成）</h3>
    <p class="data-line">📦 {{ data }}</p>
    <p class="data-line">📋 {{ detail }}</p>
    <p class="hint">这个组件用了顶层 await，必须用 Suspense 包裹才能正常工作</p>
  </div>
</template>

<style scoped>
.async-comp {
  padding: 20px;
  background: #e0f7fa;
  border-radius: 8px;
  margin: 10px 0;
}

.data-line {
  font-size: 16px;
  color: #333;
  margin: 8px 0;
}

.hint {
  font-size: 12px;
  color: #999;
  margin-top: 15px;
  border-top: 1px solid #ddd;
  padding-top: 10px;
}
</style>
