import { dictionary } from './dictionary.js'

const app = document.querySelector('#app')
const split = render(app, '<div class="split"></div>')
const containerCol = render(split, '<div class="cells-col"></div>')
const suggestionsCol = render(split, '<div class="suggestions-col"></div>')
const cellsBox = render(containerCol, '<div class="cells-box"></div>')
const suggestionsBox = render(suggestionsCol, '<div class="suggestions-box"></div>')

const NUM_CELLS = 30
let cells = []
let letters = []
let index = 0

forNum(NUM_CELLS, (_, index) =>
  cells.push(render(cellsBox, `<div class="cell" data-index="${index}" data-state="0"></div>`))
)

const fiveLetterWords = dictionary.filter(word => word.length === 5)
renderSuggestions(fiveLetterWords)

cellsBox.addEventListener('click', e => {
  const cell = e.srcElement
  const cellIndex = cell.dataset.index

  if (!cellIndex) return
  if (letters[cellIndex]) cell.dataset.state = (cell.dataset.state + 1) % 3

  let lettersNotAt = []
  let lettersAt = []

  cells.forEach(cell => {
    if (cell.innerHTML.length === 1) {
      const state = cell.dataset.state

      if (state === 1) {

      }
    }
  })

  console.log(lettersNotAt, lettersAt)

  const filteredWords = fiveLetterWords.filter(Boolean)
  renderSuggestions(filteredWords)
})

window.addEventListener('keydown', e => {
  if (e.repeat) return

  const key = e.key.toUpperCase()

  if (key === 'BACKSPACE' && index > 0) {
    cells[--index].innerHTML = ''
    cells[index].dataset.state = 0
    letters[index] = ''
    return
  }

  if (!isLetter(key)) return

  if (index < NUM_CELLS) {
    cells[index].innerHTML = key
    letters[index++] = key
  }

  // if (index % 5 > 0 || index === 0) {
  //   index++
  //   return
  // }

  // if (!possibleWords.includes(letters.slice(index - 5, 5).join(''))) {
  //   return
  // }

  // index++
})

function renderSuggestions(words) {
  suggestionsBox.innerHTML = ''
  render(suggestionsBox, `<p class="suggestions-header">Showing ${words.length} possible words</p>`)
  
  const suggestions = render(suggestionsBox, '<div class="suggestions"></div>')
  render(suggestions, words.map(w => `<p>${w}</p>`).join(''))
}

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