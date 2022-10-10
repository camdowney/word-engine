import { createDOM, render, getPageItems, getNumPages } from './util.js'

const PAGE_SIZE = 100

export default function createSuggestions(words = []) {
  const allSuggestions = words.map(w => `<p>${w}</p>`)
  const numPages = getNumPages(allSuggestions, PAGE_SIZE)
  let currentPage = 0

  const loadMoreSuggestions = () => {
    const list = document.querySelector('#suggestions .suggestions-list')
    if (list.scrollTop < list.scrollHeight - 1000) return
    if (currentPage === numPages) return list.removeEventListener('scroll', loadMoreSuggestions)
    render(list, getPageItems(allSuggestions, currentPage++, PAGE_SIZE))
  }
  
  return createDOM({
    _mount: loadMoreSuggestions,
    id: 'suggestions',
    children: [
      `<p class="suggestions-header">Showing ${words.length} possible words</p>`,
      { class: 'suggestions-list', _scroll: loadMoreSuggestions },
    ],
  })
}