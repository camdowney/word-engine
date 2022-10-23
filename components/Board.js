const NUM_CELLS = 30

export default function Board({ cells, updateCellState }) {
  const emptyCells = Array(NUM_CELLS - cells.length)

  return {
    id: 'board',
    _click: updateCellState,
    c: [...cells, ...emptyCells].map((cell, i) => ({
      class: 'cell',
      data_index: i,
      data_state: cell?.state,
      c: cell?.letter
    })),
  }
}