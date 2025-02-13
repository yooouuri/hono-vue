<script setup lang="ts">
import { ref } from 'vue'
import { useQuery } from '@pinia/colada'
import type { AppType } from '../../server'
import { hc } from 'hono/client'

const value = ref(0)

const client = hc<AppType>('http://localhost:5173/api')

const { state } = useQuery({
  key: ['foo'],
  query: () => client.foo.$get().then((res) => res.json()),
})
</script>

<template>
  <button @click="value++">Click</button>

  {{ value }}

  <div v-if="state.status === 'pending'">
    Loading...
  </div>
  <div v-else-if="state.status === 'error'">
    Error fetching user info: {{ state.error.message }}
  </div>
  <div v-else>
    {{ state.data.bar }}
  </div>
</template>
