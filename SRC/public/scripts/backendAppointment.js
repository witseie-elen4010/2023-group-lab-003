'use script'

const emptyInput = (input) => {
  const isEmpty = (input === "") ? true : false
  return isEmpty
}

const containCharacters = (input) => {
  const characters = /[!\@\#\$\%\^\&\*\(\)\-\_\+\=\~\?\.\,\?\<\>\{\}\\]/
  const hasCharacters = input.match(characters) ? true : false
  return hasCharacters
}

const containNumbers = (input) => {
  const numbers = /[0-9]/
  const hasNumbers = input.match(numbers) ? true : false
  return hasNumbers
}

const containAlphabets = (input) => {
  const alphabets = /^[A-Za-z]+$/
  const hasAlphabets = input.match(alphabets) ? true : false
  return hasAlphabets
}

const validateEventTitle = (input) => {
  const isValid = ( containAlphabets(input) || containCharacters(input) || containNumbers(input)) ? true : false
  return isValid
}

module.exports = {
  emptyInput,
  validateEventTitle
}