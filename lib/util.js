export const isLetter = str =>
  str && str.length === 1 && str.toLowerCase().match(/[a-z]/)

export const chunk = (arr, size) => {
  if (!Array.isArray(arr)) return []
  if (!size || size < 1) return arr
  return arr.reduce((acc, _, i) => (i % size) ? acc : [...acc, arr.slice(i, i + size)], [])
}

export const tether = {
  get: async (url, options) => {
    const { headers, data, ...rest } = options ?? {}
  
    const res = await fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      data: JSON.stringify(data),
      ...rest
    })
    return await res.json()
  }
}