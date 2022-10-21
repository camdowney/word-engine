/*
  Rules:
  * For useStore(), publicKey is optional, but if used, must
    be in the format 'id.variable'. id must refer to a
    component's id (not just a regular dom element).
*/

let store = {}
let componentMap = {}
let currentProps = {}
let currentID = 0
let nextID = 0
let storeID = 0

export function useStore(initial, publicKey) {
  // TODO: if publicKey, props = componentMap with matching id
  const props = currentProps
  const id = publicKey?.split('.')[0] || currentID
  const key = publicKey || `${id}-${storeID++}`

  if (!store[key]) store[key] = initial

  const setStore = value => {
    store[key] = value
    storeID = 0
    rerender(id, props)
  }

  return [store[key], setStore]
}

export function rerender(id, props) {
  storeID = 0 // remove this once export is no longer needed

  const origin = typeof id === 'string' ? document.querySelector(id) : componentMap[id]
  const parent = origin.parentNode
  const index = Array.prototype.indexOf.call(parent.children, origin)
  
  dispatchAll(origin, 'unmount')
  parent.replaceChild(createElement(props), origin)
  const created = parent.children[index]
  componentMap[id] = created
  dispatchAll(created, 'mount')
}

export function render(parent, props, isChild) {
  const origin = typeof parent === 'string' ? document?.querySelector(parent) : parent

  if (!origin) return

  const isComponent = typeof props?.a === 'function'

  if (isComponent) {
    currentProps = props
    storeID = 0
    currentID = nextID
  }

  origin.append(createElement(props))
  const created = origin.lastChild

  if (isComponent) {
    componentMap[currentID] = created
    nextID++
  }

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

  const { a, c, ...atts } = props

  if (typeof a === 'function') return createElement(a({ c, ...atts }))

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

  if (!c) return created

  Array.isArray(c)
    ? c.forEach(child => render(created.firstChild, child, true))
    : render(created.firstChild, c, true)

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