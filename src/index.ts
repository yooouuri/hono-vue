import { Hono } from 'hono'
import server from './server'

const app = new Hono()
app.route('/api', server)
