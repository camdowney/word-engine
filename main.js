import { dictionary } from './dictionary.js'

const app = document.querySelector('#app')
const split = render(app, '<div class="split"></div>')
const containerCol = render(split, '<div class="cells-col"></div>')
const suggestionsCol = render(split, '<div class="suggestions-col"></div>')
const cellsBox = render(containerCol, '<div class="cells-box"></div>')
const suggestionsBox = render(suggestionsCol, '<div class="suggestions-box"></div>')

const NUM_CELLS = 30
let cells = []
let index = 0

forNum(NUM_CELLS, () =>
  cells.push(render(cellsBox, '<div class="cell"></div>'))
)

window.addEventListener('keydown', e => {
  if (e.repeat) return

  const key = e.key.toUpperCase()

  if (key === 'BACKSPACE' && index > 0) {
    cells[--index].innerHTML = ''
    return
  }

  if (isLetter(key) && index < NUM_CELLS) {
    cells[index++].innerHTML = key
  }
})

const possibleWords = filterWords({ length: 5 })
suggestionsBox.innerHTML = ''
render(suggestionsBox, `<p class="suggestions-header">Showing ${possibleWords.length} possible words</p>`)

const suggestions = render(suggestionsBox, '<div class="suggestions"></div>')
render(suggestions, possibleWords.map(w => `<p>${w}</p>`).join(''))

function render(e, html) {
  if (!e || !html) return
  const newElement = useFragment(html)
  e.appendChild(newElement)
  return e.children[e.children.length - 1]
}

function isLetter(str) {
  if (!str) return false
  return str.length === 1 && str.toLowerCase().match(/[a-z]/)
}

function filterWords(query) {
  return dictionary.filter(word => word.length === query.length)
}

function forNum(num, callback) {
  if (Number.isNaN(num)) return
  Array.from(Array(num)).forEach(callback)
}

function useFragment(html) {
  return document.createRange().createContextualFragment(html)
}

function replaceWith(e, component) {
  e.parentNode.replaceChild(component, e)
}