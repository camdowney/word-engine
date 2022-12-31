export default function Board({ cells, _click }) {
  const allCells = [...cells(), ...Array(30 - cells().length)]

  return {
    class: 'board',
    _click,
    c: allCells.map((cell, i) => ({
      tag: cell?.state >= 0 ? 'button' : 'div',
      class: 'cell',
      'data-index': i,
      'data-state': cell?.state,
      c: [
        { class: 'cell-shape' },
        { class: 'cell-letter', c: cell?.letter },
      ]
    })),
  }
}