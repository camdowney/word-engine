/*
  Rules:
  * For useStore(), publicKey is optional, but if used, must
    be in the format 'id.variable'. id must refer to a
    component's id (not just a regular dom element).
*/

let store = {}
let components = []
let storeID = 0
let currentID = null

export function useStore(initial, publicKey) {
  const elementID = publicKey?.split('.')[0]
  const componentID = (publicKey && components.find((c => c.id === elementID))) || currentID
  const key = publicKey || `${componentID}-${storeID++}`

  if (!store[key]) store[key] = initial

  const setStore = value => {
    store[key] = value
    
    const { e, props } = components[componentID]
    currentID = componentID
  
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

  if (isComponent) {
    components[currentID++] = { id: created?.id, e: created, props }
  }

  if (c) render(created, c)
  created.dispatchEvent(new Event('mount'))
  return created
}

function createElement(props) {
  const { a, ...attsAndListeners } = props

  let atts = {}
  let listeners = {}

  Object.entries(attsAndListeners).forEach(([key, value]) => key.startsWith('_') 
    ? listeners[key.substring(1)] = value 
    : atts[key] = value)

  const tag = a || 'div'
  const att = ([key, value]) => `${key.replaceAll('_', '-')}="${value}"`
  const attHTML = Object.entries(atts).filter(([_, val]) => val !== undefined).map(att).join('')
  const created = createFragment(`<${tag} ${attHTML}></${tag}>`)

  if (!listeners) return created

  Object.entries(listeners).forEach(([event, callback]) => Array.isArray(callback) 
    ? created.firstChild.addEventListener(event, e => callback.forEach(e))
    : created.firstChild.addEventListener(event, callback))

  return created
}

function createFragment(html) {
  return document.createRange().createContextualFragment(html)
}