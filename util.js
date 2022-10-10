export function render(origin, props) {
  if (!origin) return

  const built = props.firstChild
  const dom = built ? props : build(props)
  const queryID = () => document.querySelector(`#${built?.id}`)
  const current = queryID()

  if (current) {
    current.dispatchEvent(new Event('unmount'))
    current.parentNode.replaceChild(dom, current)
    const newElement = queryID()
    newElement.dispatchEvent(new Event('mount'))
    return newElement
  }
  else {
    const count = origin.children.length

    if (Array.isArray(dom))
      dom.forEach(d => origin.appendChild(d))
    else
      origin.appendChild(dom)

    const newElement = origin.children[count]
    newElement.dispatchEvent(new Event('mount'))
    return newElement
  }
}

export function build(props) {
  const createFragment = (html) => document.createRange().createContextualFragment(html)

  if (!props) return createFragment('')
  if (typeof props === 'string') return createFragment(props)
  if (Array.isArray(props)) return props.map(build)

  let listeners = {}
  let cleanProps = {}

  keys(props).forEach(p => 
    p.startsWith('_') ? listeners[p.substring(1)] = props[p] : cleanProps[p] = props[p]
  )

  const { tag, children, ...atts } = cleanProps
  const t = tag || 'div'
  const attHtml = (att) => `${att.replace(/_/g, '-')}="${atts[att]}"`
  const newElement = createFragment(`<${t} ${keys(atts).map(attHtml).join('')}></${t}>`)

  keys(listeners).forEach(key => newElement.firstChild.addEventListener(key, listeners[key]))
  
  if (Array.isArray(children))
    children?.forEach(c => newElement.firstChild.appendChild(build(c)))
  else
    newElement.firstChild.appendChild(build(children))

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