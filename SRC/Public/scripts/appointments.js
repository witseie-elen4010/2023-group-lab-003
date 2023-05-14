'use strict'

const emptyInput = (input) => {
  const isEmpty = (input === "") ? true : false
  return isEmpty
}

const validateEventTitle = (input, eventTitleError) => {
  if(emptyInput(input)) {
      eventTitleError.innerHTML = 'Please fill in event title'
  } 
  else {
      eventTitleError.innerHTML = ''
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('scheduleAppointmentForm')
  if (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault()
      const eventTitle = document.getElementById('eventTitle').value
      const eventTitleError = document.getElementById('eventTitleError')

      validateEventTitle(eventTitle, eventTitleError)
    })
  }
})
  