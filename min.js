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

  const id = (publicKey && components.find((c => c.id === elementID))) || currentID

  const key = publicKey || `${id}-${storeID++}`

  if (!store[key]) store[key] = initial

  const setStore = value => {
    store[key] = value
    rerender(id)
  }

  return [store[key], setStore]
}

export function rerender(cid) {
  const { e, props } = components[cid]

  currentID = cid
  
  dispatchAll(e, 'unmount')
  render(e, props, false, true)

  currentID = components.length
}

export function render(parent, props, isChild, replace) {
  if (!parent) return

  const origin = typeof parent === 'string' ? document?.querySelector(parent) : parent

  if (props === undefined) return origin.append(createFragment(''))
  if (typeof props === 'string') return origin.append(createFragment(props))
  if (Array.isArray(props)) return props.forEach(p => render(origin, p, true))

  const { a, ...rest } = props

  const isComponent = typeof a === 'function'

  if (isComponent) storeID = 0

  const { c, ...atts } = isComponent ? a(rest) : props

  let created = null

  if (replace) {
    const parent2 = parent.parentNode
    const index = [...parent2.children].indexOf(parent)
    parent2.replaceChild(createElement(atts), parent)
    created = parent2.children[index]
  }
  else {
    origin.append(createElement(atts))
    created = origin.lastChild
  }

  

  if (isComponent) {
    components[currentID++] = { id: created?.id, e: created, props }
  }

  if (c) render(created, c, true)

  if (!isChild) console.log(components)

  if (!isChild) dispatchAll(created, 'mount')
  return created
}

function dispatchAll(element, event) {
  element.dispatchEvent(new Event(event))
  element.querySelectorAll('*').forEach(e => e.dispatchEvent(new Event(event)))
}

function createElement(props) {
  const { a, ...atts } = props

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

function createHTML(a, atts) {
  const tag = a || 'div'
  const attString = ([att, val]) => `${att.replaceAll('_', '-')}="${val}"`
  const attHTML = Object.entries(atts).filter(([_, val]) => val !== undefined).map(attString).join('')
  return `<${tag} ${attHTML}></${tag}>`
}

function createFragment(html) {
  return document.createRange().createContextualFragment(html)
}