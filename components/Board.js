import { watch } from 'https://cdn.jsdelivr.net/npm/neutro@2.4.0/min.js'
import { cells } from '../lib/util.js'

export const Board = () => ref => {
  watch(() => {
    const allCells = [...cells.val, ...Array(30 - cells.val.length)]

    ref.html`
      <div class='board'>
        ${allCells.map((cell, index) => Cell({ cell, index }))}
      </div>
    `
  })
}

const Cell = ({ cell, index }) => ref => {
  const tag = (cell && cell.state >= 0) ? 'button' : 'div'

  ref.html`
    <${tag}
      class='cell'
      data-state=${cell ? cell.state : undefined}
    >
      <div class='cell-shape'></div>
      <div class='cell-letter'>${cell ? cell.letter : ''}</div>
    </${tag}>
  `

  ref.on('click', () => {
    data.state = (data.state + 1) % 3
    cells.val = cells.val
  })
}