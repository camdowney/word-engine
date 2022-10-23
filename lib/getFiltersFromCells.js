import { chunk } from './util.js'

export default function getFiltersFromCells(cells) {
  let filters = {
    minLetterCount: {},
    maxLetterCount: {},
    notHasLetterAt: [[], [], [], [], []],
    hasLetterAt: [[], [], [], [], []],
  }

  const rows = chunk(cells, 5)
  
  cells.forEach((cell, index) => {
    const { letter, state } = cell
    const row = Math.floor(index / 5)
    const col = index % 5
    const validCountInRow = rows[row]?.filter(c => c.state > 0 && c.letter === letter).length

    if (state > 0)
      filters.minLetterCount[letter] = validCountInRow
    else
      filters.maxLetterCount[letter] = validCountInRow

    if (state === 2)
      filters.hasLetterAt[col].push(letter)
    else
      filters.notHasLetterAt[col].push(letter)
  })

  return filters
}