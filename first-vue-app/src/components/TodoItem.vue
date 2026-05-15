<template>
  <div class="todo-item">
    <!-- 展示待办文本 -->
    <span>{{ todo.name }}</span>
    <!-- 删除按钮 -->
    <button @click="handleDel">删除</button>
  </div>
</template>

<script setup>
// 1. 接收父组件传过来的 待办对象
const props = defineProps({
  todo: {

    required: true
  }
})

// 2. 定义自定义事件，告诉父组件要删除哪一条
const emit = defineEmits(['deleteTodo'])

// 触发删除，把当前id传给父组件
const handleDel = () => {
  emit('deleteTodo', props.todo.id)
}
</script>

<style scoped>
.todo-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #eee;
  padding: 8px 12px;
  margin: 6px 0;
  border-radius: 4px;
}
button {
  border: none;
  background: #f56c6c;
  color: #fff;
  padding: 4px 8px;
  border-radius: 3px;
  cursor: pointer;
}
</style>