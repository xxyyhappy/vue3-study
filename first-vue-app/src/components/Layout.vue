<!-- ============================================
  Layout.vue —— 具名插槽演示

  子组件里可以有多个 <slot>，每个取不同的名字
  <slot name="header" />    —— 头部坑位
  <slot />                   —— 默认坑位（没名字）
  <slot name="footer" />    —— 底部坑位
============================================ -->

<template>
  <div class="layout">
    <!-- 头部区域：名字叫 header 的坑 -->
    <div class="header">
      <slot name="header" />
    </div>

    <!-- 主体区域：默认坑（没写 name 的 slot） -->
    <div class="main">
      <slot />
    </div>

    <!-- 底部区域：名字叫 footer 的坑 -->
    <div class="footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<style scoped>
.layout {
  max-width: 500px;
  margin: 20px auto;
  border: 2px solid #42b883;
  border-radius: 10px;
  overflow: hidden;
}

.header {
  background: #42b883;
  color: white;
  padding: 15px;
  text-align: center;
  font-size: 20px;
}

.main {
  padding: 20px;
  min-height: 100px;
  text-align: center;
}

.footer {
  background: #f5f5f5;
  padding: 10px;
  text-align: center;
  font-size: 14px;
  color: #999;
}
</style>
