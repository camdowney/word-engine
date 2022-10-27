const NUM_CELLS = 30

export default function Board({ cells, updateCellState }) {
  const emptyCells = Array(NUM_CELLS - cells.length)
  const allCells = [...cells, ...emptyCells]

  return (
    ('div', { class: 'board', _click: updateCellState }, allCells.map((cell, i) => 
      ('div', { class: 'cell', data_index: i, data_state: cell.state }, [
        cell?.letter
      ])
    ))
  )
}