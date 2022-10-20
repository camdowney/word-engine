import { useStore } from '../min.js'

export default function Counter() {
  const [count, setCount] = useStore(0)

  return {
    id: 'counter',
    _click: () => setCount(count + 1),
    c: `<p>${count}</p>`,
  }
}