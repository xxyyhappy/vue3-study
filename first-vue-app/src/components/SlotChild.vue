<!-- ============================================
  SlotChild.vue —— 带插槽的子组件

  <slot /> 就是一个"坑位"
  父组件写在标签之间的内容，会在这里显示
============================================ -->

<template>
  <div class="card">
    <h3>📦 卡片组件</h3>

    <!--
      slot 就是"坑位"
      父组件在 <SlotChild> 标签之间写的内容
      会显示在这里
    -->
    <div class="content">
      <slot />
    </div>

    <p class="footer">—— 卡片底部 ——</p>
  </div>
</template>

<style scoped>
.card {
  border: 2px solid #42b883;
  border-radius: 8px;
  padding: 0;
  margin: 20px auto;
  max-width: 400px;
  text-align: center;
  overflow: hidden;
}

h3 {
  background: #42b883;
  color: white;
  margin: 0;
  padding: 10px;
}

.content {
  padding: 20px;
  min-height: 60px;
}

.footer {
  background: #f5f5f5;
  margin: 0;
  padding: 8px;
  font-size: 14px;
  color: #999;
}
</style>
