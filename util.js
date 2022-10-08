export function render(e, html) {
  if (!e || !html) return
  if (Array.isArray(html)) return e.innerHTML += html.join('')
  const newElement = useFragment(html)
  e.appendChild(newElement)
  return e.children[e.children.length - 1]
}

export function unmount(query) {
  if (!document.querySelector(query)) return
  document.querySelector(query).remove()
}

export function renderDiv(e, className) {
  return render(e, `<div class=${className}></div>`)
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