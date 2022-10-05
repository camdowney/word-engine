import { dictionary } from './dictionary.js'

const app = document.querySelector('#app')
const split = render(app, '<div class="split"></div>')
const containerCol = render(split, '<div class="cells-col"></div>')
const suggestionsCol = render(split, '<div class="suggestions-col"></div>')
const cellsBox = render(containerCol, '<div class="cells-box"></div>')
const suggestionsBox = render(suggestionsCol, '<div class="suggestions-box"></div>')

const MAX_SUGGESTIONS = 1000
const NUM_CELLS = 30

let cells = []
let letters = []
let index = 0

forNum(NUM_CELLS, (_, index) => {
  cells.push(render(cellsBox, `<div class="cell" data-index="${index}" data-state="0"></div>`))
})

const fiveLetterWords = dictionary.filter(word => word.length === 5)
renderSuggestions(fiveLetterWords)

cellsBox.addEventListener('click', e => {
  const cell = e.srcElement
  const cellIndex = cell.dataset.index

  if (!cellIndex) return
  if (letters[cellIndex]) cell.dataset.state = (cell.dataset.state + 1) % 3

  filterWords(cells)
})

window.addEventListener('keydown', e => {
  const key = e.key.toUpperCase()

  if (key === 'BACKSPACE' && index > 0) {
    index--
    cells[index].innerHTML = ''
    cells[index].dataset.state = 0
    letters[index] = ''
    filterWords(cells)
    return
  }

  if (e.repeat || !isLetter(key)) return

  if (index < NUM_CELLS) {
    cells[index].innerHTML = key
    letters[index] = key
    filterWords(cells)
    index++
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

/*
* Specialized functions
*/
function filterWords(cells) {
  let includeLetters = {}
  let excludeLetters = {}
  
  cells.filter(c => c.innerHTML.length === 1).forEach(c => {
    const state = Number(c.dataset.state)
    const index = Number(c.dataset.index)

    if (state === 0) {
      forNum(5, (_, i) => {
        excludeLetters[i][c.innerHTML] = 1
      })
    }
    else if (state === 1) {
      excludeLetters[index % 5][c.innerHTML] = 1

      forNum(5, (_, i) => {
        if (i !== index % 5) {
          includeLetters[i][c.innerHTML] = 1
        }
      })
    }
    else if (state === 2) {
      includeLetters[index % 5][c.innerHTML] = 1
    }
  })

  console.log(includeLetters, excludeLetters)

  const filteredWords = fiveLetterWords.filter(word =>
    keys(includeLetters).every(key => includeLetters[key].includes(word.charAt(key).toUpperCase()))
    && keys(excludeLetters).every(key => !excludeLetters[key].includes(word.charAt(key).toUpperCase()))
  )

  renderSuggestions(filteredWords)
}

function renderSuggestions(words) {
  suggestionsBox.innerHTML = ''
  const shown = MAX_SUGGESTIONS < words.length ? MAX_SUGGESTIONS : words.length
  render(suggestionsBox, `<p class="suggestions-header">Showing ${shown} of ${words.length} possible words</p>`)
  const suggestions = render(suggestionsBox, '<div class="suggestions"></div>')
  render(suggestions, words.map(w => `<p>${w}</p>`).slice(0, shown).join(''))
}

/*
* Generic functions
*/
function render(e, html) {
  if (!e || !html) return
  const newElement = useFragment(html)
  e.appendChild(newElement)
  return e.children[e.children.length - 1]
}

function useFragment(html) {
  return document.createRange().createContextualFragment(html)
}

function isLetter(str) {
  if (!str) return false
  return str.length === 1 && str.toLowerCase().match(/[a-z]/)
}

function forNum(num, callback) {
  if (Number.isNaN(num)) return
  Array.from(Array(num)).forEach(callback)
}

function keys(obj) {
  if (!obj) return []
  return [...Object.keys(obj)]
}