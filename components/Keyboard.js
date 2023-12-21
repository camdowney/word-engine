const keyRows = [
  'qwertyuiop',
  '1asdfghjkl1',
  '2zxcvbnm←',
]

export const Keyboard = () => ref => {
  ref.html`
    <div class='keyboard'>
      ${keyRows.map(chars => Row({ chars }))}
    </div>
  `
}

const Row = ({ chars }) => ref => {
  ref.html`
    <div class='keyboard-row'>
      ${chars.split('').map(char => Key({ char }))}
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