<!--
  MyBtnSlot.vue —— 后备内容（默认值）演示

  父组件没传内容时，显示默认文字"提交"。
  类似于按钮的"默认文案"。
-->
<template>
  <button class="my-btn-slot">
    <!-- ★ 后备内容：父组件没塞内容就显示"提交"，提交是默认显示的 -->
    <slot>提交</slot>
  </button>
</template>

<style scoped>
.my-btn-slot {
  padding: 8px 20px;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  margin: 10px 10px 10px 0;
}

.my-btn-slot:hover {
  background: #3aa876;
}
</style>
