import { keys } from './util.js'

export default function filterWords(words, filters) {
  if (!words || words.length < 1) return []
  if (!filters) return words

  const { minLength, maxLength, notHasLetterAt, hasLetterAt, minLetterCount, maxLetterCount } = filters
  let filtered = words

  // if (exactLength)
  //   filtered = filtered.filter(w => w.length === exactLength)

  if (minLength)
    filtered = filtered.filter(w => w.length >= minLength)

  if (maxLength)
    filtered = filtered.filter(w => w.length <= maxLength)

  // if (notHasLetter)
  //   filtered = filtered.filter(w => notHasLetter.every(l => !w.includes(l)))

  // if (hasLetter)
  //   filtered = filtered.filter(w => hasLetter.every(l => w.includes(l)))
    
  if (notHasLetterAt)
    filtered = filtered.filter(w => notHasLetterAt.every((arr, i) => !arr.includes(w.charAt(i))))

  if (hasLetterAt)
    filtered = filtered.filter(w => hasLetterAt.every((arr, i) => !arr.length || arr.includes(w.charAt(i))))

  // if (exactLetterCount)
  //   filtered = filtered.filter(w => keys(exactLetterCount).every(l => w.split(l).length - 1 === exactLetterCount[l]))

  if (minLetterCount)
    filtered = filtered.filter(w => keys(minLetterCount).every(l => w.split(l).length - 1 >= minLetterCount[l]))

  if (maxLetterCount)
    filtered = filtered.filter(w => keys(maxLetterCount).every(l => w.split(l).length - 1 <= maxLetterCount[l]))

  return filtered
}