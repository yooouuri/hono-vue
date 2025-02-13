import { createSSRApp } from 'vue'
import { createPinia } from 'pinia'
import { PiniaColada } from '@pinia/colada'
import { routes } from 'vue-router/auto-routes' // handleHotUpdate
import App from './App.vue'
import { createMemoryHistory, createRouter, createWebHistory } from 'vue-router'

export function createApp() {
  const app = createSSRApp(App)
  const pinia = createPinia()
  const router = createRouter({
    history: import.meta.env.SSR ?
      createMemoryHistory('/') : createWebHistory('/'),
    routes: routes,
  })
  app.use(pinia)
  app.use(PiniaColada)
  app.use(router)

  return { app, pinia, router }
}
