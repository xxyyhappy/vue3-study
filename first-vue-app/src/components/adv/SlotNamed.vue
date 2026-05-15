<!--
  SlotNamed.vue —— 具名插槽演示

  一个组件可以有多个插槽，用 name 区分。
  像一栋房子有多个房间：客厅、卧室、厨房。
-->
<template>
  <div class="named-layout">
    <!-- ★ name="header" 插槽 -->
    <div class="header-area">
      <slot name="header" />
    </div>

    <!-- ★ 默认插槽（没有 name） -->
    <div class="main-area">
      <slot />
    </div>

    <!-- ★ name="footer" 插槽 -->
    <div class="footer-area">
      <slot name="footer" />
    </div>
  </div>
</template>

<style scoped>
.named-layout {
  border: 2px solid #e67e22;
  border-radius: 10px;
  overflow: hidden;
  margin: 10px 0;
}

.header-area {
  background: #fdf0e0;
  padding: 15px;
  border-bottom: 1px solid #e67e22;
  min-height: 30px;
}

.main-area {
  padding: 15px;
  min-height: 50px;
  background: white;
}

.footer-area {
  background: #f5f5f5;
  padding: 15px;
  border-top: 1px solid #ddd;
  min-height: 30px;
}
</style>
