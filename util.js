export function render(origin, props) {
  if (!origin) return
  
  const count = origin.children.length
  const dom = createDOM(props)

  if (Array.isArray(dom)) dom.forEach(d => origin.appendChild(d))
  else origin.appendChild(dom)
  return origin.children[count]
}

export function renderID(origin, id, props = {}) {
  if (!id) return

  const current = document.querySelector(`#${id}`)
  const allProps = { id, ...props }

  if (!current && !origin) return
  if (!current) return render(origin, allProps)
  current.parentNode.replaceChild(createDOM(allProps), current)
  return document.querySelector(`#${id}`)
}

export function createDOM(props) {
  if (!props) return createFragment('')
  if (typeof props === 'string') return createFragment(props)
  if (Array.isArray(props)) return props.map(createDOM)

  let listeners = {}
  let cleanProps = {}

  keys(props).forEach(prop => 
    prop.startsWith('_') ? listeners[prop.substring(1)] = props[prop] : cleanProps[prop] = props[prop]
  )

  const { children, ...atts } = cleanProps
  const newElement = createFragment(createHTML(atts))

  keys(listeners).forEach(key => newElement.firstChild.addEventListener(key, listeners[key]))
  if (!Array.isArray(children)) newElement.firstChild.appendChild(createDOM(children))
  else children?.forEach(c => newElement.firstChild.appendChild(createDOM(c)))
  
  return newElement
}

export function createHTML(props) {
  const { tag, ...atts } = props
  const t = tag || 'div'
  const attHtml = (att) => `${att.replace(/_/g, '-')}="${atts[att]}"`
  return `<${t} ${keys(atts).map(attHtml).join('')}></${t}>`
}

export function createFragment(html) {
  return document.createRange().createContextualFragment(html)
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