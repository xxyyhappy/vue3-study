<!--
  SlotBasic.vue —— 基础插槽演示

  <slot /> 就像在墙上留了一个"插座孔"，
  父组件插什么，这里就显示什么。
-->
<template>
  <div class="slot-card">
    <h3>📇 基础插槽卡片</h3>
    <div class="slot-body">
      <!-- ★ <slot /> 是"占位符"，父组件塞的内容出现在这里 -->
      <slot />
      <!--    ↑ 没有 slot 的话，父组件传的内容就"没地方放"，不会显示 -->
    </div>
    <p class="slot-footer">—— 卡片底部（组件自带）</p>
  </div>
</template>

<style scoped>
.slot-card {
  border: 2px solid #42b883;
  border-radius: 10px;
  padding: 20px;
  margin: 10px 0;
  background: #f0f9f4;
}

.slot-card h3 {
  margin: 0 0 10px 0;
  color: #42b883;
  font-size: 16px;
}

.slot-body {
  min-height: 40px;
  padding: 10px;
  background: white;
  border-radius: 6px;
  border: 1px dashed #42b883;
}

.slot-footer {
  margin: 10px 0 0 0;
  font-size: 12px;
  color: #999;
}
</style>
