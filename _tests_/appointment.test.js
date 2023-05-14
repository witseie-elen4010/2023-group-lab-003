'use strict'
const { emptyInput, validateEventTitle } = require('../SRC/public/scripts/backendAppointment')

describe('Validate event title', () => {
  test('Event title is valid if it contains numbers', () => {
    const eventTitle = '12345'
    const result = validateEventTitle(eventTitle)
    expect(result).toBe(true)
  })

  test('Event title contain alphabets', () => {
    const eventTitle = 'abcABC'
    const result = validateEventTitle(eventTitle)
    expect(result).toBe(true)
  })

  test('Event title contain characters', () => {
    const eventTitle = '!@##'
    const result = validateEventTitle(eventTitle)
    expect(result).toBe(true)
  })

  test('Event title  is invalid if input is empty', () => {
    const eventTitle = ''
    const result = emptyInput(eventTitle)
    expect(result).toBe(true)
  });

  test('Event title is valid if input is not empty', () => {
    const eventTitle = 'Event 1'
    const result = emptyInput(eventTitle)
    expect(result).toBe(false)
  });
});