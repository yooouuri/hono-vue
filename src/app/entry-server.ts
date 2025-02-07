import { createApp } from './main'
import { createSSRApp, defineComponent } from 'vue'
import { renderToString, renderToWebStream } from 'vue/server-renderer'

export async function render() {
  const { app } = createApp()

  const ctx = {}

  return renderToString(app, ctx)
}
