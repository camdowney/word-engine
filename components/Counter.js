import { render, useStore } from '../min.js'

export default function Counter() {
  let [count, setCount] = useStore(0)
  let [count2, setCount2] = useStore(0)

  const update = () => {
    setCount(++count)
  }

  return {
    id: 'counter',
    _click: update,
    c: `<p>${count}</p>`,
  }
}