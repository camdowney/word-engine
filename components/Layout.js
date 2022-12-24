import Board from './Board.js'
import Keyboard from './Keyboard.js'
import Suggestions from './Suggestions.js'
import { isLetter } from '../lib/util.js'

export default function Layout({ store }) {
  const cells = store([])

  const __keydown = e => {
    const key = e.key.toLowerCase()
    const numFilledCells = cells.value.length

    if (key === 'backspace' && numFilledCells > 0) {
      cells.value.pop()
      cells.signal()
    }
    else if (!e.repeat && isLetter(key) && numFilledCells < 30) {
      cells.value.push({ letter: key, state: 0 })
      cells.signal()
    }
  }

  const _click = e => {
    const index = e.srcElement.dataset.index
    const cell = cells.value[index]

    if (!cell)
      return

    cell.state = (cell.state + 1) % 3
    cells.signal()
  } 

  return { 
    tag: 'section', class: 'layout', __keydown, c: [
      { class: 'col', c: [
        { tag: Board, cells, _click },
        { tag: Keyboard },
      ] },
      { class: 'col', c: [
        { tag: Suggestions, cells },
      ] }
    ]
  }
}