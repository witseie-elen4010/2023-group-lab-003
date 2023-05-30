'use strict'
const validateTime = (startTime, endTime) => {
  if(endTime < startTime) return false
  return true
}

document.addEventListener('DOMContentLoaded', function () {  
  const date = document.getElementById('date')
  // set minimum date as 'today'
  date.min = new Date().toISOString().split("T")[0];  

  const startTime = document.getElementById('startTime')
  const endTime = document.getElementById('endTime')
  if (validateTime(startTime, endTime)) console.log('Valid')
})