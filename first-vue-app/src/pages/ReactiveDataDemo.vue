<!--
  ReactiveDataDemo.vue —— 响应式数据演示页

  涵盖：ref、reactive、computed、watch、v-if/v-show、v-for
-->
<script setup>
import { ref, reactive, computed, watch } from 'vue'

// ===== ref =====
const count = ref(0)
const name = ref('小明')
const isOn = ref(false)

// ===== reactive =====
const user = reactive({ name: '小明', age: 18 })
const todoList = reactive(['学 Vue 3', '写代码', '复习笔记'])
const newTodo = ref('')
function addTodo() {
  if (newTodo.value.trim()) { todoList.push(newTodo.value); newTodo.value = '' }
}
function removeTodo(index) { todoList.splice(index, 1) }

// ===== computed =====
const price = ref(10)
const quantity = ref(1)
const total = computed(() => price.value * quantity.value)

// ===== watch =====
const question = ref('')
const answer = ref('')
watch(question, (newVal) => {
  if (newVal.includes('你叫什么'))      answer.value = '我叫 Vue 3'
  else if (newVal.includes('几岁了'))    answer.value = '我 3 岁了'
  else if (newVal.length > 0)           answer.value = '你问的是：' + newVal + '，让我想想...'
  else                                  answer.value = ''
})

// ===== v-if / v-show =====
const showDetail = ref(false)
const viewMode = ref('if')
function toggleView() {
  viewMode.value = viewMode.value === 'if' ? 'show' : 'if'
}

// ===== v-for =====
const fruits = ['苹果', '香蕉', '橘子', '西瓜']
</script>

<template>
  <div class="demo-page">
    <h1>⚡ 响应式数据</h1>
    <p class="subtitle">ref · reactive · computed · watch · 条件渲染 · 列表渲染</p>

    <!-- ============================================ -->
    <!-- 一、ref -->
    <!-- ============================================ -->
    <section class="section">
      <h2>一、ref —— 定义单个响应式数据</h2>
      <p class="desc">JS 中读写要加 <code>.value</code>，模板中直接写变量名。</p>

      <div class="demo-zone">
        <div class="row">
          <div class="card">
            <p>计数：<strong class="big-num">{{ count }}</strong></p>
            <button @click="count++">+1</button>
            <button @click="count--">-1</button>
            <button @click="count = 0">归零</button>
          </div>
          <div class="card">
            <p>名字：<strong>{{ name }}</strong></p>
            <input v-model="name" placeholder="输入新名字" />
          </div>
          <div class="card">
            <p>开关：<strong>{{ isOn ? '开' : '关' }}</strong></p>
            <button @click="isOn = !isOn">切换</button>
            <p v-if="isOn" style="color:#e67e22;">💡 灯亮着</p>
            <p v-else style="color:#999;">💡 灯灭了</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================================ -->
    <!-- 二、reactive -->
    <!-- ============================================ -->
    <section class="section">
      <h2>二、reactive —— 定义对象 / 数组</h2>
      <p class="desc">直接 <code>.属性</code> 访问，不用 <code>.value</code>。</p>

      <div class="demo-zone">
        <p>用户：{{ user.name }}，{{ user.age }} 岁
          <button @click="user.name = '小红'; user.age = 20">改为小红</button>
        </p>
        <p>待办列表：</p>
        <ul>
          <li v-for="(item, i) in todoList" :key="i">
            {{ item }} <button @click="removeTodo(i)">删除</button>
          </li>
        </ul>
        <p>
          <input v-model="newTodo" @keyup.enter="addTodo" placeholder="输入待办" />
          <button @click="addTodo">添加</button>
        </p>
      </div>
    </section>

    <!-- ============================================ -->
    <!-- 三、computed -->
    <!-- ============================================ -->
    <section class="section">
      <h2>三、computed —— 计算属性（有缓存）</h2>
      <p class="desc">根据已有数据自动算出新数据，依赖不变不重新计算。</p>

      <div class="demo-zone">
        <p>单价：<strong>{{ price }}</strong> 元 |
          数量：<button @click="quantity > 1 && quantity--">−</button>
          <strong>{{ quantity }}</strong>
          <button @click="quantity++">+</button>
        </p>
        <p>总价（computed）：<strong class="big-num">¥{{ total }}</strong></p>
      </div>
    </section>

    <!-- ============================================ -->
    <!-- 四、watch -->
    <!-- ============================================ -->
    <section class="section">
      <h2>四、watch —— 侦听器</h2>
      <p class="desc">数据变化时执行操作，像"门卫"一样盯着数据。</p>

      <div class="demo-zone">
        <p><input v-model="question" placeholder="问点啥（试试：你叫什么？几岁了？）" style="width:80%;" /></p>
        <p class="answer" v-if="answer"><strong>🤖 回答：</strong>{{ answer }}</p>
      </div>
    </section>

    <!-- ============================================ -->
    <!-- 五、v-if / v-show -->
    <!-- ============================================ -->
    <section class="section">
      <h2>五、v-if / v-show —— 条件渲染</h2>
      <p class="desc"><code>v-if</code> 真删假不渲染，<code>v-show</code> 只是隐藏（display:none）。</p>

      <div class="demo-zone">
        <button @click="showDetail = !showDetail">{{ showDetail ? '隐藏' : '显示' }}详情</button>
        <p v-show="showDetail" style="background:#fff3cd;padding:10px;border-radius:6px;margin-top:10px;">
          v-show：元素一直存在，只是隐藏（F12 查看 Elements 面板）
        </p>

        <hr style="margin:15px 0;" />

        <button @click="toggleView">切换视图</button>
        <div v-if="viewMode === 'if'" class="demo-box" style="background:#e8f5e9;">
          v-if —— 条件为假时元素不存在于 DOM
        </div>
        <div v-show="viewMode === 'show'" class="demo-box" style="background:#e3f2fd;">
          v-show —— 条件为假时元素还在，只是隐藏
        </div>
      </div>
    </section>

    <!-- ============================================ -->
    <!-- 六、v-for -->
    <!-- ============================================ -->
    <section class="section">
      <h2>六、v-for —— 列表渲染</h2>
      <p class="desc">遍历数组/对象生成列表，记得加 <code>:key</code>。</p>

      <div class="demo-zone">
        <ul>
          <li v-for="(fruit, index) in fruits" :key="index">
            {{ index + 1 }}. {{ fruit }}
          </li>
        </ul>
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
.demo-zone ul { padding-left: 20px; }
.demo-zone li { margin: 4px 0; font-size: 14px; }

.big-num { font-size: 24px; color: #42b883; font-weight: bold; }
.answer { background: #f0f9f4; padding: 10px; border-radius: 6px; margin-top: 10px; }
.demo-box { padding: 15px; border-radius: 6px; margin-top: 10px; font-size: 14px; }
.row { display: flex; gap: 15px; }
.card { flex: 1; padding: 12px; background: #fafafa; border-radius: 8px; border: 1px solid #eee; }
hr { border: none; border-top: 1px solid #ddd; }
</style>
