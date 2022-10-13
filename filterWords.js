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

  if (minLetterCount) {
    const cleanMin = Object.entries(minLetterCount).filter(([_, val]) => val !== undefined)
    console.log(cleanMin)
    filtered = filtered.filter(w => cleanMin.every(([key, val]) => w.split(key).length - 1 >= val))
  }

  if (maxLetterCount) {
    const cleanMax = Object.entries(maxLetterCount).filter(([_, val]) => val !== undefined)
    filtered = filtered.filter(w => cleanMax.every(([key, val]) => w.split(key).length - 1 <= val))
  }

  if (notHasLetterAt)
    filtered = filtered.filter(w => notHasLetterAt.every((arr, i) => !arr.includes(w.charAt(i))))

  if (hasLetterAt)
    filtered = filtered.filter(w => hasLetterAt.every((arr, i) => !arr.length || arr.includes(w.charAt(i))))

  return filtered
}