import { render, isLetter } from './util.js'
import Board from './components/Board.js'
import Suggestions from './components/Suggestions.js'

const NUM_CELLS = 30
let cells = []

const app = document.querySelector('main')
const layout = render(app, { tag: 'section', class: 'split' })
render(layout, Board(cells, updateCellState))
render(layout, Suggestions())
window.addEventListener('keydown', updateLetters)

function updateCellState(e) {
  const index = e.srcElement.dataset.index
  if (!cells[index]) return
  cells[index].state = (cells[index].state + 1) % 3
  updateUI(cells)
}

function updateLetters(e) {
  const key = e.key.toLowerCase()

  if (key === 'backspace' && cells.length > 0) {
    cells.pop()
    updateUI(cells)
  }
  else if (!e.repeat && isLetter(key) && cells.length < NUM_CELLS) {
    cells.push({ letter: key, state: 0 })
    updateUI(cells)
  }
}

function updateUI(cells) {
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

  render(layout, Board(cells, updateCellState))
  render(layout, Suggestions(filters))
}