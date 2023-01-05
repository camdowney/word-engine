import Board from './Board.js'
import Keyboard from './Keyboard.js'
import Suggestions from './Suggestions.js'
import { isLetter } from '../lib/util.js'

export default function Layout({ store }) {
  const cells = store([])
  let holdingCtrlOrCmd = false

  function __keydown(e) {
    const key = e.key.toLowerCase()

    if (key === 'control' || key === 'meta')
      holdingCtrlOrCmd = true

    if (holdingCtrlOrCmd)
      return

    if (key === 'backspace' && cells().length > 0) {
      cells().pop()
      cells(cells())
    }
    else if (!e.repeat && isLetter(key) && cells().length < 30) {
      cells().push({ letter: key, state: 0 })
      cells(cells())
    }
  }

  function __keyup(e) {
    const key = e.key.toLowerCase()

    if (key === 'control' || key === 'meta')
      holdingCtrlOrCmd = false
  }

  function _click(e) {
    const index = e.srcElement.dataset.index
    const cell = cells()[index]

    if (!cell)
      return

    cell.state = (cell.state + 1) % 3
    cells(cells())
  }

  return { 
    tag: 'section', class: 'layout', __keydown, __keyup, c: [
      { class: 'col', c: [
        { tag: Board, cells, _click },
        { tag: Keyboard },
      ]},
      { class: 'col', c: [
        { tag: Suggestions, cells },
      ]},
    ]
  }
}