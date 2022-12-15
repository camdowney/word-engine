import { chunk } from '../lib/util.js'
import { fiveLetterWords } from '../dictionary/fiveLetterWords.js'
import filterWords from '../lib/filterWords.js'
import getFiltersFromCells from '../lib/getFiltersFromCells.js'

export default function Suggestions({ cells }) {
  const filtered = filterWords(fiveLetterWords, getFiltersFromCells(cells))
  const chunks = chunk(filtered, 100)

  let current = 0

  const loadMore = e => {
    const list = e.srcElement

    if (list.scrollTop < list.scrollHeight - 600)
      return

    if (current === chunks.length)
      return list.removeEventListener('scroll', loadMore)
    
    list.innerHTML += chunks[current++].map(word => `<p>${word}</p>`).join('')
  }
  
  return {
    class: 'suggestions',
    c: [
      { r: 'p', class: 'suggestions-header', c: `Showing ${filtered.length} possible words` },
      { class: 'suggestions-list', _mount: loadMore, _scroll: loadMore },
    ],
  }
}