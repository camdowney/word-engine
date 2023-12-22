import { watch } from 'https://cdn.jsdelivr.net/npm/neutro@2.3.0/min.js'
import filterWords from '../lib/filterWords.js'
import getFiltersFromCells from '../lib/getFiltersFromCells.js'
import { fiveLetterWords } from '../dictionary/fiveLetterWords.js'
import { cells, chunk } from '../lib/util.js'

export const Suggestions = () => ref => {
  watch(() => {
    const filtered = filterWords(fiveLetterWords, getFiltersFromCells(cells.val))
    const chunks = chunk(filtered, 100)

    let current = 0
  
    ref.html`
      <div class='suggestions'>
        <h2 class='suggestions-header'>
          Showing ${filtered.length} possible words
        </h2>
        <div class='suggestions-list'></div>
      </div>
    `
  
    const list = ref.q('.suggestions-list')
  
    // TODO: refactor
    const loadMore = () => {
      if (list.val.scrollTop < list.val.scrollHeight - 600)
        return
  
      if (current >= chunks.length)
        return list.val.removeEventListener('scroll', loadMore)
      
      list.val.innerHTML += chunks[current++].map(word => `<p>${word}</p>`).join('')
    }
  
    loadMore()
  
    list.on('scroll', loadMore)
  })
}