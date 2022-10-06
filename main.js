import { dictionary } from './dictionary.js'

const app = document.querySelector('#app')
const split = render(app, '<div class="split"></div>')
const containerCol = render(split, '<div class="cells-col"></div>')
const suggestionsCol = render(split, '<div class="suggestions-col"></div>')
const cellsBox = render(containerCol, '<div class="cells-box"></div>')
const suggestionsBox = render(suggestionsCol, '<div class="suggestions-box"></div>')

const MAX_SUGGESTIONS = 1000
const NUM_CELLS = 30

let cells = []
let letters = []
let index = 0

forNum(NUM_CELLS, i => {
  cells.push(render(cellsBox, `<div class="cell" data-index="${i}" data-state="0"></div>`))
})

const fiveLetterWords = dictionary.filter(word => word.length === 5)
renderSuggestions(fiveLetterWords)

cellsBox.addEventListener('click', e => {
  const cell = e.srcElement
  const cellIndex = cell.dataset.index

  if (!cellIndex) return
  if (letters[cellIndex]) cell.dataset.state = (cell.dataset.state + 1) % 3

  filterWords(fiveLetterWords, cells)
})

window.addEventListener('keydown', e => {
  const key = e.key.toUpperCase()

  if (key === 'BACKSPACE' && index > 0) {
    index--
    cells[index].innerHTML = ''
    cells[index].dataset.state = 0
    letters[index] = ''
    filterWords(fiveLetterWords, cells)
    return
  }

  if (e.repeat || !isLetter(key)) return

  if (index < NUM_CELLS) {
    cells[index].innerHTML = key
    letters[index] = key
    filterWords(fiveLetterWords, cells)
    index++
  }

  // if (index % 5 > 0 || index === 0) {
  //   index++
  //   return
  // }

  // if (!possibleWords.includes(letters.slice(index - 5, 5).join(''))) {
  //   return
  // }

  // index++
})

let sum = 0

fiveLetterWords.forEach(word1 => {
  

  // fiveLetterWords.forEach(word2 => {
  //   sum++
  // })
})

console.log(sum)

/*
* Specialized functions
*/
function filterWords(words, cells) {
  const exactLength = false
  const minLength = false
  const maxLength = false
  let notHasLetter = []
  let hasLetter = []
  let notHasLetterAt = [[], [], [], [], []]
  let hasLetterAt = [[], [], [], [], []]
  let exactLetterCount = {}
  let minLetterCount = {}
  let maxLetterCount = {}

  const filledCells = cells.filter(c => c.innerHTML.length === 1)  
  
  filledCells.forEach(c => {
    const state = Number(c.dataset.state)
    const index = Number(c.dataset.index)
    const letter = c.innerHTML

    if (state === 2) {
      hasLetterAt[index % 5].push(letter)
      // maxLetters[letter] = maxLetters[letter] + 1 || 1
    }
    else if (state === 1) {
      notHasLetterAt[index % 5].push(letter)
      // maxLetters[letter] = maxLetters[letter] + 1 || 1
    }
    else if (notHasLetterAt.some(arr => arr.includes(letter))) {
      notHasLetterAt[index % 5].push(letter)
    }
    else if (hasLetterAt.some(arr => arr.includes(letter))) {
      notHasLetterAt[index % 5].push(letter)
    }
    else {
      notHasLetter.push(letter)
    }
  })

  // ??? minLetters increases for each green/yellow, then becomes exactLetters when first gray is found

  // const rows = filledCells.reduce((acc, cell) => acc += cell.innerHTML, '').match(/.{1,5}/g)
  // console.log(rows)

  const filteredWords = words.map(word => word.toUpperCase()).filter(word =>
    (!exactLength || word.length === exactLength)
    && (!minLength || word.length >= minLength)
    && (!maxLength || word.length <= maxLength)
    && notHasLetter.every(l => !word.includes(l))
    && hasLetter.every(l => word.includes(l))
    && notHasLetterAt.every(l => word.includes(l))
    && notHasLetterAt.every((arr, i) => !arr.includes(word.charAt(i)))
    && hasLetterAt.every((arr, i) => !arr.length || arr.includes(word.charAt(i)))
    && keys(exactLetterCount).every(l => word.split(l).length - 1 === exactLetterCount[l])
    && keys(minLetterCount).every(l => word.split(l).length - 1 >= minLetterCount[l])
    && keys(maxLetterCount).every(l => word.split(l).length - 1 <= maxLetterCount[l])
  )

  renderSuggestions(filteredWords)
}

function renderSuggestions(words) {
  suggestionsBox.innerHTML = ''
  const shown = MAX_SUGGESTIONS < words.length ? MAX_SUGGESTIONS : words.length
  render(suggestionsBox, `<p class="suggestions-header">Showing ${shown} of ${words.length} possible words</p>`)
  const suggestions = render(suggestionsBox, '<div class="suggestions"></div>')
  render(suggestions, words.map(w => `<p>${w.toLowerCase()}</p>`).slice(0, shown).join(''))
}

/*
* Generic functions
*/
function render(e, html) {
  if (!e || !html) return
  const newElement = useFragment(html)
  e.appendChild(newElement)
  return e.children[e.children.length - 1]
}

function useFragment(html) {
  return document.createRange().createContextualFragment(html)
}

function isLetter(str) {
  return str && str.length === 1 && str.toLowerCase().match(/[a-z]/)
}

function forNum(num, callback) {
  if (Number.isNaN(num)) return
  [...Array(num).keys()].forEach(callback)
}

function keys(obj) {
  if (!obj) return []
  return [...Object.keys(obj)]
}