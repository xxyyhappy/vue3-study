<!--
  Child.vue —— 子组件（props + emits 演示）

  功能：
  - 通过 props 接收父组件传来的 name 和 age
  - 通过 emit 向父组件发送消息
-->
<template>
  <div class="child-box">
    <h3>👶 子组件</h3>
    <p>我收到的名字：<strong>{{ name }}</strong></p>
    <p>我收到的年龄：<strong>{{ age }}</strong></p>
    <p>明年我就 {{ age + 1 }} 岁了</p>
    <button @click="sendToParent">发送消息给父组件</button>
  </div>
</template>

<script setup>
const props = defineProps({
  name: { type: String, default: '未知' },
  age: { type: Number, default: 0 }
})

const emit = defineEmits(['send-msg'])

function sendToParent() {
  emit('send-msg', '你好，我是子组件！')
}
</script>

<style scoped>
.child-box {
  border: 2px solid #42b883;
  border-radius: 8px;
  padding: 20px;
  max-width: 400px;
  text-align: center;
}
.child-box h3 { color: #42b883; margin: 0 0 10px; }
.child-box p { font-size: 16px; color: #555; margin: 8px 0; }
.child-box button {
  margin-top: 12px;
  padding: 8px 20px;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.child-box button:hover { background: #3aa876; }
</style>
