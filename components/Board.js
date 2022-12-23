export default function Board({ cells, cycleColors }) {
  const allCells = [...cells.value, ...Array(30 - cells.value.length)]

  return {
    class: 'board',
    _click: cycleColors,
    c: allCells.map((cell, i) => ({
      class: 'cell',
      data_index: i,
      data_state: cell?.state,
      c: cell?.letter
    })),
  }
}