const express = require('express')
const Appointment = require('../models/appointmentSchema')
const router = express.Router()
const user = require('../models/user.schema');
const authController = require('../controllers/auth.controller');
const { authenticate, authStudent, authLecture } = require('../middleware/authenticate.routes');


errorHandler = (err) => {
    console.error(err.message, err.code);
};

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/signup', (req, res) => {
    res.render('signup');
});

router.post('/signup',authController.register);


router.get('/signin', (req, res) => {
    res.render('Login');
});

router.get('/dummyDashboard', (req, res) => {
    res.render('dummyDashboard');
});
router.get('/dummystudentdashboard', (req, res) => {
    res.render('dummystudentdashboard');
})
router.post('/signin', authController.login);

// ------------------- Schedule Appointment -----------------------
// showing schedule appointment form
const {emptyInput, validateEventTitle} = require('../public/scripts/backendAppointment')
router.get('/scheduleAppointment', (req, res) => {
  res.render('scheduleAppointment')
})

// handling schedule appointment details
router.post('/scheduleAppointment', async (req, res) => {
  const data = {
    eventTitle: req.body.eventTitle,
    lecturerName: req.body.lecturerName
  }

  // save data to database if it is valid
  if (emptyInput(data.eventTitle) && !validateEventTitle(data.eventTitle)){
    res.status(400).send({message: 'Invalid event title'})
  }
  else{
    // update database
    console.log(data)
    Appointment.insertMany(data)
    res.status(200).json({message: 'Schedule successfully set'})
  }
})

module.exports = router
