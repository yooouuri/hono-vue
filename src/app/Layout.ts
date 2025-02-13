import { defineComponent, h, resolveComponent } from 'vue'
import { useRoute } from 'vue-router'

const modules = import.meta.glob('./layout/*.vue', { eager: true })

let layouts: Record<string, any> = {}
const regex = /^\.\/layout\/(.+?)\.vue$/; // Define regex once

Object.entries(modules).forEach(([key, component]) => {
  const match = key.match(regex)
  if (match) {
    const name = match[1]
    layouts[name] = component
  }
})

const Layout = defineComponent({
  setup(props, { slots }) {
    const route = useRoute()

    return () => {
      return h(
        layouts[route.meta.layout ?? 'default'].default,
        null,
        slots.default
      )
    }
  }
})

export default Layout
