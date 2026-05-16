<!--
  ProvideInjectDemo.vue —— Provide / Inject 演示页

  涵盖：基础 provide/inject、响应式数据、readonly、Symbol key
-->
<script setup>
import { provide, ref, computed, readonly } from "vue";
import { THEME_KEY } from "../utils/injectKeys.js";
import InjectDemoChild from "../components/InjectDemoChild.vue";
import { useDataStore } from "../stores/globalData";

// ===== 1. 基础 provide（普通值） =====
provide("appName", "Vue 3 学习项目");
provide("version", "1.0.0");

// ===== 2. 响应式数据 provide =====
const count = ref(0);
const doubleCount = computed(() => count.value * 2);
const globalData = useDataStore();

provide("count", count);
provide("doubleCount", doubleCount);

// ===== 3. readonly + 修改函数（最佳实践） =====
provide("readonlyCount", readonly(count));
provide("mycount", doubleCount);

function increment() {
  count.value++;
}
function reset() {
  count.value = 0;
}

provide("increment", increment);
provide("reset", reset);

// ===== 4. Symbol key =====
provide(THEME_KEY, "dark");
</script>

<template>
  <div class="demo-page">
    <h1>Provide / Inject（依赖注入）</h1>
    <h2>
      pinia全局数据：{{ globalData.stores.name }}第二个参数：{{
        globalData.stores.age
      }}
    </h2>
    <p class="subtitle">
      解决 prop 逐层透传问题，祖先组件提供数据，后代组件直接拿
    </p>

    <!-- ============================================ -->
    <!-- 第一部分：概念对比 -->
    <!-- ============================================ -->
    <section class="section">
      <h2>一、Props 逐层透传 vs Provide/Inject</h2>

      <div class="comparison">
        <div class="compare-card bad">
          <h3>Props 透传（问题）</h3>
          <pre><code>App ──provide: "数据在这"
  └── Layout ──prop: 帮我传一下
        └── Sidebar ──prop: 再帮我传一下
              └── UserInfo ← 终于拿到了</code></pre>
          <p class="bad-label">中间组件不想要数据，但被迫帮忙传</p>
        </div>

        <div class="compare-card good">
          <h3>Provide/Inject（解决方案）</h3>
          <pre><code>App ──provide: "数据在这"
  └── Layout（不用管）
        └── Sidebar（不用管）
              └── UserInfo ──inject: 拿到了</code></pre>
          <p class="good-label">不管隔多少层，需要数据的组件直接拿</p>
        </div>
      </div>
    </section>

    <!-- ============================================ -->
    <!-- 第二部分：基础演示 -->
    <!-- ============================================ -->
    <section class="section">
      <h2>二、基础演示</h2>
      <p class="desc">
        父组件通过 <code>provide()</code> 提供数据，子组件通过
        <code>inject()</code> 直接获取，中间不用 prop 传递。
      </p>

      <div class="demo-zone">
        <div class="parent-area">
          <h3>父组件（provide）</h3>
          <div class="info-row">
            <span class="label">提供的数据：</span>
          </div>
          <div class="provided-data">
            <code>appName: "Vue 3 学习项目"</code>
            <code>version: "1.0.0"</code>
            <code>count: {{ count }}</code>
          </div>
          <div class="btn-group">
            <button class="btn" @click="increment">+1</button>
            <button class="btn btn-reset" @click="reset">重置</button>
          </div>
        </div>

        <!-- 子组件在这 inject -->
        <InjectDemoChild />
      </div>

      <p class="note">
        中间的 Layout / Sidebar 组件不需要写任何 props，数据直接穿透到
        InjectDemoChild。
      </p>
    </section>

    <!-- ============================================ -->
    <!-- 第三部分：流程图 -->
    <!-- ============================================ -->
    <section class="section">
      <h2>三、数据流向图</h2>

      <div class="flow-diagram">
        <div class="flow-node provider">
          <strong>App (provide)</strong>
          <span>提供 count、appName、version...</span>
        </div>
        <div class="flow-arrow">↓</div>
        <div class="flow-node skip">
          <strong>Layout</strong>
          <span>不需要任何数据 ✗</span>
        </div>
        <div class="flow-arrow">↓</div>
        <div class="flow-node skip">
          <strong>Sidebar</strong>
          <span>不需要任何数据 ✗</span>
        </div>
        <div class="flow-arrow">↓</div>
        <div class="flow-node injector">
          <strong>InjectDemoChild (inject)</strong>
          <span>直接拿到 count: {{ count }}</span>
        </div>
        <div class="flow-arrow up">↑ readonly + provide 修改函数</div>
        <div class="flow-node provider">
          <strong>父组件更新数据</strong>
          <span>子组件自动重新渲染</span>
        </div>
      </div>
    </section>

    <!-- ============================================ -->
    <!-- 第四部分：核心代码 -->
    <!-- ============================================ -->
    <section class="section">
      <h2>四、核心代码</h2>

      <div class="demo-zone code-zone">
        <h3>provide（父组件）</h3>
        <pre><code>import { provide, ref, computed, readonly } from "vue";

// 1. 基础值
provide("appName", "Vue 3 学习项目");
provide("version", "1.0.0");

// 2. 响应式数据
const count = ref(0);
provide("count", count);

// 3. readonly + 修改函数（单向数据流）
provide("readonlyCount", readonly(count));
provide("increment", () => count.value++);
provide("reset", () => count.value = 0);

// 4. Symbol key
import { THEME_KEY } from "./keys.js";
provide(THEME_KEY, "dark");</code></pre>
      </div>

      <div class="demo-zone code-zone">
        <h3>inject（子组件）</h3>
        <pre><code>import { inject } from "vue";

const appName = inject("appName");
const count = inject("count");
const increment = inject("increment", () => {});
//                                ↑ 默认值（找不到时使用）

// Symbol key
import { THEME_KEY } from "./keys.js";
const theme = inject(THEME_KEY, "light");</code></pre>
      </div>

      <div class="demo-zone code-zone">
        <h3>Symbol key 统一管理（utils/injectKeys.js）</h3>
        <pre><code>export const THEME_KEY = Symbol("theme");</code></pre>
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

h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 5px;
}

.subtitle {
  text-align: center;
  color: #999;
  font-size: 14px;
  margin-bottom: 30px;
}

.section {
  background: #f8f8f8;
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 25px;
  border: 2px solid #ddd;
}

.section h2 {
  color: #2c3e50;
  margin: 0 0 15px 0;
  font-size: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #42b883;
}

.desc {
  font-size: 13px;
  color: #999;
  margin: 0 0 15px 0;
}

.desc code {
  background: #e8e8e8;
  padding: 2px 6px;
  border-radius: 4px;
}

/* ===== 对比卡片 ===== */
.comparison {
  display: flex;
  gap: 20px;
}

.compare-card {
  flex: 1;
  background: white;
  border-radius: 8px;
  padding: 15px;
  border: 1px solid #eee;
}

.compare-card h3 {
  margin: 0 0 10px 0;
  font-size: 14px;
}

.compare-card pre {
  background: #2c3e50;
  color: #f8f8f2;
  padding: 12px;
  border-radius: 6px;
  font-size: 12px;
  line-height: 1.6;
  overflow-x: auto;
}

.bad-label {
  color: #e74c3c;
  font-size: 12px;
  margin: 8px 0 0 0;
}

.good-label {
  color: #42b883;
  font-size: 12px;
  margin: 8px 0 0 0;
}

/* ===== 演示区域 ===== */
.demo-zone {
  background: white;
  border-radius: 8px;
  padding: 15px;
  border: 1px solid #eee;
  margin-bottom: 15px;
}

.demo-zone:last-child {
  margin-bottom: 0;
}

.demo-zone h3 {
  margin: 0 0 10px 0;
  font-size: 15px;
  color: #555;
}

.parent-area {
  background: #e8f8f5;
  border-radius: 8px;
  padding: 15px;
  border: 1px solid #c3e8d8;
}

.parent-area h3 {
  margin: 0 0 12px 0;
  font-size: 15px;
  color: #2c3e50;
  padding-bottom: 8px;
  border-bottom: 1px solid #c3e8d8;
}

.info-row {
  font-size: 14px;
  margin-bottom: 8px;
}

.label {
  color: #777;
}

.provided-data {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin: 8px 0;
}

.provided-data code {
  background: #f0f0f0;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 13px;
}

.btn-group {
  display: flex;
  gap: 10px;
  margin: 12px 0;
}

.btn {
  padding: 8px 20px;
  border: none;
  border-radius: 6px;
  background: #42b883;
  color: white;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;
}

.btn:hover {
  background: #38a076;
}

.btn-reset {
  background: #e74c3c;
}

.btn-reset:hover {
  background: #c0392b;
}

.note {
  font-size: 13px;
  color: #888;
  text-align: center;
  margin: 10px 0 0 0;
  font-style: italic;
}

/* ===== 流程图 ===== */
.flow-diagram {
  background: white;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.flow-node {
  width: 280px;
  padding: 12px 20px;
  border-radius: 8px;
  text-align: center;
}

.flow-node strong {
  display: block;
  margin-bottom: 4px;
}

.flow-node span {
  font-size: 12px;
}

.provider {
  background: #e8f8f5;
  border: 2px solid #42b883;
}

.skip {
  background: #f5f5f5;
  border: 1px dashed #ccc;
  color: #999;
}

.injector {
  background: #fff3cd;
  border: 2px solid #ffc107;
}

.flow-arrow {
  font-size: 20px;
  color: #999;
}

.flow-arrow.up {
  font-size: 13px;
  color: #42b883;
  margin-top: 4px;
}

/* ===== Code ===== */
.code-zone pre {
  background: #2c3e50;
  color: #f8f8f2;
  padding: 15px;
  border-radius: 8px;
  overflow-x: auto;
  font-size: 13px;
  line-height: 1.5;
  margin: 0;
}

.code-zone code {
  font-family: "Courier New", Courier, monospace;
}

.hint {
  font-size: 12px;
  color: #999;
  margin-top: 8px;
  text-align: center;
}
</style>
