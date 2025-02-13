import { defineConfig, type Plugin, type ResolvedConfig, type ViteDevServer } from 'vite'
import vue from '@vitejs/plugin-vue'
import devServer from '@hono/vite-dev-server'
// import build from '@hono/vite-build/cloudflare-pages'
import { parseModule } from 'magicast'
import adapter from '@hono/vite-dev-server/cloudflare'
import VueRouter from 'unplugin-vue-router/vite'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

declare global {
  var vite: ViteDevServer
}

const plugin = (): Plugin => {
  let config: ResolvedConfig
  let server: ViteDevServer

  return {
    name: 'vite-plugin-hono-vue',
    configResolved(resolvedConfig) {
      config = resolvedConfig
    },
    configureServer(_server) {
      server = _server
      globalThis.vite = server
    },
    async transform(code, id) {
      if (id.endsWith('src/index.ts')) {
        let template

        if (config.command === 'serve') {
          template = readFileSync(
            resolve(dirname(fileURLToPath(import.meta.url)), 'index.html'),
            'utf-8',
          )
        // } else {
        //   template = htmlFromClientBuild
        }

        const mod = parseModule(`import { HTTPException } from 'hono/http-exception'
import { render } from './app/entry-server'
${code}
app.get('*', async (c, next) => {
  try {
    let template = \`${template}\`

    const url = new URL(c.req.url)

    const { html, payload } = await render(url.pathname)

    if (import.meta.env.SSR && import.meta.env.DEV) {
      template = await globalThis.vite.transformIndexHtml(url.pathname, template)
    }

    template = template.replace('<!--app-html-->', html)
    template = template.replace('<!--payload-->', '<script>window.__payload = ' + JSON.stringify(payload) + '</script>')

    return c.html(template)
  } catch (e) {
    if (import.meta.env.DEV) {
      globalThis.vite.ssrFixStacktrace(e)

      console.error(e) // TODO show error overlay

      throw new HTTPException(500, { cause: e })
    }

    throw new HTTPException(500)
  }
})

export default app`)

        return mod.generate()
      }
    },
  }
}

export default defineConfig(({ mode }) => ({
  ssr: {
    noExternal: mode === 'development' ? ['vue-router'] : [],
  },
  plugins: [
    VueRouter({
      routesFolder: 'src/app/pages',
    }),
    vue(),
    devServer({
      entry: 'src/index.ts',
      adapter,
      exclude: [
        /.*\.css$/,
        /.*\.vue$/,
        /.*\.ts$/,
        /.*\.tsx$/,
        /^\/@.+$/,
        /\?t\=\d+$/,
        /^\/favicon\.ico$/,
        /^\/static\/.+/,
        /^\/node_modules\/.*/,
        /^\/__vue-router\/.+/
      ],
      injectClientScript: false,
    }),
    plugin(),
  ],
  appType: 'custom',
}))
