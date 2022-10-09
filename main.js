import { fiveLetterWords } from './dictionary/fiveLetterWords.js'
import { render, renderID, isLetter, forNum, getPageItems, getNumPages, createDOM } from './util.js'
import filterWords from './filterWords.js'

const app = document.querySelector('#app')
const split = renderID(app, 'split')
const cellsBox = renderID(split, 'cells-box')

const NUM_CELLS = 30

let cells = []
let cellIndex = 0

forNum(NUM_CELLS, i => {
  const cell = render(cellsBox, { class: 'cell', data_index: i })
  cells.push(cell)
})

renderSuggestions(fiveLetterWords)

// Modify cell state
cellsBox.addEventListener('click', e => {
  const cell = e.srcElement
  const index = cell.dataset.index

  if (!index) return

  if (cell.innerHTML.length === 1) 
    cell.dataset.state = (cell.dataset.state + 1) % 3

  updateFilters(fiveLetterWords, cells)
})

// Add & remove letters
window.addEventListener('keydown', e => {
  const key = e.key.toLowerCase()

  if (key === 'backspace' && cellIndex > 0) {
    cellIndex--
    cells[cellIndex].innerHTML = ''
    delete cells[cellIndex].dataset.state
    updateFilters(fiveLetterWords, cells)
    return
  }

  if (e.repeat || !isLetter(key)) return

  if (cellIndex < NUM_CELLS) {
    cells[cellIndex].innerHTML = key
    cells[cellIndex].dataset.state = 0
    cellIndex++
    updateFilters(fiveLetterWords, cells)
  }
})

function updateFilters(words, cells) {
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

  const filteredWords = filterWords(words, filters)
  renderSuggestions(filteredWords)
}

// Component render function
function renderSuggestions(words) {
  const PAGE_SIZE = 100
  const allSuggestions = words.map(w => `<p>${w}</p>`)
  const numPages = getNumPages(allSuggestions, PAGE_SIZE)
  let currentPage = 0

  const loadMoreSuggestions = () => {
    if (suggestions.scrollTop < suggestions.scrollHeight - 1000) return
    if (currentPage === numPages) return suggestions.removeEventListener('scroll', loadMoreSuggestions)
    render(suggestions, getPageItems(allSuggestions, currentPage++, PAGE_SIZE))
  }

  const suggestionsBox = renderID(split, 'suggestions-box')
  render(suggestionsBox, `<p class="suggestions-header">Showing ${words.length} possible words</p>`)
  const suggestions = render(suggestionsBox, { class: 'suggestions', _scroll: loadMoreSuggestions })

  loadMoreSuggestions()
}