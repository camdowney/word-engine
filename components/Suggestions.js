import { render, getPageItems, getNumPages } from '../util.js'
import filterWords from '../filterWords.js'

const PAGE_SIZE = 100
const SCROLL_OFFSET = 1000

export default function Suggestions(words = [], filters = []) {
  const filteredWords = filterWords(words, filters)
  const allSuggestions = filteredWords.map(w => `<p>${w}</p>`)
  const numPages = getNumPages(allSuggestions, PAGE_SIZE)
  let currentPage = 0

  const loadMoreSuggestions = () => {
    const list = document.querySelector('#suggestions .suggestions-list')
    if (list.scrollTop < list.scrollHeight - SCROLL_OFFSET) return
    if (currentPage === numPages) return list.removeEventListener('scroll', loadMoreSuggestions)
    render(list, getPageItems(allSuggestions, currentPage++, PAGE_SIZE))
  }
  
  return {
    id: 'suggestions',
    children: [
      `<p class="suggestions-header">Showing ${filteredWords.length} possible words</p>`,
      { class: 'suggestions-list', _scroll: loadMoreSuggestions },
    ],
    _mount: loadMoreSuggestions,
  }
}