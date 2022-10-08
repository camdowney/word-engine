import { fiveLetterWords } from './dictionary/fiveLetterWords.js'
import { render, renderDiv, isLetter, forNum } from './util.js'
import filterWords from './filterWords.js'

/*
* UI Setup
*/
const app = document.querySelector('#app')
const split = renderDiv(app, 'split')
const cellsBox = renderDiv(split, 'cells-box')
const suggestionsBox = renderDiv(split, 'suggestions-box')

const MAX_SUGGESTIONS = 100
const NUM_CELLS = 30

let cells = []
let cellIndex = 0

forNum(NUM_CELLS, i => {
  const cell = render(cellsBox, `<div class="cell" data-index="${i}" data-state="0"></div>`)
  cells.push(cell)
})

rerenderSuggestionsBox(fiveLetterWords)

/*
* Modify cell state
*/
cellsBox.addEventListener('click', e => {
  const cell = e.srcElement
  const index = cell.dataset.index

  if (!index) return

  if (cell.innerHTML.length === 1) 
    cell.dataset.state = (cell.dataset.state + 1) % 3

  updateSuggestions(fiveLetterWords, cells)
})

/*
* Add & remove letters
*/
window.addEventListener('keydown', e => {
  const key = e.key.toLowerCase()

  if (key === 'backspace' && cellIndex > 0) {
    cellIndex--
    cells[cellIndex].innerHTML = ''
    cells[cellIndex].dataset.state = 0
    updateSuggestions(fiveLetterWords, cells)
    return
  }

  if (e.repeat || !isLetter(key)) return

  if (cellIndex < NUM_CELLS) {
    cells[cellIndex++].innerHTML = key
    updateSuggestions(fiveLetterWords, cells)
  }
})

/*
* Specialized functions
*/
function updateSuggestions(words, cells) {
  let filters = {
    notHasLetter: [],
    hasLetter: [],
    notHasLetterAt: [[], [], [], [], []],
    hasLetterAt: [[], [], [], [], []],
    exactLetterCount: {},
    minLetterCount: {},
  }

  const cellMap = cells.filter(cell => cell.innerHTML.length === 1)
    .map(cell => ({ letter: cell.innerHTML, state: Number(cell.dataset.state) }))

  
  cellMap.forEach((cell, index) => {
    const { letter, state } = cell
    const indexInRow = index % 5

    if (state === 2) {
      filters.hasLetterAt[indexInRow].push(letter)
      // maxLetters[letter] = maxLetters[letter] + 1 || 1
    }
    else if (state === 1) {
      filters.notHasLetterAt[indexInRow].push(letter)
      filters.hasLetter.push(letter)
      // maxLetters[letter] = maxLetters[letter] + 1 || 1
    }
    else if (filters.notHasLetterAt.some(arr => arr.includes(letter))) {
      filters.notHasLetterAt[indexInRow].push(letter)
    }
    else if (filters.hasLetterAt.some(arr => arr.includes(letter))) {
      filters.notHasLetterAt[indexInRow].push(letter)
    }
    else {
      filters.notHasLetter.push(letter)
    }
  })

  // ??? minLetters increases for each green/yellow, then becomes exactLetters when first gray is found

  rerenderSuggestionsBox(filterWords(words, filters))
}

function rerenderSuggestionsBox(words) {
  suggestionsBox.innerHTML = ''
  const shown = MAX_SUGGESTIONS < words.length ? MAX_SUGGESTIONS : words.length
  render(suggestionsBox, `<p class="suggestions-header">Showing ${shown} of ${words.length} possible words</p>`)
  const suggestions = renderDiv(suggestionsBox, 'suggestions')
  render(suggestions, words.map(w => `<p>${w}</p>`).slice(0, shown))
}