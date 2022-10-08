export function renderHtml(e, html) {
  if (!e || !html) return
  const newElement = useFragment(Array.isArray(html) ? html.join('') : html)
  const count = newElement.children.length
  e.appendChild(newElement)
  return e.children[e.children.length - count]
}

export function render(e, props) {
  if (!e) return
  if (typeof props === 'string' || Array.isArray(props)) return renderHtml(e, props)
  const { tag, ...atts } = props
  const t = tag || 'div'
  return renderHtml(e, `<${t} ${keys(atts).map(att => `${att}="${atts[att]}"`).join('')}></${t}>`)
}

export function renderID(e, id, props = {}) {
  if (!e || !id) return
  unmount(`#${id}`)
  return render(e, { id, ...props })
}

export function unmount(query) {
  if (!document.querySelector(query)) return
  document.querySelector(query).remove()
}

export function useFragment(html) {
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