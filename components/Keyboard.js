import { isLetter } from '../lib/util.js'

const keys = [
  'qwertyuiop',
  'asdfghjkl',
  'zxcvbnm←',
]

export default function Keyboard() {
  return {
    tag: 'div',
    class: 'keyboard',
    c: keys.map(row => ({
      tag: 'div',
      class: 'keyboard-row',
      c: row.split('').map(Key)
    }))
  }
}

const Key = char => {
  const _click = e => {
    const value = e.srcElement.textContent.trim()
    const key = isLetter(value) ? value : 'backspace'
    window.dispatchEvent(new KeyboardEvent('keydown', { key }));
  }

  return {
    tag: 'button',
    _click,
    class: 'key',
    c: [
      { class: 'key-shape' },
      { class: 'key-letter', c: char },
    ]
  }
}