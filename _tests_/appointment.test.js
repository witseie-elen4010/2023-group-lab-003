'use strict'
const { validateEventTitle } = require('../SRC/Public/scripts/appointments')

describe('Validate event title', () => {
  test('Event title contain numbers', () => {
    const eventTitle = '12345'
    const eventTitleError = {innerHTML: ''}
    const result = validateEventTitle(eventTitle, eventTitleError)
    expect(result).toBe(true)
  })

  test('Event title contain alphabets', () => {
    const eventTitle = 'abcABC'
    const eventTitleError = {innerHTML: ''}
    const result = validateEventTitle(eventTitle, eventTitleError)
    expect(result).toBe(true)
  })

  test('Event title contain characters', () => {
    const eventTitle = '!@##'
    const eventTitleError = {innerHTML: ''}
    const result = validateEventTitle(eventTitle, eventTitleError)
    expect(result).toBe(true)
  })

  test('Event title  is invalid if input is empty', () => {
    const eventTitle = ''
    const eventTitleError = {innerHTML: ''}
    const result = validateEventTitle(eventTitle, eventTitleError)
    expect(result).toBe(false)
  });

  test('Event title is valid if input is not empty', () => {
    const eventTitle = 'Event 1'
    const eventTitleError = {innerHTML: ''}
    const result = validateEventTitle(eventTitle, eventTitleError)
    expect(result).toBe(true)
  });
});