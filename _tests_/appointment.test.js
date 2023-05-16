'use strict'
const { emptyInput, validateEventTitle, validateLecturerName } = require('../SRC/public/scripts/backendAppointment')

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

describe('Validate lecturer name ', () => {
  test('Lecturer name is invalid if it only contains numbers', () => {
    const lecturerName = '12345'
    const result = validateLecturerName(lecturerName)
    expect(result).toBe(false)
  })

  test('Lecturer name is valid contains only alphabets', () => {
    const lecturerName = 'abcABC'
    const result = validateEventTitle(lecturerName)
    expect(result).toBe(true)
  })

  test('Lecturer name is invalid if it contains only characters', () => {
    const lecturerName = '!@##'
    const result = validateLecturerName(lecturerName)
    expect(result).toBe(false)
  })
  
  test('Lecturer name is invalid if it contains any characters', () => {
    const lecturerName = '!@##Lecturer'
    const result = validateLecturerName(lecturerName)
    expect(result).toBe(false)
  })

  test('Lecturer name is invalid if it contains any numbers', () => {
    const lecturerName = '1234Lecturer'
    const result = validateLecturerName(lecturerName)
    expect(result).toBe(false)
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
