let storage = {}
let components = []
let currentID = 0
let storeID = 0

export function store(initial) {
  const cid = currentID
  const key = `${cid}-${storeID++}`

  if (!storage[key]) storage[key] = initial

  const setStore = value => {
    const { e, props } = components[cid]
    
    storage[key] = value
    currentID = cid
  
    e.dispatchEvent(new Event('unmount'))
    e.querySelectorAll('*').forEach(c => c.dispatchEvent(new Event('unmount')))
    render(e, props, true)
  
    currentID = components.length
  }

  return [storage[key], setStore]
}

export function render(at, props, replace) {
  if (!at) return

  const origin = typeof at === 'string' ? document?.querySelector(at) : at

  if (props === undefined) return origin.append(createFragment(''))
  if (typeof props === 'string') return origin.append(createFragment(props))
  if (Array.isArray(props)) return props.forEach(p => render(origin, p))

  const { r: ctr, ...params } = props
  const isComponent = typeof ctr === 'function'

  if (isComponent) storeID = 0

  const { c: children, ...atts } = isComponent ? ctr(params) : props
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
  if (children) render(created, children)

  created.dispatchEvent(new Event('mount'))
  return created
}

function createElement(props) {
  const { r, ...all } = props

  let effects = {}
  let listeners = {}
  let atts = {}

  Object.entries(all).forEach(([key, value]) => key.startsWith('__') ? effects[key.substring(2)] = value 
    : key.startsWith('_') ? listeners[key.substring(1)] = value : atts[key] = value)

  const tag = r || 'div'
  const attHTML = ([key, value]) => `${key.replaceAll('_', '-')}="${value}"`
  const attsHTML = Object.entries(atts).filter(([_, value]) => value !== undefined).map(attHTML).join('')
  const created = createFragment(`<${tag} ${attsHTML}></${tag}>`)

  const addEvent = ([e, f]) => created.firstChild.addEventListener(e, f)

  Object.entries(effects).forEach(([e, f]) => {
    addEvent(['mount', () => window.addEventListener(e, f)])
    addEvent(['unmount', () => window.removeEventListener(e, f)])
  })

  Object.entries(listeners).forEach(addEvent)

  return created
}

function createFragment(html) {
  return document.createRange().createContextualFragment(html)
}