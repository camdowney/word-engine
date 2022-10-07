import { dictionary } from './dictionary.js'
import { render, div, isLetter, forNum } from './util.js'
import filterWords from './filterWords.js'

/*
* UI Setup
*/
const app = document.querySelector('#app')
const split = div(app, 'split')
const containerCol = div(split, 'cells-col')
const suggestionsCol = div(split, 'suggestions-col')
const cellsBox = div(containerCol, 'cells-box')
const suggestionsBox = div(suggestionsCol, 'suggestions-box')

const MAX_SUGGESTIONS = 1000
const NUM_CELLS = 30

let cells = []
let letters = []
let index = 0

forNum(NUM_CELLS, i => {
  cells.push(render(cellsBox, `<div class="cell" data-index="${i}" data-state="0"></div>`))
})

const fiveLetterWords = dictionary.filter(word => word.length === 5)
rerenderSuggestionsBox(fiveLetterWords)

/*
* Modify cell state
*/
cellsBox.addEventListener('click', e => {
  const cell = e.srcElement
  const cellIndex = cell.dataset.index

  if (!cellIndex) return
  if (letters[cellIndex]) cell.dataset.state = (cell.dataset.state + 1) % 3

  filterFromCells(fiveLetterWords, cells)
})

/*
* Add & remove letters
*/
window.addEventListener('keydown', e => {
  const key = e.key.toLowerCase()

  if (key === 'backspace' && index > 0) {
    index--
    cells[index].innerHTML = ''
    cells[index].dataset.state = 0
    letters[index] = ''
    filterFromCells(fiveLetterWords, cells)
    return
  }

  if (e.repeat || !isLetter(key)) return

  if (index < NUM_CELLS) {
    cells[index].innerHTML = key
    letters[index] = key
    filterFromCells(fiveLetterWords, cells)
    index++
  }
})

/*
* Specialized functions
*/
function filterFromCells(words, cells) {
  let filters = {
    exactLength: false,
    minLength: false,
    maxLength: false,
    notHasLetter: [],
    hasLetter: [],
    notHasLetterAt: [[], [], [], [], []],
    hasLetterAt: [[], [], [], [], []],
    exactLetterCount: {},
    minLetterCount: {},
    maxLetterCount: {},
  }

  const filledCells = cells.filter(c => c.innerHTML.length === 1)  
  
  filledCells.forEach(c => {
    const state = Number(c.dataset.state)
    const index = Number(c.dataset.index)
    const letter = c.innerHTML

    if (state === 2) {
      filters.hasLetterAt[index % 5].push(letter)
      // maxLetters[letter] = maxLetters[letter] + 1 || 1
    }
    else if (state === 1) {
      filters.notHasLetterAt[index % 5].push(letter)
      filters.hasLetter.push(letter)
      // maxLetters[letter] = maxLetters[letter] + 1 || 1
    }
    else if (filters.notHasLetterAt.some(arr => arr.includes(letter))) {
      filters.notHasLetterAt[index % 5].push(letter)
    }
    else if (filters.hasLetterAt.some(arr => arr.includes(letter))) {
      filters.notHasLetterAt[index % 5].push(letter)
    }
    else {
      filters.notHasLetter.push(letter)
    }
  })

  // ??? minLetters increases for each green/yellow, then becomes exactLetters when first gray is found

  // const rows = filledCells.reduce((acc, cell) => acc += cell.innerHTML, '').match(/.{1,5}/g)
  // console.log(rows)

  rerenderSuggestionsBox(filterWords(words, filters))
}

function rerenderSuggestionsBox(words) {
  suggestionsBox.innerHTML = ''
  const shown = MAX_SUGGESTIONS < words.length ? MAX_SUGGESTIONS : words.length
  render(suggestionsBox, `<p class="suggestions-header">Showing ${shown} of ${words.length} possible words</p>`)
  const suggestions = div(suggestionsBox, 'suggestions')
  render(suggestions, words.map(w => `<p>${w}</p>`).slice(0, shown))
}