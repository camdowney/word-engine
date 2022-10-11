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

export function createElement(props) {
  if (!props) return createFragment('')
  if (typeof props === 'string') return createFragment(props)
  if (Array.isArray(props)) return wrapElements(props.map(createElement))

  let listeners = {}
  let cleanProps = {}
  keys(props).forEach(p => p.startsWith('_') ? listeners[p.substring(1)] = props[p] : cleanProps[p] = props[p])
  const { tag, children, ...atts } = cleanProps

  const newElement = createFragment(createHTML(tag, atts))
  keys(listeners).forEach(key => Array.isArray(listeners[key]) 
    ? newElement.firstChild.addEventListener(key, e => listeners[key].forEach(l => l(e)))
    : newElement.firstChild.addEventListener(key, listeners[key]))
  if (children) newElement.firstChild.append(createElement(children))
  return newElement
}

function wrapElements(elements) {
  const wrapper = createFragment('')
  wrapper.append(...elements)
  return wrapper
}

function createHTML(tag, atts) {
  const t = tag || 'div'
  const attString = (att) => `${att.replace('_', '-')}="${atts[att]}"`
  const attHTML = keys(atts).filter(key => atts[key] !== undefined).map(attString).join('')
  return `<${t} ${attHTML}></${t}>`
}

function createFragment(html) {
 return document.createRange().createContextualFragment(html)
}

export function isLetter(str) {
  return str && str.length === 1 && str.toLowerCase().match(/[a-z]/)
}

export function forNum(num, callback) {
  if (Number.isNaN(num)) return
  [...Array(num).keys()].forEach(callback)
}

export function keys(obj) {
  return [...Object.keys(obj || {})]
}

export function getPageItems(items, page = 0, pageSize) {
  if (!items) return []
  if (Number.isNaN(page) || page < 0 || page > getNumPages(items, pageSize) - 1) return items
  return items.slice((page * pageSize), (page + 1) * pageSize)
}

export function getNumPages(items, pageSize) {
  if (!items || Number.isNaN(pageSize) || pageSize < 1) return 1
  return Math.ceil(items.length / pageSize)
}

export function chunk(arr, size) {
  if (!arr || !size) return []
  if (arr.length < size) return arr
  return [arr.slice(0, size), ...chunk(arr.slice(size), size)]
}