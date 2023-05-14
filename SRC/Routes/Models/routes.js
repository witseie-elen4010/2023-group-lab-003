const express = require('express')
const Appointment = require('../../Models/appointmentSchema')
const router = express.Router()

router.get('/', (req, res) => {
  res.render('index')
})

router.get('/signup', (req, res) => {
  res.render('signup')
})

router.get('/signin', (req, res) => {
  res.render('signin')
})

// ------------------- Schedule Appointment -----------------------
// showing schedule appointment form
const {emptyInput} = require('../../Public/scripts/backendAppointment')
router.get('/scheduleAppointment', (req, res) => {
  res.render('scheduleAppointment')
})

// handling schedule appointment details
router.post('/scheduleAppointment', async (req, res) => {
  const data = {
    eventTitle: req.body.eventTitle
  }

  // save data to database if it is valid
  if (emptyInput(data.eventTitle)){
    res.status(400).send({message: 'Invalid event title'})
  }
  else{
    Appointment.insertMany(data)
    res.status(200).json({message: 'Schedule successfully set'})
  }
})

module.exports = router
