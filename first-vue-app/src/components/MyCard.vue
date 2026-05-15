<template>
  <div class="card" :style="{ color: textColor }">
    {{ title }}
  </div>
</template>

<script setup>
// 定义接收参数
const props = defineProps({
  title: String,
  textColor: String
})
</script>

<style scoped>
.card {
  border: 1px solid #eee;
  padding: 12px;
  margin: 8px 0;
}
</style>