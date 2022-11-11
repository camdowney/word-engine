const _dispatch = (at, event) => 
  at.dispatchEvent(new Event(event))

const createElement = ({ r, ...props }) => {
  let effects = {}
  let listeners = {}
  let atts = {}

  Object.entries(props).forEach(([key, value]) => key.startsWith('__') ? effects[key.substring(2)] = value 
    : key.startsWith('_') ? listeners[key.substring(1)] = value : atts[key] = value)

  const tag = r || 'div'

  const attsHTML = Object.entries(atts)
    .filter(([_, value]) => value !== undefined)
    .map(([key, value]) => `${key.replaceAll('_', '-')}="${value}"`)
    .join('')

  const fragment = document.createRange().createContextualFragment(`<${tag} ${attsHTML}></${tag}>`)

  const addEvent = ([e, f]) => fragment.firstChild.addEventListener(e, f)

  Object.entries(effects).forEach(([e, f]) => {
    addEvent(['mount', () => window.addEventListener(e, f)])
  })

  Object.entries(listeners).forEach(addEvent)

  return fragment
}

let currentID = 0

export const render = (at, props) => {
  if (!at || props === undefined)
    return

  const origin = typeof at !== 'string' ? at : document?.querySelector(at)

  if (typeof props === 'function')
    return render(origin, { r: props })

  if (Array.isArray(props))
    return props.forEach(p => render(origin, p))

  if (typeof props !== 'object')
    return origin.innerHTML += props

  const { r, ...params } = props
  const isComponent = typeof r === 'function'

  const obj = isComponent ? r({ cid: '_' + currentID, ...params }) : props

  const { c: children, ...atts } = (typeof obj !== 'object' || Array.isArray(obj)) ? { r: 'span', c: obj } : obj

  origin.append(createElement(atts))
  const created = origin.lastChild

  if (children !== undefined)
    render(created, children)

  _dispatch(created, 'mount')
}