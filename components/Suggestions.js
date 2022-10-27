import { render } from '../min.js'
import { getPageItems, getNumPages } from '../lib/util.js'
import { fiveLetterWords } from '../dictionary/fiveLetterWords.js'
import filterWords from '../lib/filterWords.js'
import getFiltersFromCells from '../lib/getFiltersFromCells.js'

const PAGE_SIZE = 100
const SCROLL_OFFSET = 600

export default function Suggestions({ cid, cells }) {
  const filtered = filterWords(fiveLetterWords, getFiltersFromCells(cells))
  const all = filtered.map(w => `<p>${w}</p>`)
  const numPages = getNumPages(all, PAGE_SIZE)

  let currentPage = 0

  const loadMoreSuggestions = () => {
    const list = document.querySelector('#' + cid)

    if (list.scrollTop < list.scrollHeight - SCROLL_OFFSET) return
    if (currentPage === numPages) return list.removeEventListener('scroll', loadMoreSuggestions)
    
    render(list, getPageItems(all, currentPage++, PAGE_SIZE))
  }
  
  return (
    ('div', { class: 'suggestions', _mount: loadMoreSuggestions }, [
      ('p', { class: 'suggestions-header' }, [
        `Showing ${filtered.length} possible words`
      ]),
      ('div', { id: cid, class: 'suggestions-list', _scroll: loadMoreSuggestions }),
    ])
  )
}