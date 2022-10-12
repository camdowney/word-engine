import { keys } from './util.js'

export default function filterWords(words, filters) {
  if (!words || words.length < 1) return []
  if (!filters) return words

  const { 
    minLength, maxLength, // Number
    minLetterCount, maxLetterCount, // Object with letter-count pairs
    notHasLetterAt, hasLetterAt, // Array of arrays of letters for each index in word
  } = filters

  let filtered = words

  if (minLength)
    filtered = filtered.filter(w => w.length >= minLength)

  if (maxLength)
    filtered = filtered.filter(w => w.length <= maxLength)

  if (minLetterCount)
    filtered = filtered.filter(w => keys(minLetterCount).filter(key => minLetterCount[key])
      .every(l => w.split(l).length - 1 >= minLetterCount[l]))

  if (maxLetterCount)
    filtered = filtered.filter(w => keys(maxLetterCount).filter(key => maxLetterCount[key])
      .every(l => w.split(l).length - 1 <= maxLetterCount[l]))

  if (notHasLetterAt)
    filtered = filtered.filter(w => notHasLetterAt.every((arr, i) => !arr.includes(w.charAt(i))))

  if (hasLetterAt)
    filtered = filtered.filter(w => hasLetterAt.every((arr, i) => !arr.length || arr.includes(w.charAt(i))))

  return filtered
}