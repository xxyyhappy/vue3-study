<!--
  InjectDemoChild.vue —— 演示 inject 的子组件

  展示 inject 的各种用法：基础值、响应式数据、readonly、函数
-->
<script setup>
import { inject } from "vue";
import InjectDemoChild2 from "./InjectDemoChild2.vue";
import { useDataStore } from "../stores/globalData";

//使用pina
const globalData = useDataStore();
globalData.updateState("stores", { name: "vue-dem2o", age: 181 });

// ===== 基础 inject =====
const appName = inject("appName");
const version = inject("version");
const mycount = inject("mycount");

// ===== 响应式数据 inject =====
const count = inject("count");
const doubleCount = inject("doubleCount");
//子组件中添加一个provide
// ===== 只读数据 inject =====
const readonlyCount = inject("readonlyCount");

// ===== 修改函数 inject =====
const increment = inject("increment", () => {});
const reset = inject("reset", () => {});

// ===== Symbol key inject =====
const theme = inject("theme", "light");
</script>

<template>
  <div class="inject-demo">
    <h3>子组件（注入的数据）</h3>
    <h2>{{ mycount }}</h2>

    <!-- 基础值 -->
    <div class="info-row">
      <span class="label">应用名称：</span>
      <span class="value">{{ appName }}</span>
    </div>
    <div class="info-row">
      <span class="label">版本号：</span>
      <span class="value">{{ version }}</span>
    </div>

    <!-- 响应式数据 -->
    <div class="info-row">
      <span class="label">响应式 count：</span>
      <span class="value highlight">{{ count }}</span>
    </div>
    <div class="info-row">
      <span class="label">doubleCount（computed）：</span>
      <span class="value highlight">{{ doubleCount }}</span>
    </div>

    <!-- 按钮调用父组件提供的函数 -->
    <div class="btn-group">
      <button class="btn" @click="increment">+1（通过函数）</button>
      <button class="btn btn-reset" @click="reset">重置</button>
    </div>

    <p class="hint">
      子组件不直接修改 count，而是调用父组件提供的函数 → 单向数据流
    </p>

    <!-- readonly 演示 -->
    <div class="info-row">
      <span class="label">readonly count（只读）：</span>
      <span class="value muted">{{ readonlyCount }}</span>
    </div>

    <!-- Symbol key -->
    <div class="info-row">
      <span class="label">主题（Symbol key）：</span>
      <span class="value">{{ theme }}</span>
    </div>
  </div>
  <InjectDemoChild2 />
</template>

<style scoped>
.inject-demo {
  background: #f0f8ff;
  border: 1px solid #b3d9ff;
  border-radius: 8px;
  padding: 20px;
  margin-top: 15px;
}

.inject-demo h3 {
  margin: 0 0 15px 0;
  font-size: 15px;
  color: #2c3e50;
  padding-bottom: 8px;
  border-bottom: 1px dashed #b3d9ff;
}

.info-row {
  margin: 5px 0;
  font-size: 14px;
}

.label {
  color: #777;
  display: inline-block;
  min-width: 160px;
}

.value {
  color: #2c3e50;
  font-weight: 600;
}

.value.highlight {
  color: #42b883;
  font-size: 18px;
}

.value.muted {
  color: #999;
}

.btn-group {
  display: flex;
  gap: 10px;
  margin: 12px 0;
}

.btn {
  padding: 6px 16px;
  border: none;
  border-radius: 6px;
  background: #42b883;
  color: white;
  cursor: pointer;
  font-size: 13px;
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

.hint {
  font-size: 12px;
  color: #999;
  margin: 5px 0 0 0;
}
</style>
