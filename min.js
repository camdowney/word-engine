let store = {}
let components = []
let currentID = 0
let storeID = 0

export function useStore(initial, publicKey) {
  const cid = currentID
  const key = `${cid}-${storeID++}`

  if (!store[key]) store[key] = initial

  const setStore = value => {
    store[key] = value
    
    const { e, props } = components[cid]
    currentID = cid
  
    e.dispatchEvent(new Event('unmount'))
    e.querySelectorAll('*').forEach(c => c.dispatchEvent(new Event('unmount')))
    render(e, props, true)
  
    currentID = components.length
  }

  return [store[key], setStore]
}

export function render(element, props, replace) {
  if (!element) return

  const origin = typeof element === 'string' ? document?.querySelector(element) : element

  if (props === undefined) return origin.append(createFragment(''))
  if (typeof props === 'string') return origin.append(createFragment(props))
  if (Array.isArray(props)) return props.forEach(p => render(origin, p))

  const { a, ...rest } = props
  const isComponent = typeof a === 'function'

  if (isComponent) storeID = 0

  const { c, ...atts } = isComponent ? a(rest) : props
  let created = null

  if (replace) {
    const parent = origin.parentNode
    const index = [...parent.children].indexOf(origin)
    parent.replaceChild(createElement(atts), origin)
    created = parent.children[index]
  }
  else {
    origin.append(createElement(atts))
    created = origin.lastChild
  }

  if (isComponent) components[currentID++] = { e: created, props }

  if (c) render(created, c)

  created.dispatchEvent(new Event('mount'))
  return created
}

function createElement(props) {
  const { a, ...all } = props

  let effects = {}
  let listeners = {}
  let atts = {}

  Object.entries(all).forEach(([key, value]) => 
    key.startsWith('__') ? effects[key.substring(2)] = value 
    : key.startsWith('_') ? listeners[key.substring(1)] = value 
    : atts[key] = value)

  const tag = a || 'div'
  const att = ([key, value]) => `${key.replaceAll('_', '-')}="${value}"`
  const attHTML = Object.entries(atts).filter(([_, val]) => val !== undefined).map(att).join('')
  const created = createFragment(`<${tag} ${attHTML}></${tag}>`)

  if (Object.keys(effects).length > 0) {
    const toArray = value => !value ? [] : Array.isArray(value) ? value : [value]

    listeners.mount = toArray(listeners.mount)
    listeners.unmount = toArray(listeners.unmount)

    Object.entries(effects).forEach(([event, callback]) => {
      listeners.mount.push(() => window.addEventListener(event, callback))
      listeners.unmount.push(() => window.removeEventListener(event, callback))
    })
  }

  if (Object.keys(listeners).length < 1) return created

  console.log(listeners)

  Object.entries(listeners).forEach(([event, callback]) => Array.isArray(callback) 
    ? created.firstChild.addEventListener(event, e => callback.forEach(c => c(e)))
    : created.firstChild.addEventListener(event, callback))

  return created
}

function createFragment(html) {
  return document.createRange().createContextualFragment(html)
}