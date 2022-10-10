import { fiveLetterWords } from './dictionary/fiveLetterWords.js'
import { render, isLetter } from './util.js'
import CellGrid from './components/CellGrid.js'
import Suggestions from './components/Suggestions.js'

const NUM_CELLS = 30
let cells = [...Array(NUM_CELLS)]
let cellIndex = 0

const updateCell = (e) => {
  const index = e.srcElement.dataset.index
  if (!index || !cells[index]) return
  cells[index].state = (cells[index].state + 1) % 3
  updateUI(fiveLetterWords, cells)
}

const app = document.querySelector('main')
const layout = render(app, { class: 'split' })
render(layout, CellGrid(cells, updateCell))
render(layout, Suggestions(fiveLetterWords))

// Add & remove letters
window.addEventListener('keydown', e => {
  const key = e.key.toLowerCase()

  if (key === 'backspace' && cellIndex > 0) {
    cells[--cellIndex] = undefined
    updateUI(fiveLetterWords, cells)
    return
  }

  if (e.repeat || !isLetter(key) || cellIndex === NUM_CELLS) return

  cells[cellIndex++] = { letter: key, state: 0 }
  updateUI(fiveLetterWords, cells)
})

function updateUI(words, cells) {
  let filters = {
    notHasLetter: [],
    hasLetter: [],
    notHasLetterAt: [[], [], [], [], []],
    hasLetterAt: [[], [], [], [], []],
    exactLetterCount: {},
    minLetterCount: {},
  }
  
  cells.filter(Boolean).forEach((cell, index) => {
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

  render(layout, CellGrid(cells, updateCell))
  render(layout, Suggestions(words, filters))
}