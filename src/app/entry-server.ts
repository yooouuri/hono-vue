import { markRaw } from 'vue'
import { createApp } from './main'
import { renderToString } from 'vue/server-renderer'
import { serializeTreeMap } from '@pinia/colada'

export async function render(url: string) {
  const { app, pinia, router } = createApp()

  await router.push(url.replace(router.options.history.base, ''))
  await router.isReady()

  const ctx = {}

  const html = await renderToString(app, ctx)

  return {
    html,
    payload: {
      pinia_colada: markRaw(serializeTreeMap(
        pinia.state.value._pc_query?.caches
      ))
    }
  }
}
