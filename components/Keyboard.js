import { c } from 'https://cdn.jsdelivr.net/npm/neutro/min.js'

const keyRows = [
  'qwertyuiop',
  '1asdfghjkl1',
  '2zxcvbnm←',
]

export const Keyboard = () => c(ref => {
  ref.html(/*html*/`
    <div class='keyboard'>
      ${keyRows.map(row => /*html*/`
        <div class='keyboard-row'>
          ${row.split('').map(char => Key({ char })).join(' ')}
        </div>
      `).join(' ')}
    </div>
  `)
})

const Key = ({ char }) => c(ref => {
  if (Number.isFinite(Number(char))) {
    return ref.html(/*html*/`
      <div class='${char === '2' ? 'key-2' : ''}'></div>
    `)
  }

  ref.html(/*html*/`
    <button class='key'>
      <div class='key-shape'></div>
      ${char}
    </button>
  `)

  ref.q('button').on('click', () => {
    const key = char === '←' ? 'backspace' : char
    window.dispatchEvent(new KeyboardEvent('keydown', { key }))
  })
})