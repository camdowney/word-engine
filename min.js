export function useStore(initial, key) {
  if (!key) return
  if (!window.FernStore) window.FernStore = {}
  if (!window.FernStore[key]) window.FernStore[key] = initial

  return [window.FernStore[key], val => window.FernStore[key] = val]
}

export function render(origin, props, rerender, isChild) {
  if (!origin) return

  typeof props?.a === 'function' && console.log('component rendered')

  const created = createElement(props)
  let newElement = null

  if (rerender) {
    const parent = origin.parentNode
    const index = Array.prototype.indexOf.call(parent.children, origin)
    dispatchAll(origin, 'unmount')
    parent.replaceChild(created, origin)
    newElement = parent.children[index]
  }
  else {
    origin.append(created)
    newElement = origin.lastChild
  }
  
  if (!isChild) dispatchAll(newElement, 'mount')
  return newElement
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

  const newElement = createFragment(createHTML(a, pureAtts))

  Object.entries(listeners).forEach(([event, callback]) => Array.isArray(callback) 
    ? newElement.firstChild.addEventListener(event, e => callback.forEach(e))
    : newElement.firstChild.addEventListener(event, callback))

  Array.isArray(c)
    ? c.forEach(child => render(newElement.firstChild, child, false, true))
    : render(newElement.firstChild, c, false, true)

  return newElement
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