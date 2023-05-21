'use strict'

// Uncomment this base URL when coding  
// const baseURL = 'http://localhost:3000' 
// Uncomment this base URL for deployment. It ensures to use the app URL instead of localhost
const baseURL = 'https://remotepa.azurewebsites.net/' 

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

const containCharacters = (input) => {
  const characters = /[!\@\#\$\%\^\&\*\(\)\-\_\+\=\~\?\.\,\?\<\>\{\}\\]/
  const hasCharacters = input.match(characters) ? true : false
  return hasCharacters
}

const validateLecturerName = (lecturerName, lecturerNameError) => {
  if(emptyInput(lecturerName)){
    lecturerNameError.innerHTML = 'Please fill in the name of the lecturer'
    return false
  }
  else if (containNumbers(lecturerName) || containCharacters(lecturerName)){
    lecturerNameError.innerHTML = 'Lecturer name must contain letters only'
    return false
  }
  else{
    lecturerNameError.innerHTML = ''
    return true
  }
}

const validateDate = (date, dateError) => {
  if(emptyInput(date)){
    dateError.innerHTML = 'Please choose a date and time'
    return false
  }
}

const lecturerName = () => {
  let names = []
  fetch( baseURL + '/scheduleAppointment/lecturerDetails', {method: 'GET'} )
  .then( function(response) { return response.json()} )
  .then( function(response) {
    const lecturerDetails = response.data
    lecturerDetails.forEach( element => {
      const fullName = `${element.name} ${element.surname}`
      names.push(fullName)
    })
    console.log( 'lecturer names' , names )
    
    const namesID = document.getElementById('lecturerName')
    names.forEach( name => {
      if(namesID.selectedIndex >=0) {
        var option = document.createElement('option')
        option.text = name
        var sel = namesID.options[namesID.selectedIndex]
        namesID.add(option, sel)
      }
    })

    const selector = document.querySelector('select')
    selector.addEventListener('change', (event) => {
    console.log('value ', selector.value)}) 

    return response})
}

document.addEventListener('DOMContentLoaded', function () {
  lecturerName()
  
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

      const date = document.getElementById('date').value
      console.log(date)
      const dateError = document.getElementById('dateError')
      validateDate(date, dateError)
      
      const data = {
        eventTitle: eventTitle,
        lecturerName: lecturerName,
        date: date
      }
      postJSON(data)
    })
  }
})


function postJSON(data) {
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
      // return response; // Return the response parse as JSON if code is valid
      window.location.replace(baseURL + '/studentDashboard')
    }
    else{
      throw 'Invalid input'
    }
  }).catch(function (e) { // Process error for request
  console.log(e) 
  })
}

// for tests:
// module.exports = {
//   validateEventTitle
// }