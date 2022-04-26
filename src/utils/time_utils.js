export function timeSince(date) {
  var seconds = Math.floor((new Date() - date) / 1000)

  var interval = seconds / 31536000

  if (interval > 1) {
    const rounded = Math.floor(interval)
    const message = rounded == 1 ? ' year' : ' years'
    return rounded + message + ' ago'
  }
  interval = seconds / 2592000
  if (interval > 1) {
    const rounded = Math.floor(interval)
    const message = rounded == 1 ? ' month' : ' months'
    return rounded + message + ' ago'
  }
  interval = seconds / 86400
  if (interval > 1) {
    const rounded = Math.floor(interval)
    const message = rounded == 1 ? ' day' : ' days'
    return rounded + message + ' ago'
  }
  interval = seconds / 3600
  if (interval > 1) {
    const rounded = Math.floor(interval)
    const message = rounded == 1 ? ' hour' : ' hours'
    return rounded + message + ' ago'
  }
  interval = seconds / 60
  if (interval > 1) {
    const rounded = Math.floor(interval)
    const message = rounded == 1 ? ' minute' : ' minutes'
    return rounded + message + ' ago'
  }
  const rounded = Math.floor(interval)
  const message = rounded == 1 ? ' second' : ' seconds'
  if (rounded < 10) {
    return 'just now'
  }
  return rounded + message + ' ago'
}
