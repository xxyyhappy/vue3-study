<!--
  AdvComponentsDemo.vue —— 组件进阶演示页

  涵盖：Slot 插槽（基础/具名/作用域/后备内容）
        动态组件 + KeepAlive
        Teleport 传送门
        Suspense 异步组件
-->
<script setup>
import { ref } from "vue";

// ===== Slot 演示组件 =====
import SlotBasic from "../components/adv/SlotBasic.vue";
import SlotNamed from "../components/adv/SlotNamed.vue";
import SlotScoped from "../components/adv/SlotScoped.vue";
import MyBtnSlot from "../components/adv/MyBtnSlot.vue";

// ===== 动态组件 Tab =====
import TabA from "../components/adv/TabA.vue";
import TabB from "../components/adv/TabB.vue";
import TabC from "../components/adv/TabC.vue";
import TabD from "../components/adv/TabD.vue";

// ===== Teleport =====
import TeleportModal from "../components/adv/TeleportModal.vue";

// ===== Suspense =====
import AsyncComp from "../components/adv/AsyncComp.vue";

// ========== 状态 ==========

// --- 动态组件：当前选中的 Tab ---
const currentTab = ref(TabA);
const tabs = [
  { label: "Tab A 计数器", comp: TabA },
  { label: "Tab B 输入框", comp: TabB },
  { label: "Tab C 待办", comp: TabC },
  { label: "Tab D 待办", comp: TabD },
];

function switchTab(comp) {
  currentTab.value = comp;
}

// --- KeepAlive 开关 ---
const useKeepAlive = ref(false);

// --- Suspense 显示控制 ---
const showAsync = ref(false);
</script>

<template>
  <div class="adv-page">
    <h1>🔧 组件进阶</h1>
    <p class="subtitle">
      Slot 插槽 · 动态组件 · KeepAlive · Teleport · Suspense
    </p>

    <!-- ============================================ -->
    <!-- 第一部分：Slot 插槽 -->
    <!-- ============================================ -->
    <section class="section">
      <h2>一、Slot 插槽 —— 父组件往子组件塞 HTML</h2>

      <!-- 1a. 基础插槽 -->
      <div class="demo-zone">
        <h3>1a. 基础插槽：<code>&lt;slot /&gt;</code></h3>
        <p class="demo-desc">子组件留个"坑"，父组件塞什么就显示什么。</p>

        <div class="demo-row">
          <SlotBasic>
            <p>👍 我是父组件传进来的内容！</p>
            <button
              style="
                padding: 6px 16px;
                background: #42b883;
                color: white;
                border: none;
                border-radius: 4px;
              "
            >
              自定义按钮
            </button>
          </SlotBasic>

          <SlotBasic>
            <em style="color: #999"
              >这个卡片只传了一行斜体文字,使用同样的插槽</em
            >
          </SlotBasic>
        </div>
      </div>

      <!-- 1b. 后备内容 -->
      <div class="demo-zone">
        <h3>1b. 后备内容：<code>&lt;slot&gt;默认值&lt;/slot&gt;</code></h3>
        <p class="demo-desc">父组件没传内容时，显示默认文字。</p>

        <MyBtnSlot />
        <!-- 显示"提交" -->
        <MyBtnSlot>保存</MyBtnSlot>
        <!-- 显示"保存" -->
        <MyBtnSlot><span>🚀</span> 发送</MyBtnSlot>
        <!-- 显示"🚀 发送" -->
      </div>

      <!-- 1c. 具名插槽 -->
      <div class="demo-zone">
        <h3>1c. 具名插槽：<code>#name</code></h3>
        <p class="demo-desc">
          一个组件有多个插槽，用 name 区分，就像房子的不同房间。
        </p>

        <SlotNamed>
          <!-- 默认插槽 -->
          <p>📖 这是正文内容，在中间的 main 区域</p>

          <!-- #header = v-slot:header 的简写 -->
          <template #header>
            <h2 style="margin: 0; color: #e67e22">
              🟠 页头区域（具名插槽 header）
            </h2>
          </template>

          <template #footer>
            <p style="margin: 0; color: #999; font-size: 13px">
              📋 页脚区域（具名插槽 footer）—— 版权信息等
            </p>
          </template>
        </SlotNamed>
      </div>

      <!-- 1d. 作用域插槽 -->
      <div class="demo-zone">
        <h3>1d. 作用域插槽：子组件传数据给父组件</h3>
        <p class="demo-desc">
          子组件循环渲染列表，把每项数据
          <code>:product="product"</code> 传给父组件，父组件决定样式。
        </p>

        <SlotScoped v-slot="{ product, index }">
          <!-- ↑ 解构子组件传过来的 product 和 index -->
          <div class="product-item" :class="{ 'sold-out': product.stock < 20 }">
            <span class="prod-index">{{ index + 1 }}.</span>
            <span class="prod-name">{{ product.name }}</span>
            <span
              class="prod-price"
              :style="{ color: product.price < 4 ? '#e74c3c' : '#9b59b6' }"
              >¥{{ product.price }}</span
            >
            <span
              class="prod-stock"
              :style="{ color: product.stock < 20 ? '#e74c3c' : '#42b883' }"
            >
              库存：{{ product.stock }}
            </span>
          </div>
        </SlotScoped>

        <p class="hint">
          注意：库存 &lt; 20 的商品（西瓜）显示为红色 —— 这是父组件决定的样式
        </p>
      </div>
    </section>

    <!-- ============================================ -->
    <!-- 第二部分：动态组件 + KeepAlive -->
    <!-- ============================================ -->
    <section class="section">
      <h2>二、动态组件 + KeepAlive</h2>

      <!-- 切换按钮 -->
      <div class="tab-bar">
        <button
          v-for="tab in tabs"
          :key="tab.label"
          @click="switchTab(tab.comp)"
          class="tab-btn"
          :class="{ active: currentTab === tab.comp }"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- KeepAlive 开关 -->
      <div class="keepalive-toggle">
        <label>
          <input type="checkbox" v-model="useKeepAlive" />
          开启 KeepAlive（缓存组件状态）
        </label>
        <p class="hint">
          当前：{{
            useKeepAlive
              ? '✅ 已开启 —— 切走的 Tab 会被"冷藏"，回来时原封不动'
              : "❌ 未开启 —— 每次切换都会销毁重建"
          }}
        </p>
      </div>

      <!-- 动态组件区域 -->
      <div class="dynamic-zone">
        <p class="zone-label">
          ⬇️ 当前显示：{{ currentTab.__name || currentTab.name }}
        </p>

        <!-- ★ 根据 KeepAlive 开关，决定是否包裹 KeepAlive -->
        <KeepAlive v-if="useKeepAlive">
          <component :is="currentTab" />
        </KeepAlive>
        <component v-else :is="currentTab" />
      </div>
    </section>

    <!-- ============================================ -->
    <!-- 第三部分：Teleport -->
    <!-- ============================================ -->
    <section class="section">
      <h2>三、Teleport —— 传送到 &lt;body&gt; 下</h2>
      <p class="demo-desc">
        模态框用 Teleport 渲染到 <code>&lt;body&gt;</code> 下，避免 CSS 干扰。
      </p>

      <TeleportModal />
    </section>

    <!-- ============================================ -->
    <!-- 第四部分：Suspense -->
    <!-- ============================================ -->
    <section class="section">
      <h2>四、Suspense —— 异步组件加载占位</h2>
      <p class="demo-desc">
        点击按钮后加载异步组件，加载完成前显示"加载中..."。
      </p>

      <button v-if="!showAsync" @click="showAsync = true" class="load-btn">
        加载异步组件
      </button>

      <div v-else>
        <!--
          ★ Suspense 包裹：
          - 默认插槽：异步组件加载完成后显示
          - #fallback：加载过程中显示
        -->
        <Suspense>
          <AsyncComp />

          <template #fallback>
            <div class="loading-placeholder">
              <p>⏳ 加载中，请等待 2 秒...</p>
              <div class="spinner"></div>
            </div>
          </template>
        </Suspense>
      </div>
    </section>
  </div>
</template>

<style scoped>
.adv-page {
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

.demo-zone {
  margin-bottom: 25px;
  padding: 15px;
  background: white;
  border-radius: 8px;
  border: 1px solid #eee;
}

.demo-zone h3 {
  margin: 0 0 8px 0;
  font-size: 16px;
  color: #555;
}

.demo-zone h3 code {
  background: #e8e8e8;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 14px;
}

.demo-desc {
  font-size: 13px;
  color: #999;
  margin: 0 0 15px 0;
}

.demo-row {
  display: flex;
  gap: 20px;
}

.demo-row > * {
  flex: 1;
}

.product-item {
  display: flex;
  gap: 15px;
  align-items: center;
  padding: 8px 12px;
  border-bottom: 1px solid #eee;
  font-size: 14px;
}

.product-item.sold-out {
  background: #fff5f5;
}

.prod-index {
  color: #999;
  min-width: 20px;
}

.prod-name {
  font-weight: bold;
  min-width: 60px;
}

.prod-price {
  color: #e67e22;
  min-width: 50px;
}

.prod-stock {
  font-size: 12px;
}

.hint {
  font-size: 12px;
  color: #999;
  margin-top: 8px;
}

/* ===== Tab 切换按钮 ===== */
.tab-bar {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
}

.tab-btn {
  padding: 8px 18px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
}

.tab-btn:hover {
  border-color: #42b883;
  color: #42b883;
}

.tab-btn.active {
  background: #42b883;
  color: white;
  border-color: #42b883;
}

.keepalive-toggle {
  margin: 10px 0;
  padding: 10px 15px;
  background: #fff8e1;
  border-radius: 6px;
}

.keepalive-toggle label {
  font-size: 14px;
  cursor: pointer;
}

.keepalive-toggle input {
  margin-right: 8px;
}

.dynamic-zone {
  padding: 15px;
  border: 2px dashed #42b883;
  border-radius: 8px;
  min-height: 150px;
}

.zone-label {
  font-size: 12px;
  color: #42b883;
  margin: 0 0 10px 0;
  font-weight: bold;
}

/* ===== Suspense ===== */
.load-btn {
  padding: 10px 24px;
  background: #00bcd4;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.load-btn:hover {
  background: #00acc1;
}

.loading-placeholder {
  padding: 40px;
  text-align: center;
  background: #e0f7fa;
  border-radius: 8px;
  margin: 10px 0;
}

.loading-placeholder p {
  font-size: 16px;
  color: #00838f;
}

.spinner {
  width: 40px;
  height: 40px;
  margin: 15px auto;
  border: 4px solid #ddd;
  border-top-color: #00bcd4;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
