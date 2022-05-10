export default function getUniqueRandomNumbers(count, rangeMin, rangeMax) {
  // https://stackoverflow.com/questions/2380019/generate-unique-random-numbers-between-1-and-100
  if (!count) {
    return []
  }
  var arr = []
  while (arr.length < Math.min(count, rangeMax)) {
    var r = Math.floor(Math.random() * rangeMax)
    if (arr.indexOf(r) === -1) arr.push(r)
  }
  return arr
}
