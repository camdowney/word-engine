import { render } from '../min.js'
import { getPageItems, getNumPages } from '../util.js'
import { fiveLetterWords } from '../dictionary/fiveLetterWords.js'
import filterWords from '../filterWords.js'

const PAGE_SIZE = 100
const SCROLL_OFFSET = 600

export default function Suggestions({ getFilters }) {
  const filteredWords = filterWords(fiveLetterWords, getFilters())
  const allSuggestions = filteredWords.map(w => `<p>${w}</p>`)
  const numPages = getNumPages(allSuggestions, PAGE_SIZE)
  let currentPage = 0

  const loadMoreSuggestions = () => {
    const list = document.querySelector('#suggestions-list')
    if (list.scrollTop < list.scrollHeight - SCROLL_OFFSET) return
    if (currentPage === numPages) return list.removeEventListener('scroll', loadMoreSuggestions)
    render(list, getPageItems(allSuggestions, currentPage++, PAGE_SIZE))
  }
  
  return {
    id: 'suggestions',
    _mount: loadMoreSuggestions,
    c: [
      `<p class="suggestions-header">Showing ${filteredWords.length} possible words</p>`,
      { id: 'suggestions-list', _scroll: loadMoreSuggestions },
    ],
  }
}