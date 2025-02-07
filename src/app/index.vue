<script setup lang="ts">
import { ref } from 'vue'

const value = ref(0)
</script>

<template>
  <button @click="value++">Click</button>

  {{ value }}
</template>
