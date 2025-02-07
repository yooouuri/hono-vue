import { createSSRApp, defineComponent, h, ref } from 'vue'
import index from './index.vue'

// const index = defineComponent({
//   setup() {
//     const amount = ref(0)

//     function increment() {
//       amount.value++
//     }

//     return () => h('div', [
//       h('p', `Amount: ${amount.value}`),
//       h('button', { onClick: increment }, 'Increment')
//     ])
//   }
// })

export function createApp() {
  const app = createSSRApp(index)

  return { app }
}
