const NUM_CELLS = 30

export default function CellGrid(cells = [], updateCellState) {
  const emptyCells = Array(NUM_CELLS - cells.length)

  return {
    id: 'cell-grid',
    _click: updateCellState,
    children: [...cells, ...emptyCells].map((c, i) => ({
      class: 'cell',
      data_index: i,
      data_state: c?.state,
      children: c?.letter
    })),
  }
}