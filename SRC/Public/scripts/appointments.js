'use strict'

console.log('Started!')
// debugger

const emptyInput = (input) => {
  const isEmpty = (input === "") ? true : false
  debugger
  return isEmpty
}

const validateEventTitle = (input, eventTitleError) => {
  console.log('Here ', input )
  console.log(eventTitleError )
  if(emptyInput(input)) {
      eventTitleError.innerHTML = 'Please fill in event title'
  } 
  else {
      eventTitleError.innerHTML = ''
  }
}

// debugger
document.addEventListener('DOMContentLoaded', function () {
  // debugger
  const form = document.getElementById('scheduleAppointmentForm')
  // debugger 
  if (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault()
      const eventTitle = document.getElementById('eventTitle').value
      const eventTitleError = document.getElementById('eventTitleError')

      validateEventTitle(eventTitle, eventTitleError)
      
    })
  }
})
  