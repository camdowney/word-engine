import { h } from 'https://cdn.jsdelivr.net/npm/neutro@2.3.0/min.js'

const keyRows = [
  'qwertyuiop',
  '1asdfghjkl1',
  '2zxcvbnm←',
]

export const Keyboard = () => ref => {
  ref.html`
    <div class='keyboard'>
      ${keyRows.map(chars => h`
        <div class='keyboard-row'>
          ${chars.split('').map(char => Key({ char }))}
        </div>
      `)}
    </div>
  `
}

const Key = ({ char }) => ref => {
  if (Number.isFinite(Number(char)))
    return char === '2' && ref.class.add('key-2')

  ref.class.add('key-outer')

  ref.html`
    <button class='key'>
      <div class='key-shape'></div>
      ${char}
    </button>
  `

  ref.q('button').on('click', () => {
    const key = char === '←' ? 'backspace' : char
    window.dispatchEvent(new KeyboardEvent('keydown', { key }))
  })
}