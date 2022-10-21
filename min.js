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

  const id = (publicKey && components.find((c => c.id === elementID))) || components.length

  const key = publicKey || `${id}-${storeID++}`

  if (!store[key]) store[key] = initial

  const setStore = value => {
    store[key] = value
    rerender(id)
  }

  return [store[key], setStore]
}

export function rerender(id) {
  const origin = components[id]
  const parent = origin.parentNode
  const index = Array.prototype.indexOf.call(parent.children, origin)

  storeID = 0
  currentID = components.length
  
  dispatchAll(origin, 'unmount')
  parent.replaceChild(createElement(props), origin)
  const created = parent.children[index]
  components[id] = created
  dispatchAll(created, 'mount')

  nextID = temp
}

export function render(parent, props, isChild) {
  const origin = typeof parent === 'string' ? document?.querySelector(parent) : parent

  if (!origin) return

  const isComponent = typeof props?.a === 'function'

  const temp = components.length

  if (isComponent) {
    storeID = 0
    components.push({ props })
  }

  origin.append(createElement(props))
  const created = origin.lastChild

  if (isComponent) {
    components[temp] = { id: created?.id, e: created, ...components[temp] }
  }

  const c = props?.c

  if (c) {
    Array.isArray(c)
      ? c.forEach(child => render(created, child, true))
      : render(created, c, true)
  }

  if (!isChild) console.log(components)

  if (!isChild) dispatchAll(created, 'mount')
  return created
}

function dispatchAll(element, event) {
  element.dispatchEvent(new Event(event))
  element.querySelectorAll('*').forEach(e => e.dispatchEvent(new Event(event)))
}

function createElement(props) {
  if (props === undefined) return createFragment('')
  if (Array.isArray(props)) return wrapElements(props.map(createElement))
  if (typeof props !== 'object') return createFragment(props)

  const { a, ...atts } = props
  if (typeof a === 'function') return createElement(a(atts))

  let pureAtts = {}
  let listeners = {}

  Object.entries(atts).forEach(([key, value]) => key.startsWith('_') 
    ? listeners[key.substring(1)] = value 
    : pureAtts[key] = value)

  const created = createFragment(createHTML(a, pureAtts))

  if (!listeners) return created

  Object.entries(listeners).forEach(([event, callback]) => Array.isArray(callback) 
    ? created.firstChild.addEventListener(event, e => callback.forEach(e))
    : created.firstChild.addEventListener(event, callback))

  return created
}

function wrapElements(elements) {
  const wrapper = createFragment('')
  wrapper.append(...elements)
  return wrapper
}

function createHTML(a, atts) {
  const tag = a || 'div'
  const attString = ([att, val]) => `${att.replaceAll('_', '-')}="${val}"`
  const attHTML = Object.entries(atts).filter(([_, val]) => val !== undefined).map(attString).join('')
  return `<${tag} ${attHTML}></${tag}>`
}

function createFragment(html) {
  return document.createRange().createContextualFragment(html)
}