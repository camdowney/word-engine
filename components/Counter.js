import { store } from '../min.js'

export default function Counter() {
  const [count, setCount] = store(0)

  return (
    ('div', { class: 'counter-outer', _click: () => setCount(count + 1) }, [
      ('p', count),
      (Counter2),
    ])
  )
}

function Counter2() {
  const [count, setCount] = store(0)

  return (
    ('div', { class: 'counter-inner', _click: () => setCount(count + 1) }, [
      ('p', count),
      (Counter2),
    ])
  )
}