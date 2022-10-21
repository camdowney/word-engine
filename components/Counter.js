import { useStore } from '../min.js'

export default function Counter() {
  const [count, setCount] = useStore(0)

  return {
    class: 'counter-outer',
    _click: () => setCount(count + 1),
    c: [
      `<p>${count}</p>`,
      { a: Counter2 },
    ],
  }
}

function Counter2() {
  const [count, setCount] = useStore(0)

  return {
    class: 'counter-inner',
    _click: () => setCount(count + 1),
    c: `<p>${count}</p>`,
  }
}