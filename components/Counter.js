import { store } from 'https://cdn.jsdelivr.net/gh/camdowney/render/min.js'

export default function Counter() {
  const [count, setCount] = store(0)

  return {
    class: 'counter-outer',
    _click: () => setCount(count + 1),
    c: [
      { r: 'p', c: count },
      { r: NestedCounter },
    ],
  }
}

function NestedCounter() {
  const [count, setCount] = store(0)

  return {
    class: 'counter-inner',
    _click: () => setCount(count + 1),
    c: { r: 'p', c: count },
  }
}