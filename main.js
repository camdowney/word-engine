import { render } from './min.js'
import { isLetter, chunk } from './util.js'
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
  updateUI()
}

function updateLetters(e) {
  const key = e.key.toLowerCase()

  if (key === 'backspace' && cells.length > 0) {
    cells.pop()
    updateUI()
  }
  else if (!e.repeat && isLetter(key) && cells.length < NUM_CELLS) {
    cells.push({ letter: key, state: 0 })
    updateUI()
  }
}

function updateUI() {
  const filters = getFilters()
  render(layout, Board(cells, updateCellState))
  render(layout, Suggestions(filters))
}

function getFilters() {
  let filters = {
    notHasLetterAt: [[], [], [], [], []],
    hasLetterAt: [[], [], [], [], []],
    minLetterCount: {},
    maxLetterCount: {},
  }

  const rows = chunk(cells, 5).filter(row => Array.isArray(row))
  
  cells.forEach((cell, index) => {
    const { letter, state } = cell
    const row = Math.floor(index / 5)
    const col = index % 5

    if (state > 0)
      filters.minLetterCount[letter] = filters.minLetterCount[letter] + 1 || 1
    else
      filters.maxLetterCount[letter] = rows[row]?.filter(c => c.state > 0 && c.letter === letter).length || 0

    if (state === 2)
      filters.hasLetterAt[col].push(letter)
    else if (state === 1)
      filters.notHasLetterAt[col].push(letter)
    else
      filters.notHasLetterAt[col].push(letter)
  })

  return filters
}