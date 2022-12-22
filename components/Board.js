import { signal } from '../min.js'

export default function Board({ get, cells }) {
  const emptyCells = Array(30 - cells.length)

  const _click = e => {
    const index = e.srcElement.dataset.index

    if (!cells[index])
      return

    signal(get().parentNode, 'cycle', { index })
  }

  return {
    class: 'board',
    _click,
    c: [...cells, ...emptyCells].map((cell, i) => ({
      class: 'cell',
      data_index: i,
      data_state: cell?.state,
      c: cell?.letter
    })),
  }
}