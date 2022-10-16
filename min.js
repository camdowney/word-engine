export function useStore(key, initial) {
  if (!key) return
  if (!window.FernStore) window.FernStore = {}
  if (!window.FernStore[key]) window.FernStore[key] = initial

  try { throw new Error }
  catch(e) { console.log(e.stack) }

  return [window.FernStore[key], val => window.FernStore[key] = val]
}

export function render(origin, props) {
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
  Object.entries(props).forEach(([key, value]) => key.startsWith('_') 
    ? listeners[key.substring(1)] = value 
    : cleanProps[key] = value)

  if (!isChild) {
    cleanProps.data_component_id = useStore('components.index', { index: 0 }).index++
  }
  const { t, c, ...atts } = cleanProps

  const newElement = createFragment(createHTML(t, atts))

  Object.entries(listeners).forEach(([key, value]) => Array.isArray(value) 
    ? newElement.firstChild.addEventListener(key, e => value.forEach(l => l(e)))
    : newElement.firstChild.addEventListener(key, value))

  if (typeof c === 'string') newElement.firstChild.append(createFragment(c))
  else if (Array.isArray(c)) newElement.firstChild.append(createElement(c, true))

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
  const attHTML = Object.entries(atts).filter(([key, val]) => val !== undefined).map(attString).join('')
  return `<${tag} ${attHTML}></${tag}>`
}

function createFragment(html) {
  return document.createRange().createContextualFragment(html)
}