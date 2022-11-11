const build = ({ r, ...props }) => {
  let listeners = {}
  let atts = {}

  Object.entries(props).forEach(([key, value]) => 
    key.startsWith('_') ? listeners[key.substring(1)] = value : atts[key] = value)

  const created = document.createElement(r || 'div')
  Object.entries(atts).forEach(([att, value]) => created.setAttribute(att.replaceAll('_', '-'), value))

  Object.entries(listeners).forEach(([e, f]) => created.addEventListener(e, f))

  return created
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
  let created = null

  origin.append(build(atts))
  created = origin.lastChild

  if (isComponent)
    currentID++

  if (children !== undefined)
    render(created, children)

  created.dispatchEvent(new Event('mount'))
}

export default render