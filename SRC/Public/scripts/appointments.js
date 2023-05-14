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
      
      const data = {
        eventTitle: eventTitle
      }
      postJSON(data)
    })
  }
})


function postJSON(data) {
  const baseURL = 'http://localhost:3000'
  fetch(baseURL + '/scheduleAppointment', {
    method: 'post',//specify method to use
    headers: {//headers to specify the type of data needed
    'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(function(response) {
    if(response.ok)
      return response.json(); // Return the response parse as JSON if code is valid
    else
      throw 'Failed!'
  }).catch(function (e) { // Process error for request
  alert(e) // Displays a browser alert with the error message.
  // This will be the string thrown in line 7 IF the
  // response code is the reason for jumping to this
  // catch() function.
  })
}