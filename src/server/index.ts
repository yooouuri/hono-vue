import { Hono } from 'hono'

const app = new Hono()

const route = app
  .get('/foo', (c) => c.json({ bar: 'baz' }))

export type AppType = typeof route
export default app
