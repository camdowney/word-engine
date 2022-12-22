export default function Board({ cells, cycleColors }) {
  const emptyCells = Array(30 - cells.length)

  return {
    class: 'board',
    _click: cycleColors,
    c: [...cells, ...emptyCells].map((cell, i) => ({
      class: 'cell',
      data_index: i,
      data_state: cell?.state,
      c: cell?.letter
    })),
  }
}