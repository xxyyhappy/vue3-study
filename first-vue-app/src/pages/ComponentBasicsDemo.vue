<!--
  ComponentBasicsDemo.vue —— 组件化开发演示页

  涵盖：defineProps（父传子）、defineEmits（子传父）、插槽、具名插槽、容器vs展示
-->
<script setup>
import { ref, reactive } from 'vue'

// ===== 组件 =====
import Child from '../components/Child.vue'
import SlotChild from '../components/SlotChild.vue'
import Layout from '../components/Layout.vue'
import TodoItem from '../components/TodoItem.vue'

// ===== Props 演示 =====
const msgFromChild = ref('')

function handleMsg(msg) {
  msgFromChild.value = msg
}

// ===== 待办演示（容器 vs 展示）=====
const inputVal = ref('')
const todoList = reactive([
  { id: 1, name: '学 Vue 3' },
  { id: 2, name: '练组件复用' }
])

function addTodo() {
  if (!inputVal.value.trim()) return
  todoList.push({ id: Date.now(), name: inputVal.value })
  inputVal.value = ''
}
function delTodo(id) {
  const idx = todoList.findIndex(item => item.id === id)
  if (idx !== -1) todoList.splice(idx, 1)
}
</script>

<template>
  <div class="demo-page">
    <h1>🧩 组件化开发</h1>
    <p class="subtitle">Props 父传子 · Emits 子传父 · 插槽 · 具名插槽 · 容器 vs 展示</p>

    <!-- ============================================ -->
    <!-- 一、父传子 defineProps -->
    <!-- ============================================ -->
    <section class="section">
      <h2>一、defineProps —— 父传子</h2>
      <p class="desc">父组件通过 <code>:属性名="数据"</code> 传值，子组件通过 <code>defineProps</code> 接收。</p>

      <div class="demo-zone">
        <div class="row">
          <Child :name="'小明'" :age="18" @send-msg="handleMsg" />
          <Child :name="'小红'" :age="20" @send-msg="handleMsg" />
          <Child />
        </div>
        <p class="hint" v-if="msgFromChild">收到子组件消息：{{ msgFromChild }}</p>
      </div>
    </section>

    <!-- ============================================ -->
    <!-- 二、子传父 defineEmits -->
    <!-- ============================================ -->
    <section class="section">
      <h2>二、defineEmits —— 子传父</h2>
      <p class="desc">子组件用 <code>emit('事件名', 数据)</code> 通知父组件，父组件用 <code>@事件名</code> 监听。</p>

      <div class="demo-zone">
        <Child :name="'测试'" :age="99" @send-msg="handleMsg" />
        <p class="msg-box" v-if="msgFromChild">📩 父组件收到：<strong>{{ msgFromChild }}</strong></p>
        <p class="hint">点击子组件的按钮，看消息怎么传上来。</p>
      </div>
    </section>

    <!-- ============================================ -->
    <!-- 三、插槽 slot -->
    <!-- ============================================ -->
    <section class="section">
      <h2>三、插槽 <code>&lt;slot /&gt;</code></h2>
      <p class="desc">子组件留个"坑位"，父组件往里面塞 HTML。</p>

      <div class="demo-zone">
        <div class="row">
          <SlotChild>
            <p>👍 这是卡片内容</p>
            <button style="padding:6px 16px;background:#42b883;color:white;border:none;border-radius:4px;">按钮</button>
          </SlotChild>
          <SlotChild>
            <img src="https://cn.vuejs.org/logo.svg" width="50" />
            <p style="font-size:13px;color:#999;">Vue Logo</p>
          </SlotChild>
        </div>
      </div>
    </section>

    <!-- ============================================ -->
    <!-- 四、具名插槽 -->
    <!-- ============================================ -->
    <section class="section">
      <h2>四、具名插槽 <code>#name</code></h2>
      <p class="desc">一个组件有多个插槽，用 name 区分，父组件通过 <code>#header</code> 指定填到哪个坑。</p>

      <div class="demo-zone">
        <Layout>
          <template #header>🟢 网站标题</template>
          <p>这里是主要内容区域，可以放任何东西。</p>
          <template #footer>📋 版权信息 © 2026</template>
        </Layout>
      </div>
    </section>

    <!-- ============================================ -->
    <!-- 五、容器组件 vs 展示组件 -->
    <!-- ============================================ -->
    <section class="section">
      <h2>五、容器组件 vs 展示组件</h2>
      <p class="desc">容器管数据（增删改查），展示只管显示（props + emit）。</p>

      <div class="demo-zone">
        <h3 style="margin:0 0 10px 0;font-size:16px;">📋 待办列表（容器 App.vue + 展示 TodoItem）</h3>
        <p style="font-size:13px;color:#999;">共 {{ todoList.length }} 项</p>
        <p>
          <input v-model="inputVal" @keyup.enter="addTodo" placeholder="输入待办" />
          <button @click="addTodo">添加</button>
        </p>
        <TodoItem
          v-for="item in todoList"
          :key="item.id"
          :todo="item"
          @delete-todo="delTodo"
        />
      </div>
    </section>
  </div>
</template>

<style scoped>
.demo-page {
  max-width: 860px;
  margin: 0 auto;
  padding: 30px;
}
h1 { text-align: center; color: #2c3e50; margin-bottom: 5px; }
.subtitle { text-align: center; color: #999; font-size: 14px; margin-bottom: 30px; }

.section {
  background: #f8f8f8;
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 25px;
  border: 2px solid #ddd;
}
.section h2 {
  color: #2c3e50;
  margin: 0 0 8px 0;
  font-size: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #42b883;
}
.section h2 code { background: #e8e8e8; padding: 2px 8px; border-radius: 4px; font-size: 16px; }
.desc { font-size: 13px; color: #999; margin: 0 0 15px 0; }

.demo-zone {
  background: white;
  border-radius: 8px;
  padding: 15px;
  border: 1px solid #eee;
}
.demo-zone p { margin: 8px 0; font-size: 15px; }
.demo-zone button {
  margin: 4px;
  padding: 6px 14px;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.demo-zone button:hover { background: #3aa876; }
.demo-zone input {
  padding: 6px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}
.hint { font-size: 12px; color: #999; margin-top: 8px; }
.msg-box { background: #e8f5e9; padding: 10px; border-radius: 6px; margin-top: 10px; }
.row { display: flex; gap: 15px; }
.row > * { flex: 1; }
</style>
