<template>
  <button @click="handleClick">
    {{ btnText }}
  </button>
</template>

<script setup>
const props = defineProps(['btnText'])
const emit = defineEmits(['clickBtn'])

const handleClick = () => {
  emit('clickBtn', '我被点击了')
}
</script>