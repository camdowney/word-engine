export function useStore(initial, key) {
  if (!key) return
  if (!window.FernStore) window.FernStore = {}
  if (!window.FernStore[key]) window.FernStore[key] = initial

  return [window.FernStore[key], val => window.FernStore[key] = val]
}

export function render(origin, props, curr) {
  if (!origin) return

  const created = createElement(props)
  const id = created.firstChild?.id
  const current = (id && document.querySelector(`#${id}`)) || curr
  let newElement = null

  if (current) {
    const parent = current.parentNode
    const index = Array.prototype.indexOf.call(parent.children, current)
    current.dispatchEvent(new Event('unmount'))
    current.querySelectorAll('*').forEach(e => e.dispatchEvent(new Event('unmount')))
    parent.replaceChild(created, current)
    newElement = parent.children[index]
  }
  else {
    const index = origin.children.length
    origin.append(created)
    newElement = origin.children[index]
  }
  
  newElement.dispatchEvent(new Event('mount'))
  newElement.querySelectorAll('*').forEach(e => e.dispatchEvent(new Event('mount')))
  return newElement
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

  newElement.firstChild.append(createElement(c))

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