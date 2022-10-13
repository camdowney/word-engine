export function useStore(id, initial) {
  if (!id) return
  if (!window.FernStore) window.FernStore = {}
  if (!window.FernStore[id]) window.FernStore[id] = initial ?? {}
  Object.entries(initial).forEach(([key, value]) => window.FernStore[id][key] = window.FernStore[id][key] ?? value)
  return window.FernStore[id]
}

export function render(origin, props) {
  try { throw new Error }
  catch(e) { console.log(e.stack) }

  if (!origin) return

  const created = createElement(props)
  const id = '#' + created.firstChild?.id
  const current = id.length > 1 && document.querySelector(id)
  let newElement = null

  if (current) {
    current.dispatchEvent(new Event('unmount'))
    current.parentNode.replaceChild(created, current)
    newElement = document.querySelector(id)
  }
  else {
    const count = origin.children.length
    origin.append(created)
    newElement = origin.children[count]
  }
  
  newElement.dispatchEvent(new Event('mount'))
  return newElement
}

function createElement(props, isChild = false) {
  if (props === undefined) return createFragment('')
  if (Array.isArray(props)) return wrapElements(props.map(p => createElement(p, true)))
  if (typeof props !== 'object') return createFragment(props)

  let listeners = {}
  let cleanProps = {}
  Object.entries(props).forEach(([key, value]) => 
    key.startsWith('_') ? (listeners[key.substring(1)] = value) : (cleanProps[key] = value))

  if (!isChild) {
    cleanProps.data_component_id = useStore('components.index', { index: 0 }).index++
  }
  const { e, content, children, ...atts } = cleanProps

  const newElement = createFragment(createHTML(e, atts))

  Object.entries(listeners).forEach(([key, value]) => Array.isArray(value) 
    ? newElement.firstChild.addEventListener(key, e => value.forEach(l => l(e)))
    : newElement.firstChild.addEventListener(key, value))

  if (typeof content === 'string') newElement.firstChild.append(createFragment(content))
  if (Array.isArray(children)) newElement.firstChild.append(createElement(children, true))

  return newElement
}

function wrapElements(elements) {
  const wrapper = createFragment('')
  wrapper.append(...elements)
  return wrapper
}

function createHTML(e, atts) {
  const tag = e || 'div'
  const attString = ([att, val]) => `${att.replaceAll('_', '-')}="${val}"`
  const attHTML = Object.entries(atts).filter(([key, val]) => val !== undefined).map(attString).join('')
  return `<${tag} ${attHTML}></${tag}>`
}

function createFragment(html) {
  return document.createRange().createContextualFragment(html)
}