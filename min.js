export function useStore(id, initial) {
  if (!id) return
  if (!window.FernStore) window.FernStore = {}
  if (!window.FernStore[id]) window.FernStore[id] = initial ?? {}
  keys(initial).forEach(key => window.FernStore[id][key] = window.FernStore[id][key] ?? initial[key])
  return window.FernStore[id]
}

export function render(origin, props) {
  // console.log(props?._click)
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
  if (Array.isArray(props)) return wrapElements(props.map(p => createElement(p, isChild)))
  if (typeof props !== 'object') return createFragment(props)

  let listeners = {}
  let cleanProps = {}
  keys(props).forEach(p => p.startsWith('_') ? (listeners[p.substring(1)] = props[p]) : (cleanProps[p] = props[p]))
  if (!isChild) cleanProps.data_component_id = useStore('components.index', { index: 0 }).index++
  const { e, content, children, ...atts } = cleanProps

  const newElement = createFragment(createHTML(e, atts))

  keys(listeners).forEach(key => Array.isArray(listeners[key]) 
    ? newElement.firstChild.addEventListener(key, e => listeners[key].forEach(l => l(e)))
    : newElement.firstChild.addEventListener(key, listeners[key]))

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
  const attString = (att) => `${att.replaceAll('_', '-')}="${atts[att]}"`
  const attHTML = keys(atts).filter(key => atts[key] !== undefined).map(attString).join('')
  return `<${tag} ${attHTML}></${tag}>`
}

function createFragment(html) {
 return document.createRange().createContextualFragment(html)
}

function keys(obj) {
  return [...Object.keys(obj || {})]
}