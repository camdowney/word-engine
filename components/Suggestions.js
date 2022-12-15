import { chunk } from '../lib/util.js'
import { fiveLetterWords } from '../dictionary/fiveLetterWords.js'
import filterWords from '../lib/filterWords.js'
import getFiltersFromCells from '../lib/getFiltersFromCells.js'

export default function Suggestions({ uid, cells }) {
  const filtered = filterWords(fiveLetterWords, getFiltersFromCells(cells))
  const chunks = chunk(filtered, 100)

  let current = 0

  const loadMoreSuggestions = () => {
    const list = document.querySelector('#' + uid)

    if (list.scrollTop < list.scrollHeight - 600) return
    if (current === chunks.length) return list.removeEventListener('scroll', loadMoreSuggestions)
    
    list.innerHTML += chunks[current++].map(word => `<p>${word}</p>`).join('')
  }
  
  return {
    class: 'suggestions',
    _mount: loadMoreSuggestions,
    c: [
      { r: 'p', class: 'suggestions-header', c: `Showing ${filtered.length} possible words` },
      { id: uid, class: 'suggestions-list', _scroll: loadMoreSuggestions },
    ],
  }
}