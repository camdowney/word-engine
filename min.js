let storage = {}
let components = []
let currentID = 0
let storeID = 0

const createFragment = html => document.createRange().createContextualFragment(html)
const dispatch = (at, event) => at.dispatchEvent(new Event(event))

export function store(initial) {
  const cid = currentID
  const key = `${cid}-${storeID++}`

  if (!storage[key]) storage[key] = initial

  const setStore = value => {
    const { e, props } = components[cid]
    storage[key] = typeof value === 'function' ? value(storage[key]) : value
    currentID = cid
    render(e, props, true)
    currentID = components.length
  }

  return [storage[key], setStore]
}

export function render(at, props, replace) {
  if (!at) return

  const origin = typeof at !== 'string' ? at : document?.querySelector(at)

  if (props === undefined) return origin.append(createFragment(''))
  if (typeof props !== 'object') return origin.append(createFragment(props))
  if (Array.isArray(props)) return props.forEach(p => render(origin, p))

  const { r, ...params } = props
  const isComponent = typeof r === 'function'

  if (isComponent) storeID = 0

  const { c: children, ...atts } = isComponent ? r({ cid: '_' + currentID, ...params }) : props
  let created = null

  if (replace) {
    const parent = origin.parentNode
    const index = [...parent.children].indexOf(origin)
    dispatch(origin, 'unmount')
    origin.querySelectorAll('*').forEach(c => dispatch(c, 'unmount'))
    parent.replaceChild(createElement(atts), origin)
    created = parent.children[index]
  }
  else {
    origin.append(createElement(atts))
    created = origin.lastChild
  }

  if (isComponent) components[currentID++] = { e: created, props }
  if (children !== undefined) render(created, children)

  dispatch(created, 'mount')
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