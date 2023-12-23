import { store } from 'https://cdn.jsdelivr.net/npm/neutro@2.4.1/min.js'

export const cells = store([])

export const isLetter = str =>
  str && str.length === 1 && str.toLowerCase().match(/[a-z]/)

export const chunk = (arr, size) => {
  if (!Array.isArray(arr)) return []
  if (!size || size < 1) return arr
  return arr.reduce((acc, _, i) => (i % size) ? acc : [...acc, arr.slice(i, i + size)], [])
}

export const cn = (...classes) =>
  classes.filter(Boolean).join(' ')