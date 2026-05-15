<!--
  TemplateSyntaxDemo.vue —— 模板语法演示页

  涵盖：插值表达式、v-text/v-html、v-bind、v-on、v-model
-->
<script setup>
import { ref } from 'vue'

// ===== 插值表达式 =====
const name = '小明'
const age = 18
const score = 85

// ===== v-text / v-html =====
const htmlText = '这是一段<b>加粗</b>的文字'

// ===== v-bind =====
const logoUrl = 'https://cn.vuejs.org/logo.svg'
const isActive = ref(false)
const textColor = 'red'

// ===== v-on =====
const count = ref(0)
function add() { count.value++ }
function sub() { count.value-- }

// ===== v-model =====
const message = ref('默认文字')
const agree = ref(false)
const framework = ref('')
</script>

<template>
  <div class="demo-page">
    <h1>📝 模板语法</h1>
    <p class="subtitle">插值表达式 · v-text/v-html · v-bind · v-on · v-model</p>

    <!-- ============================================ -->
    <!-- 一、插值表达式 -->
    <!-- ============================================ -->
    <section class="section">
      <h2>一、插值表达式 <code v-text="'{{ }}'"></code></h2>
      <p class="desc">在 HTML 中挖个洞，把 JS 变量的值填进去。</p>

      <div class="demo-zone">
        <p>大家好，我是 <strong>{{ name }}</strong></p>
        <p>我今年 {{ age }} 岁，10 年后我 <strong>{{ age + 10 }}</strong> 岁</p>
        <p>成绩：{{ score }} 分，{{ score >= 60 ? '及格' : '不及格' }}</p>
      </div>
    </section>

    <!-- ============================================ -->
    <!-- 二、v-text / v-html -->
    <!-- ============================================ -->
    <section class="section">
      <h2>二、v-text / v-html —— 显示文本和 HTML</h2>
      <p class="desc"><code>v-text</code> 显示纯文本，<code>v-html</code> 渲染 HTML 标签。</p>

      <div class="demo-zone">
        <div class="row">
          <div class="card-mini">
            <p class="label"><code>v-text</code>（纯文本）</p>
            <p class="box" v-text="htmlText"></p>
          </div>
          <div class="card-mini">
            <p class="label"><code>v-html</code>（渲染标签）</p>
            <p class="box" v-html="htmlText"></p>
          </div>
        </div>
        <p class="hint">⚠️ 注意：v-html 有 XSS 风险，用户输入的内容不要用！</p>
      </div>
    </section>

    <!-- ============================================ -->
    <!-- 三、v-bind -->
    <!-- ============================================ -->
    <section class="section">
      <h2>三、v-bind —— 动态绑定属性 <code>:属性名</code></h2>
      <p class="desc">让 HTML 属性的值变成动态的。</p>

      <div class="demo-zone">
        <img :src="logoUrl" width="60" />
        <a :href="'https://cn.vuejs.org/'" target="_blank">Vue 官网</a>

        <p :class="{ active: isActive }" :style="{ color: textColor, fontWeight: 'bold' }"
           style="margin-top: 12px; padding: 8px; border-radius: 6px; background: #f0f0f0;">
          {{ isActive ? '✅ 激活状态' : '⬜ 未激活' }}
        </p>
        <button @click="isActive = !isActive">切换激活状态</button>
      </div>
    </section>

    <!-- ============================================ -->
    <!-- 四、v-on -->
    <!-- ============================================ -->
    <section class="section">
      <h2>四、v-on —— 事件绑定 <code>@事件名</code></h2>
      <p class="desc">监听用户的操作，触发 JS 函数。</p>

      <div class="demo-zone">
        <p>计数器：<strong class="big-num">{{ count }}</strong></p>
        <button @click="add">+1</button>
        <button @click="sub">-1</button>
        <button @click="count = 0">归零</button>
        <p class="hint">试试双击数字：<span @dblclick="count = count + 5" style="cursor:pointer;">双击我 +5</span></p>
      </div>
    </section>

    <!-- ============================================ -->
    <!-- 五、v-model -->
    <!-- ============================================ -->
    <section class="section">
      <h2>五、v-model —— 双向绑定</h2>
      <p class="desc">输入框和变量"绑"在一起，一边变，另一边自动跟着变。</p>

      <div class="demo-zone">
        <p><label>输入文字：<input v-model="message" /></label></p>
        <p>你输入的是：<strong>{{ message }}</strong></p>

        <p><input type="checkbox" v-model="agree" /> 我同意以上条款（{{ agree }}）</p>

        <p>
          <select v-model="framework">
            <option value="" disabled>—— 请选择 ——</option>
            <option value="vue">Vue</option>
            <option value="react">React</option>
            <option value="angular">Angular</option>
          </select>
          &nbsp;你选了：<strong>{{ framework || '（未选择）' }}</strong>
        </p>
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
  padding: 8px 16px;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.demo-zone button:hover { background: #3aa876; }
.demo-zone input, .demo-zone select {
  padding: 6px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}
.hint { font-size: 12px; color: #999; margin-top: 8px; }
.big-num { font-size: 24px; color: #42b883; }

.row { display: flex; gap: 15px; }
.card-mini { flex: 1; }
.label { font-size: 13px; color: #999; margin-bottom: 6px; }
.box {
  padding: 12px;
  background: #f5f5f5;
  border-radius: 6px;
  min-height: 30px;
}
.active { background: #42b883 !important; color: white; border-radius: 6px; padding: 8px !important; }

a { color: #42b883; margin-left: 15px; }
img { vertical-align: middle; }
</style>
