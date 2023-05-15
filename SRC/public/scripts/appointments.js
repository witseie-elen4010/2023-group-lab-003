'use strict'

const emptyInput = (input) => {
  const isEmpty = (input === "") ? true : false
  return isEmpty
}

const validateEventTitle = (input, eventTitleError) => {
  if(emptyInput(input)) {
      eventTitleError.innerHTML = 'Please fill in event title'
      return false
  } 
  else {
      eventTitleError.innerHTML = ''
      return true
  }
}

const containNumbers = (input) => {
  const numbers = /[0-9]/
  const hasNumbers = input.match(numbers) ? true : false
  return hasNumbers
}

const validateLecturerName = (lecturerName, lecturerNameError) => {
  if(emptyInput(lecturerName)){
    lecturerNameError.innerHTML = 'Please fill in the name of the lecturer'
    return false
  }
  else if (containNumbers(lecturerName)){
    lecturerNameError.innerHTML = 'Lecturer name must contain letters only'
    return false
  }
  else{
    lecturerNameError.innerHTML = ''
    return true
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

      const lecturerName = document.getElementById('lecturerName').value
      const lecturerNameError = document.getElementById('lecturerNameError')
      validateLecturerName(lecturerName, lecturerNameError)
      
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
    method: 'post',
    headers: {
      //headers to specify the type of data needed
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(function(response) {
    if(response.ok){
      console.log('Success')
      return response.json(); // Return the response parse as JSON if code is valid
      // must redirect to dashboard
    }
    else{
      throw 'Invalid input'
    }
  }).catch(function (e) { // Process error for request
  console.log(e) // Displays a browser alert with the error message.
  // This will be the string thrown in line 7 IF the
  // response code is the reason for jumping to this
  // catch() function.
  })
}

// for tests:
// module.exports = {
//   validateEventTitle
// }