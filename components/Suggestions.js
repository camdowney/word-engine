import { store, watch } from 'https://cdn.jsdelivr.net/npm/neutro@2.4.1/min.js'
import { fiveLetterWords } from '../dictionary/fiveLetterWords.js'
import filterWords from '../lib/filterWords.js'
import getFiltersFromCells from '../lib/getFiltersFromCells.js'
import { cells, chunk } from '../lib/util.js'

const index = store(1)

export const Suggestions = () => ref => {
  watch(() => {
    const filtered = filterWords(fiveLetterWords, getFiltersFromCells(cells.val))
    const chunks = chunk(filtered, 100)

    index.val = 1

    ref.html`
      <div class='suggestions'>
        <h2 class='suggestions-header'>
          Showing ${filtered.length} possible words
        </h2>
        ${List({ chunks })}
      </div>
    `
  })
}

export const List = ({ chunks }) => ref => {
  watch(() => {
    const suggestions = chunks.slice(0, index.val).flat()

    ref.class.add('suggestions-list')

    ref.html`
      ${suggestions.map(s => `<p>${s}</p>`)}
    `

    ref.on('scroll', () => {
      if (index.val >= chunks.length || ref.val.scrollTop < ref.val.scrollHeight - 600)
        return

      index.val++
    })
  })
}