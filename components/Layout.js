import { Board } from './Board.js'
import { Keyboard } from './Keyboard.js'
import { Suggestions } from './Suggestions.js'
import { cells, isLetter } from '../lib/util.js'

let holdingCtrlOrCmd = false

export const Layout = () => ref => {
  ref.html`
    <section class='layout'>
      <div class='col'>
        ${Board({ onClick })}
        ${Keyboard()}
      </div>
      <div class='col'>
        ${Suggestions()}
      </div>
    </section>
  `

  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('keyup', onKeyUp)
}

const onClick = e => {
  const index = e.srcElement.dataset.index
  const cell = cells.val[index]

  if (!cell)
    return

  cell.state = (cell.state + 1) % 3
  cells.val = cells.val
}

const onKeyDown = e => {
  const key = e.key.toLowerCase()

  if (key === 'control' || key === 'meta')
    holdingCtrlOrCmd = true

  if (holdingCtrlOrCmd)
    return

  if (key === 'backspace' && cells.val.length > 0) {
    cells.val = cells.val.slice(0, -1)
  }
  else if (!e.repeat && isLetter(key) && cells.val.length < 30) {
    cells.val = [...cells.val, { letter: key, state: 0 }]
  }
}

const onKeyUp = e => {
  const key = e.key.toLowerCase()

  if (key === 'control' || key === 'meta')
    holdingCtrlOrCmd = false
}