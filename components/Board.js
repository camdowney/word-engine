export default function Board({ cells }) {
  const emptyCells = Array(30 - cells.length)

  return {
    class: 'board',
    c: [...cells, ...emptyCells].map((cell, i) => ({
      class: 'cell',
      data_index: i,
      data_state: cell?.state,
      c: cell?.letter
    })),
  }
}