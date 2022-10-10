export default function CellGrid(cells = [], updateCell) {
  return {
    id: 'cell-grid',
    class: 'cells-box',
    children: cells.map((c, i) => ({
      class: 'cell',
      data_index: i,
      data_state: c?.state,
      children: c?.letter
    })),
    _click: updateCell,
  }
}