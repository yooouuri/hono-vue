import { hydrateQueryCache, useQueryCache } from '@pinia/colada'
import { createApp } from './main'

const { app, pinia } = createApp()

hydrateQueryCache(
  useQueryCache(pinia),
  window.__payload.pinia_colada // TODO: fix hydration mismatch
)

app.mount('#app')
