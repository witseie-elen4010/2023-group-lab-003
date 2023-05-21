const express = require('express')
const Appointment = require('../models/appointmentSchema')
const Timeslot = require('../models/timeslots.schema')
const router = express.Router()
const User = require('../models/user.schema');
const session = require('express-session')
const authController = require('../controllers/auth.controller');
const { authenticate, authStudent, authLecture } = require('../middleware/authenticate.routes');


errorHandler = (err) => {
  console.error(err.message, err.code);
};

//get the landing page
router.get('/', (req, res) => {
  res.render('index');
});

//get the sign up page
router.get('/signup', (req, res) => {
  res.render('signup');
});

//signup route, authentication done by authController
router.post('/signup', authController.register);

//get the sign in page
router.get('/signin', (req, res) => {
  res.render('Login');
});

//signin route, authentication done by authController
router.post('/signin', authController.login);



// ----------------- Update Appointment------------------------------
router.get('/update', (req, res) => {
  res.render('update')
})

//----------------- Settings -------------------------------
router.get('/settings',(req,res) => {
  res.render('settings')
})

router.get('/goodbye',(req,res) => {
  res.render('goodbye')
})

router.post('/update-email', authController.updateEmail);
router.post('/update-password', authController.updatePassword)
router.post('/delete-account', authController.deleteAccount)

//-----------------------------------------------------------

//sign out the user
router.get('/signout', (req, res) => {

  req.session.destroy(err => { //destroy the session
    if (err) {
      console.log(err);
    }
    console.log("Signout successfully!")
    res.redirect('signin'); //go to the signin page
  });
  });


  router.post('/updateConsultationTimes', async (req, res) => {
    const { startTime, endTime } = req.body;
    //Will get appropraite ID document for user in the future
    const appointmentId = '6463c9f40d08141f7072e3f6'; //Security issue

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
  //specify availability time slots
  router.get('/createTimeslot', (req, res) => {
    res.render('timeslot');
  })

  

  // ------------------- Schedule Appointment -----------------------
  // showing schedule appointment form
  const { emptyInput, validateEventTitle, validateLecturerName } = require('../public/scripts/backendAppointment')
  router.get('/scheduleAppointment', (req, res) => {
    res.render('scheduleAppointment')
  })
  //-----The code below shoulde be edited and placed in the authController file------//
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
    //console.log(userId)
    User.findById(userId).populate('appointments').then(user => {
      if (user) {
        //const userId = user._id;
        const userAppointments = user.appointments
        console.log(userAppointments)
        //res.send(userAppointments)

        Appointment.find({ _id: { $in: userAppointments } }).then((appointments) => {
          res.render('studentDashboard', { appointments })
        })
      }
      else {
        res.send("Please login")
      }
    })
  })

  //display all timeslots made by the logged in lecture
  router.get('/lecturerDashboard', (req, res) => {
    const userId = req.session.userId
    //console.log(userId)
    User.findById(userId).populate('timeslots').then(user => {
      if (user) {
        //const userId = user._id;
        const userTimeslots = user.timeslots
        console.log(userTimeslots)
        //res.send(userAppointments)

        Timeslot.find({ _id: { $in: userTimeslots } }).then((timeslots) => {
          res.render('lecturerDashboard', { timeslots })
        })
      }
      else {
        res.send("Please login")
      }
    })

  })
  module.exports = router
