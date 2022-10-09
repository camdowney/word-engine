import { render, renderID, getPageItems, getNumPages } from './util.js'

export default function renderSuggestions(origin, words = []) {
  const PAGE_SIZE = 100
  const allSuggestions = words.map(w => `<p>${w}</p>`)
  const numPages = getNumPages(allSuggestions, PAGE_SIZE)
  let currentPage = 0

  const loadMoreSuggestions = () => {
    const list = document.querySelector('#suggestions .suggestions-list')
    if (list.scrollTop < list.scrollHeight - 1000) return
    if (currentPage === numPages) return list.removeEventListener('scroll', loadMoreSuggestions)
    render(list, getPageItems(allSuggestions, currentPage++, PAGE_SIZE))
  }

  renderID(origin, 'suggestions', {
    children: [
      `<p class="suggestions-header">Showing ${words.length} possible words</p>`,
      { class: 'suggestions-list', _scroll: loadMoreSuggestions },
    ]
  })

  loadMoreSuggestions()
}