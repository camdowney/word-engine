export function render(origin, props) {
  if (!origin) return

  const built = buildDOM(props)
  const id = '#' + built.firstChild?.id
  const current = id.length > 1 && document.querySelector(id)

  if (current) {
    current.dispatchEvent(new Event('unmount'))
    current.parentNode.replaceChild(built, current)

    const newElement = document.querySelector(id)
    newElement.dispatchEvent(new Event('mount'))
    return newElement
  }
  else {
    const count = origin.children.length

    if (Array.isArray(built)) origin.append(...built)
    else origin.append(built)
    
    const newElement = origin.children[count]
    newElement.dispatchEvent(new Event('mount'))
    return newElement
  }
}

export function buildDOM(props) {
  const createFragment = (html) => document.createRange().createContextualFragment(html)

  if (!props) return createFragment('')
  if (typeof props === 'string') return createFragment(props)
  if (Array.isArray(props)) return props.map(buildDOM)

  let listeners = {}
  let cleanProps = {}

  keys(props).forEach(p => 
    p.startsWith('_') ? listeners[p.substring(1)] = props[p] : cleanProps[p] = props[p]
  )

  const { tag, children, ...atts } = cleanProps
  const t = tag || 'div'
  const attString = (att) => `${att.replace(/_/g, '-')}="${atts[att]}"`
  const newElement = createFragment(`<${t} ${keys(atts).filter(key => atts[key] !== undefined).map(attString).join('')}></${t}>`)

  keys(listeners).forEach(key => newElement.firstChild.addEventListener(key, listeners[key]))
  
  if (!children) return newElement

  if (Array.isArray(children)) newElement.firstChild.append(...buildDOM(children))
  else newElement.firstChild.append(buildDOM(children))

  return newElement
}

/////////////////////////////////////////////////////////////////////////////////

export function isLetter(str) {
  return str && str.length === 1 && str.toLowerCase().match(/[a-z]/)
}

export function forNum(num, callback) {
  if (Number.isNaN(num)) return
  [...Array(num).keys()].forEach(callback)
}

export function keys(obj) {
  if (!obj) return []
  return [...Object.keys(obj)]
}

export function getPageItems(items, page = 0, pageSize) {
  if (!items) return []
  if (Number.isNaN(page) || page < 0 || page > getNumPages(items, pageSize) - 1 || !pageSize || pageSize < 1) 
    return items
  return items.slice((page * pageSize), (page + 1) * pageSize)
}

export function getNumPages(items, pageSize) {
  if (!items || Number.isNaN(pageSize) || pageSize < 1) return 1
  return Math.ceil(items.length / pageSize)
}