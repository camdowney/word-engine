import { render, useStore } from '../min.js'

export default function Counter() {
  let [count, setCount] = useStore(0, 'counter')

  const update = () => {
    setCount(++count)
    render(document.querySelector('#counter'), { a: Counter }, true)
  }

  return {
    id: 'counter',
    _click: update,
    c: `<p>${count}</p>`,
  }
}