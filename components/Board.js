export default function Board({ cells, _click }) {
  const allCells = [...cells.get, ...Array(30 - cells.get.length)]

  return {
    class: 'board',
    _click,
    c: allCells.map((cell, i) => ({
      tag: cell?.state >= 0 ? 'button' : 'div',
      class: 'cell',
      data_index: i,
      data_state: cell?.state,
      c: [
        { class: 'cell-shape' },
        { class: 'cell-letter', c: cell?.letter },
      ]
    })),
  }
}