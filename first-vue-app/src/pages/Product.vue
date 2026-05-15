<!-- ============================================
  Product.vue —— 商品详情页（动态路由演示）

  功能：
  1. 根据 URL 中的 id 显示不同商品
  2. 上一个/下一个商品跳转
  3. 用表格展示商品详细信息
============================================ -->

<template>
  <div class="product-page">
    <!-- 标题 -->
    <h1>🛒 商品详情</h1>

    <!-- 当前商品 ID（从 URL 获取） -->
    <p class="id-display">当前商品 ID：<span class="id-num">{{ productId }}</span></p>

    <!-- 商品信息卡片 -->
    <div class="product-card" v-if="currentProduct">
      <h2>{{ currentProduct.name }}</h2>
      <p class="price">价格：¥{{ currentProduct.price }}</p>
      <p class="desc">{{ currentProduct.description }}</p>
      <p class="stock">库存：{{ currentProduct.stock }} 件</p>
    </div>

    <!-- 商品不存在的提示 -->
    <div class="not-found" v-else>
      <p>⚠️ 商品 ID {{ productId }} 不存在</p>
      <p>请选择 1-5 号商品</p>
    </div>

    <!-- 导航按钮 -->
    <div class="nav-buttons">
      <!-- 上一个商品：当前 ID 减 1 -->
      <button @click="goPrev" :disabled="productId <= 1">
        ← 上一个商品
      </button>

      <!-- 返回首页 -->
      <button @click="goHome" class="home-btn">
        🏠 返回首页
      </button>

      <!-- 下一个商品：当前 ID 加 1 -->
      <button @click="goNext" :disabled="productId >= 5">
        下一个商品 →
      </button>
    </div>

    <!-- 商品快速跳转 -->
    <div class="quick-links">
      <span>快速跳转：</span>
      <router-link
        v-for="id in 5"
        :key="id"
        :to="{ name: 'product', params: { id } }"
        class="quick-link"
      >
        商品 {{ id }}
      </router-link>
    </div>
  </div>
</template>

<script setup>
// ===== 第一步：引入路由工具 =====
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'

// ===== 第二步：准备模拟数据 =====
// 实际项目中，这些数据从后端 API 获取
// 这里用数组模拟 5 个商品
const productList = [
  {
    id: 11,
    name: 'iPhone 15 Pro',
    price: 8999,
    description: '苹果最新旗舰手机，A17 Pro 芯片',
    stock: 100
  },
  {
    id: 2,
    name: 'MacBook Pro',
    price: 14999,
    description: '14寸 M3 Pro 芯片，32GB 内存',
    stock: 50
  },
  {
    id: 3,
    name: 'AirPods Pro',
    price: 1899,
    description: '主动降噪，空间音频',
    stock: 200
  },
  {
    id: 4,
    name: 'iPad Air',
    price: 4799,
    description: 'M1 芯片，10.9寸屏幕',
    stock: 80
  },
  {
    id: 5,
    name: 'Apple Watch',
    price: 2999,
    description: 'Series 9，心率监测',
    stock: 120
  }
]

// ===== 第三步：获取路由工具 =====
const route = useRoute()   // 读取当前 URL 信息
const router = useRouter() // 执行跳转操作

// ===== 第四步：从 URL 获取商品 ID =====
// 访问 /product/3 时，route.params.id 就是 "3"
// Number() 把字符串转成数字
const productId = computed(() => {
  const id = Number(route.params.id)
  return isNaN(id) ? 1 : id
})

// ===== 第五步：根据 ID 查找商品 =====
// productList.find() 找到第一个 id 等于当前 ID 的商品
const currentProduct = computed(() => {
  return productList.find(item => item.id === productId.value)
})

// ===== 第六步：导航函数 =====

// 跳转到上一个商品（ID - 1）
function goPrev() {
  const newId = productId.value - 1
  if (newId >= 1) {
    router.push({ name: 'product', params: { id: newId } })
  }
}

// 跳转到下一个商品（ID + 1）
function goNext() {
  const newId = productId.value + 1
  if (newId <= 5) {
    router.push({ name: 'product', params: { id: newId } })
  }
}

// 返回首页
function goHome() {
  router.push('/')
}
</script>

<style scoped>
/* 页面容器 */
.product-page {
  max-width: 600px;
  margin: 0 auto;
  padding: 30px;
  text-align: center;
}

/* 标题 */
h1 {
  color: #42b883;
  margin-bottom: 20px;
}

/* ID 显示 */
.id-display {
  font-size: 18px;
  margin-bottom: 20px;
}

.id-num {
  background: #42b883;
  color: white;
  padding: 5px 15px;
  border-radius: 20px;
  font-weight: bold;
}

/* 商品卡片 */
.product-card {
  background: #f8f8f8;
  border: 2px solid #42b883;
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 25px;
}

.product-card h2 {
  color: #333;
  margin-bottom: 15px;
}

.price {
  color: #e74c3c;
  font-size: 24px;
  font-weight: bold;
}

.desc {
  color: #666;
  margin: 10px 0;
}

.stock {
  color: #999;
  font-size: 14px;
}

/* 商品不存在提示 */
.not-found {
  background: #fff3cd;
  border: 1px solid #ffc107;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 25px;
}

/* 导航按钮 */
.nav-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-bottom: 25px;
}

button {
  padding: 12px 25px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s;
}

button:not(:disabled) {
  background: #42b883;
  color: white;
}

button:not(:disabled):hover {
  background: #3aa876;
}

button:disabled {
  background: #ccc;
  color: #999;
  cursor: not-allowed;
}

.home-btn {
  background: #3498db;
}

.home-btn:hover {
  background: #2980b9;
}

/* 快速跳转链接 */
.quick-links {
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

.quick-link {
  padding: 8px 15px;
  background: #eee;
  border-radius: 5px;
  text-decoration: none;
  color: #333;
  transition: all 0.3s;
}

.quick-link:hover {
  background: #42b883;
  color: white;
}

/* 当前选中的快速链接高亮 */
.quick-link.router-link-active {
  background: #42b883;
  color: white;
}
</style>