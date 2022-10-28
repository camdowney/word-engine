import { chunk } from '../lib/util.js'
import { fiveLetterWords } from '../dictionary/fiveLetterWords.js'
import filterWords from '../lib/filterWords.js'
import getFiltersFromCells from '../lib/getFiltersFromCells.js'

export default function Suggestions({ cid, cells }) {
  const filtered = filterWords(fiveLetterWords, getFiltersFromCells(cells))
  const chunks = chunk(filtered, 100)

  let current = 0

  const loadMoreSuggestions = () => {
    const list = document.querySelector('#' + cid)

    if (list.scrollTop < list.scrollHeight - 600) return
    if (current === chunks.length) return list.removeEventListener('scroll', loadMoreSuggestions)
    
    chunks[current++].forEach(word => list.innerHTML += `<p>${word}</p>`)
  }
  
  return {
    class: 'suggestions',
    _mount: loadMoreSuggestions,
    c: [
      { r: 'p', class: 'suggestions-header', c: `Showing ${filtered.length} possible words` },
      { id: cid, class: 'suggestions-list', _scroll: loadMoreSuggestions },
    ],
  }
}