export function isLetter(str) {
  return str && str.length === 1 && str.toLowerCase().match(/[a-z]/)
}

export function getPageItems(items, page = 0, pageSize) {
  if (!Array.isArray(items)) return []
  if (Number.isNaN(page) || page < 0) return items
  if (page > getNumPages(items, pageSize) - 1) return []
  return items.slice((page * pageSize), (page + 1) * pageSize)
}

export function getNumPages(items, pageSize) {
  if (!items || Number.isNaN(pageSize) || pageSize < 1) return 1
  return Math.ceil(items.length / pageSize)
}

export function chunk(arr, size) {
  if (!Array.isArray(arr)) return []
  if (!size || size < 1) return arr
  return arr.reduce((acc, _, i) => (i % size) ? acc : [...acc, arr.slice(i, i + size)], [])
}