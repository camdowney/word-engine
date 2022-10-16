export function useStore(initial, key) {
  if (!key) return
  if (!window.FernStore) window.FernStore = {}
  if (!window.FernStore[key]) window.FernStore[key] = initial

  return [window.FernStore[key], val => window.FernStore[key] = val]
}

export function render(origin, props) {
  if (!origin) return

  const created = createElement(props)
  const id = created.firstChild?.id
  const current = id && document.querySelector(`#${id}`)
  let newElement = null

  if (current) {
    current.dispatchEvent(new Event('unmount'))
    current.querySelectorAll('*').forEach(e => e.dispatchEvent(new Event('unmount')))
    current.parentNode.replaceChild(created, current)
    newElement = document.querySelector(`#${id}`)
  }
  else {
    const count = origin.children.length
    origin.append(created)
    newElement = origin.children[count]
  }
  
  newElement.dispatchEvent(new Event('mount'))
  newElement.querySelectorAll('*').forEach(e => e.dispatchEvent(new Event('mount')))
  return newElement
}

function createElement(props) {
  if (props === undefined) return createFragment('')
  if (Array.isArray(props)) return wrapElements(props.map(createElement))
  if (typeof props !== 'object') return createFragment(props)

  let cleanProps = { listeners: {} }

  Object.entries(props).forEach(([key, value]) => key.startsWith('_') 
    ? cleanProps.listeners[key.substring(1)] = value 
    : cleanProps[key] = value)

  const { t, c, listeners, ...atts } = cleanProps

  const newElement = createFragment(createHTML(t, atts))

  Object.entries(listeners).forEach(([e, callback]) => Array.isArray(callback) 
    ? newElement.firstChild.addEventListener(e, e => callback.forEach(l => l(e)))
    : newElement.firstChild.addEventListener(e, callback))

  newElement.firstChild.append(createElement(c))

  return newElement
}

function wrapElements(elements) {
  const wrapper = createFragment('')
  wrapper.append(...elements)
  return wrapper
}

function createHTML(t, atts) {
  const tag = t || 'div'
  const attString = ([att, val]) => `${att.replaceAll('_', '-')}="${val}"`
  const attHTML = Object.entries(atts).filter(([_, val]) => val !== undefined).map(attString).join('')
  return `<${tag} ${attHTML}></${tag}>`
}

function createFragment(html) {
  return document.createRange().createContextualFragment(html)
}