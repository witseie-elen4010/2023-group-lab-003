'use strict'
const validateTime = (startTime, endTime, timeError) => {
  console.log((endTime < startTime))
  if(endTime < startTime){
    timeError.innerHTML = 'Invalid Time'
     return false
  }
  else{
    timeError.innerHTML = ''
    return true
  }
}

document.addEventListener('DOMContentLoaded', function () {  
  const date = document.getElementById('eventDate')
  // set minimum date as 'today'
  date.min = new Date().toISOString().split("T")[0];  

  let startTime = document.querySelector('input[name="startTime"]')
  let endTime = document.querySelector('input[name="endTime"]')
  const timeError = document.getElementById('timeError')
  startTime.addEventListener('change', () => {validateTime(startTime.value, endTime.value, timeError)})
  endTime.addEventListener('change', () => {validateTime(startTime.value, endTime.value, timeError)})
})