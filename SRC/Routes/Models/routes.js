const express = require('express')
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

router.get('/scheduleAppointment', (req, res) => {
  res.render('scheduleAppointment')
})

module.exports = router
