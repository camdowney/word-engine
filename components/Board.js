import { c, watch } from 'https://cdn.jsdelivr.net/npm/neutro/min.js'
import { cells } from '../lib/util.js'

export const Board = ({ onClick }) => c(ref => {
  watch(() => {
    const allCells = [...cells.val, ...Array(30 - cells.val.length)]

    ref.html(/*html*/`
      <div class='board'>
        ${allCells.map((cell, i) => {
          const tag = (cell && cell.state >= 0) ? 'button' : 'div'

          return /*html*/`
            <${tag}>
              <span 
                class='cell'
                data-index=${i}
                data-state=${cell ? cell.state : undefined}
              >
                <div class='cell-shape'></div>
                <div class='cell-letter'>${cell ? cell.letter : ''}</div>
              </span>
            </${tag}>
          `
        }).join(' ')}
      </div>
    `)

    ref.on('click', onClick)
  })
})