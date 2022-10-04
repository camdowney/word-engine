const app = document.querySelector('#app')

app.innerHTML += '<div class="cell-container"></div>'
const container = app.querySelector('.cell-container')

let index = 0
const NUM_CELLS = 30

forNum(NUM_CELLS, () =>
  container.innerHTML += '<div class="cell"></div>'
)

window.addEventListener('keydown', e => {
  if (e.repeat) return

  const key = e.key.toUpperCase()

  if (key === 'BACKSPACE' && index > 0) {
    container.querySelectorAll('.cell')[--index].innerHTML = ''
    return
  }

  if (isLetter(key) && index < NUM_CELLS) {
    container.querySelectorAll('.cell')[index++].innerHTML = key
  }
})

function render(e, html, overwrite = false) {
  overwrite ? e.innerHTML = html : e.innerHTML += html
  const children = e.querySelectorAll('*')
  return children[children.length - 1]
}

function isLetter(str) {
  if (!str) return false
  return str.length === 1 && str.toLowerCase().match(/[a-z]/)
}

function forNum(num, callback) {
  if (Number.isNaN(num)) return
  Array.from(Array(num)).forEach(callback)
}