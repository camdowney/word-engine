import { isLetter } from '../lib/util.js'

const rows = [
  'qwertyuiop',
  'asdfghjkl',
  'zxcvbnm←',
]

export default function Keyboard() {
  return {
    tag: 'div',
    class: 'keyboard',
    c: rows.map(row => ({
      tag: 'div',
      class: 'keyboard-row',
      c: row.split('').map(Key)
    }))
  }
}

const Key = char => {
  const _click = e => {
    const value = e.srcElement.firstChild.textContent.trim()
    const key = isLetter(value) ? value : 'backspace'
    window.dispatchEvent(new KeyboardEvent('keydown', { key }));
  }

  return {
    tag: 'button',
    _click,
    class: 'key',
    c: { tag: 'p', c: char }
  }
}