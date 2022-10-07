export function render(e, html) {
  if (!e || !html) return
  if (Array.isArray(html)) return e.innerHTML += html.join('')
  const newElement = useFragment(html)
  e.appendChild(newElement)
  return e.children[e.children.length - 1]
}

export function div(e, className) {
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