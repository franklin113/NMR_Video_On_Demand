import { timeSince } from '@/utils/time_utils'
describe('testing time since function from stack overflow', () => {
  test('it is 1 day ago', () => {
    var aDay = 24 * 60 * 60 * 1000
    expect(timeSince(new Date(Date.now() - aDay))).toBe('24 hours')
  })
  test('it is 1 day ago', () => {
    var aDay = 24 * 60 * 60 * 1000
    expect(timeSince(new Date(Date.now() - 3601 * 1000))).toBe('1 hour')
  })
  test('it is 1 day ago', () => {
    var aDay = 24 * 60 * 60 * 1000
    expect(timeSince(new Date(Date.now() - 3601 * 1000 * 2))).toBe('2 hours')
  })
})
