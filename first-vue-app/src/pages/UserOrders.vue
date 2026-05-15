<!-- ============================================
  UserOrders.vue —— 我的订单（嵌套路由子页面）

  访问 /user/orders 时显示
============================================ -->

<template>
  <div class="user-orders">
    <h2>📦 我的订单</h2>

    <!-- 订单列表 -->
    <div v-if="orders.length > 0">
      <div class="order-card" v-for="order in orders" :key="order.id">
        <div class="order-header">
          <span class="order-id">订单号：{{ order.id }}</span>
          <span :class="['order-status', statusClass(order.status)]">
            {{ order.status }}
          </span>
        </div>
        <div class="order-body">
          <p class="order-name">{{ order.product }}</p>
          <p class="order-price">¥{{ order.price }}</p>
          <p class="order-date">{{ order.date }}</p>
        </div>
      </div>
    </div>

    <!-- 没有订单时 -->
    <div class="empty" v-else>
      <p>暂无订单</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 模拟订单数据
const orders = ref([
  { id: '202601150001', product: 'iPhone 15 Pro', price: 8999, date: '2026-01-15', status: '已发货' },
  { id: '202601200002', product: 'AirPods Pro', price: 1899, date: '2026-01-20', status: '待发货' },
  { id: '202602010003', product: 'MacBook Pro', price: 14999, date: '2026-02-01', status: '已完成' }
])

// 根据 order status 返回不同的 CSS class
function statusClass(status) {
  if (status === '已完成') return 'completed'
  if (status === '已发货') return 'shipped'
  if (status === '待发货') return 'pending'
  return ''
}
</script>

<style scoped>
.user-orders h2 {
  color: #42b883;
  margin-bottom: 20px;
}

/* 订单卡片 */
.order-card {
  background: #f8f8f8;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
}

.order-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.order-id {
  color: #999;
  font-size: 14px;
}

/* 订单状态样式 */
.order-status {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 14px;
}

.order-status.completed {
  background: #e8f5e9;
  color: #4caf50;
}

.order-status.shipped {
  background: #e3f2fd;
  color: #2196f3;
}

.order-status.pending {
  background: #fff3e0;
  color: #ff9800;
}

/* 订单内容 */
.order-name {
  font-weight: bold;
  font-size: 16px;
}

.order-price {
  color: #e74c3c;
  font-size: 18px;
  font-weight: bold;
}

.order-date {
  color: #999;
  font-size: 14px;
}

.empty {
  text-align: center;
  padding: 40px;
  color: #999;
}
</style>