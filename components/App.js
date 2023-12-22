import { q } from 'https://cdn.jsdelivr.net/npm/neutro@2.4.0/min.js'
import { Layout } from './Layout.js'

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