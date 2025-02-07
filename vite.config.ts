import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import devServer from '@hono/vite-dev-server'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { Hono } from 'hono'
import { stream } from 'hono/streaming'

export default defineConfig(({ mode }) => {
  const plugins = [
    vue(),
    devServer({
      async loadModule(vite) {
        const app = new Hono()

        const server = (await vite.ssrLoadModule('/src/server/index.ts')).default as Hono

        app.route('/api', server)
        app.get('*', async (c) => {
          const { render } = await vite.ssrLoadModule('/src/app/entry-server.ts') as { render: () => Promise<string> }

          let template = readFileSync(resolve('.', 'index.html'),'utf-8',)
          template = await vite.transformIndexHtml('/', template)
          template = template.replace(`<!--app-html-->`, await render())

          return stream(c, async (stream) => {
            c.header('Transfer-Encoding', 'chunked')
            c.header('Content-Type', 'text/html; charset=UTF-8')
      
            await stream.write(template)
            await stream.close()
          })
        })

        return {  
          async fetch(request, env, ctx) {
            return app.fetch(request, env, ctx)
          },
        }
      }
    }),
  ]

  return {
    plugins,
    appType: 'custom',
  }
})
