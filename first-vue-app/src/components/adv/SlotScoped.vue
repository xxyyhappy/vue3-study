<!--
  SlotScoped.vue —— 作用域插槽演示

  子组件把数据"传出去"，父组件决定怎么渲染。
  适用于：列表渲染但父组件想自定义样式。
-->
<script setup>
const products = [
  { id: 1, name: "苹果", price: 5, stock: 100 },
  { id: 2, name: "香蕉", price: 3, stock: 200 },
  { id: 3, name: "橘子", price: 4, stock: 50 },
  { id: 4, name: "西瓜", price: 15, stock: 10 },
];
</script>

<template>
  <div class="scoped-list">
    <h3>🛒 水果列表（子组件数据）</h3>

    <!--
      v-for 循环遍历 products
      :product="product" —— 把当前商品传给父组件的插槽
      :index="index"     —— 把下标也传过去
    -->
    <slot
      v-for="(product, index) in products"
      :key="product.id"
      :product="product"
      :index="index"
    />
  </div>
</template>

<style scoped>
.scoped-list {
  border: 2px solid #9b59b6;
  border-radius: 10px;
  padding: 20px;
  margin: 10px 0;
  background: #f8f0fc;
}

.scoped-list h3 {
  margin: 0 0 15px 0;
  color: #9b59b6;
}
</style>
