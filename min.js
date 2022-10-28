const _dispatch = (at, event) => 
  at.dispatchEvent(new Event(event))

const _err = code => 
  console.error(`FernJS error #${code}: see url/${code} for more details.`)

const createElement = ({ r, ...props }) => {
  let effects = {}
  let listeners = {}
  let atts = {}

  Object.entries(props).forEach(([key, value]) => 
    key.startsWith('__') 
    ? effects[key.substring(2)] = value 
    : key.startsWith('_') 
      ? listeners[key.substring(1)] = value 
      : atts[key] = value)

  const tag = r || 'div'

  const attsHTML = Object.entries(atts)
    .filter(([_, value]) => value !== undefined)
    .map(([key, value]) => `${key.replaceAll('_', '-')}="${value}"`)
    .join('')

  const fragment = document.createRange().createContextualFragment(`<${tag} ${attsHTML}></${tag}>`)

  const addEvent = ([e, f]) => fragment.firstChild.addEventListener(e, f)

  Object.entries(effects).forEach(([e, f]) => {
    addEvent(['mount', () => window.addEventListener(e, f)])
    addEvent(['unmount', () => window.removeEventListener(e, f)])
  })

  Object.entries(listeners).forEach(addEvent)

  return fragment
}

let components = []
let currentID = 0
let storeID = 0

export const render = (at, props, replace) => {
  if (!at) return

  const origin = typeof at !== 'string' ? at : document?.querySelector(at)

  if (props === undefined) 
    return

  if (typeof props === 'function')
    return _err(0)

  if (Array.isArray(props))
    return props.forEach(p => render(origin, p))

  if (typeof props !== 'object')
    return origin.innerHTML += props

  const { r, ...params } = props
  const isComponent = typeof r === 'function'

  if (isComponent) 
    storeID = 0

  const obj = isComponent ? r({ cid: '_' + currentID, ...params }) : props

  if (typeof obj !== 'object' || Array.isArray(obj))
    return _err(1)

  const { c: children, ...atts } = obj
  let created = null

  if (replace) {
    const parent = origin.parentNode
    const index = [...parent.children].indexOf(origin)

    _dispatch(origin, 'unmount')

    origin.querySelectorAll('*').forEach(c => _dispatch(c, 'unmount'))
    parent.replaceChild(createElement(atts), origin)
    created = parent.children[index]
  }
  else {
    origin.append(createElement(atts))
    created = origin.lastChild
  }

  if (isComponent)
    components[currentID++] = { e: created, props }

  if (children !== undefined)
    render(created, children)

  _dispatch(created, 'mount')

  return created
}

let storage = {}

export const store = initial => {
  const cid = currentID
  const key = `${cid}-${storeID++}`

  if (!storage[key]) 
    storage[key] = initial

  const setStore = value => {
    storage[key] = typeof value === 'function' ? value(storage[key]) : value
    
    const { e, props } = components[cid]
    currentID = cid
    render(e, props, true)
    currentID = components.length
  }

  return [storage[key], setStore]
}