import Board from './Board.js'
import Keyboard from './Keyboard.js'
import Suggestions from './Suggestions.js'
import { isLetter } from '../lib/util.js'

export default function Layout({ store }) {
  const cells = store([])

  const __keydown = e => {
    const key = e.key.toLowerCase()

    if (key === 'backspace' && cells().length > 0) {
      cells(cells().slice(0, -1))
    }
    else if (!e.repeat && isLetter(key) && cells().length < 30) {
      cells([ ...cells(), { letter: key, state: 0 } ])
    }
  }

  const _click = e => {
    const index = e.srcElement.dataset.index

    if (!cells()[index])
      return

    let temp = cells()
    temp[index].state = (temp[index].state + 1) % 3
    cells(temp)
  }

  return { 
    tag: 'section', class: 'layout', __keydown, c: [
      { class: 'col', c: [
        { tag: Board, cells, _click },
        { tag: Keyboard },
      ] },
      { class: 'col', c: [
        { tag: Suggestions, cells },
      ] },
    ]
  }
}