export default function Board({ cells, _click }) {
  const allCells = [...cells.value, ...Array(30 - cells.value.length)]

  return {
    tag: 'div',
    class: 'board',
    _click,
    c: allCells.map((cell, i) => ({
      tag: cell?.state >= 0 ? 'button' : 'div',
      class: 'cell',
      data_index: i,
      data_state: cell?.state,
      c: cell?.letter
    })),
  }
}