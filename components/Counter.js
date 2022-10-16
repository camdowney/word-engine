import { render, useStore } from '../min.js'

export default function Counter() {
  let [count, setCount] = useStore('counter', 0)

  const update = () => {
    setCount(++count)
    render(true, Counter())
  }

  return {
    id: 'counter',
    _click: update,
    c: `<p>${count}</p>`,
  }
}