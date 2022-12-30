import Board from './Board.js'
import Keyboard from './Keyboard.js'
import Suggestions from './Suggestions.js'
import { isLetter } from '../lib/util.js'

export default function Layout({ store }) {
  const cells = store([])

  const __keydown = e => {
    const key = e.key.toLowerCase()
    const numFilledCells = cells.get.length

    if (key === 'backspace' && numFilledCells > 0) {
      cells.get.pop()
      cells.flag()
    }
    else if (!e.repeat && isLetter(key) && numFilledCells < 30) {
      cells.get.push({ letter: key, state: 0 })
      cells.flag()
    }
  }

  const _click = e => {
    const index = e.srcElement.dataset.index
    const cell = cells.get[index]

    if (!cell)
      return

    cell.state = (cell.state + 1) % 3
    cells.flag()
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