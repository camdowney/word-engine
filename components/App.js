import { q } from 'https://cdn.jsdelivr.net/npm/neutro@2.4.1/min.js'
import { Layout } from './Layout.js'

const head = q('head')

head.val.innerHTML += `
  <title>Word Engine</title>
  <meta name='description' content='Stuck on your current guess in Wordle? Simply input your board and Word Engine will automatically narrow down which words are possible!'>
`

const root = q('#root')

root.html`
  <header>
    <h1>Word Engine</h1>
  </header>
  <main>
    ${Layout()}
  </main>
  <footer>
    <p>
      © ${new Date().getFullYear()} Cameron Downey | Built with
      <a
        href='https://github.com/camdowney/neutro'
        target='_blank'
        rel='noopener noreferrer'
      >
        Neutro
      </a>
    </p>
  </footer>
`