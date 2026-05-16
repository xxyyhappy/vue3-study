<template>
  <div class="InjectDemoChild2">
    <h2>{{ mycount }}</h2>
  </div>
</template>

<script setup>
defineOptions({ name: "InjectDemoChild2" });
import { inject } from "vue";
const mycount = inject("mycount");
</script>

<style scoped>
.InjectDemoChild2 {
}
</style>
