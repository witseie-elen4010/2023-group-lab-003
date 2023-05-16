const express = require('express')
const Appointment = require('../models/appointmentSchema')
const router = express.Router()
const User = require('../models/user.schema');
const session = require('express-session')
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

//lecturer dashboard route
router.get('/lecturerDashboard', (req, res) => {
    res.render('lecturerDashboard');
});
//student dashboard route
/*
router.get('/studentDashboard', (req, res) => {
    res.render('studentDashboard');
})*/
router.post('/signin', authController.login);

// ----------------- Update Appointment------------------------------
router.get('/update', (req, res) => { 
  res.render('update')
})



router.post('/updateConsultationTimes', async (req,res) =>{
  const { startTime, endTime } = req.body;
  //Will get appropraite ID document for user in the future
  const appointmentId = '6463c9f40d08141f7072e3f6';

  try {
    await Appointment.updateOne({ _id: appointmentId }, { startTime, endTime });
    console.log('Times updated successfully');
  } catch (error) {
    console.error(error);
    console.log('An error occurred');
  }
});

//--------------------------------------------------------------------


//---------------------Availalbility----------------------------------
router.get('/Availability', (req, res) => { 
  res.render('Availability')
})


// ------------------- Schedule Appointment -----------------------
// showing schedule appointment form
const {emptyInput, validateEventTitle, validateLecturerName} = require('../public/scripts/backendAppointment')
router.get('/scheduleAppointment', (req, res) => {
  res.render('scheduleAppointment')
})

// handling schedule appointment details
/*
router.post('/scheduleAppointment', async (req, res) => {
  const data = {
    eventTitle: req.body.eventTitle,
    lecturerName: req.body.lecturerName,
    date: req.body.date
  }
  // save data to database if it is valid
  if (emptyInput(data.eventTitle) || !validateEventTitle(data.eventTitle)){
    res.status(400).send({message: 'Invalid event title'})
  }
  else if (emptyInput(data.lecturerName) || !validateLecturerName(data.lecturerName)){
    res.status(400).send({message: 'Invalid lecturers name'})
  }
  else if (emptyInput(data.date)){
    res.status(400).send({message: 'Invalid date'})
  }
  else{
    // update database
    Appointment.insertMany(data)
    res.status(200).json({message: 'Schedule successfully set'})
  }
})*/
router.post('/scheduleAppointment', authController.createAppointment); //updated schedule appointment linking appointment to the logged in user
router.post('/createTimeslot', authController.createTimeslot); // create time slot by the logged in user

//display all scheduled appointment of the logged in user
router.get('/studentDashboard', (req, res) => {
  const userId = req.session.userId
  console.log(userId)
    User.findById(userId).populate('appointments').then(user => {
    if(user){
      //const userId = user._id;
      const userAppointments = user.appointments
      console.log(userAppointments)
      //res.send(userAppointments)
      
    Appointment.find({_id:{ $in: userAppointments }}).then((appointments) => {
        res.render('studentDashboard', {appointments})
      })
    }
    else
    {
      res.send("User not found")
    }
  })
})

module.exports = router
