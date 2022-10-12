import { render, useStore } from '../min.js'

export default function Counter() {
  const store = useStore('counter', { count: 0 })

  const update = () => {
    store.count++
    render(true, Counter())
    //R
  }

  return {
    id: 'counter',
    _click: update,
    content: `<p>${store.count}</p>`,
  }
}