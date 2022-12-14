const keys = [
  'qwertyuiop',
  '1asdfghjkl1',
  '2zxcvbnm←',
]

export default function Keyboard() {
  return {
    class: 'keyboard',
    c: keys.map(row => ({
      class: 'keyboard-row',
      c: row.split('').map(Key)
    }))
  }
}

function Key(char) {
  if (Number.isFinite(Number(char))) {
    return {
      tag: 'div',
      class: char === '2' && 'key-2',
    }
  }

  const isBackspace = char === '←'

  function _click() {
    const key = isBackspace ? 'backspace' : char
    window.dispatchEvent(new KeyboardEvent('keydown', { key }))
  }

  return {
    tag: 'button',
    _click,
    class: 'key',
    c: [
      { class: 'key-shape' },
      char,
    ]
  }
}