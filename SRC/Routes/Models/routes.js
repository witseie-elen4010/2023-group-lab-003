const express = require('express')
const Appointment = require('../../Models/appointment')
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
router.get('/scheduleAppointment', (req, res) => {
  res.render('scheduleAppointment')
})

// handling schedule appointment details
router.post('/scheduleAppointment', async (req, res) => {
  // data will go to moongo
  const data = await Appointment.create({
    eventTitle: req.body.eventTitle
  })

  return res.status(200).json(data)
})

module.exports = router
