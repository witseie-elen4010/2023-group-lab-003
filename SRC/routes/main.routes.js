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
router.get('/update/:id', async (req, res) => {
  try {
      const appointment = await Appointment.findById(req.params.id);  
      if (!appointment) {
          return res.status(404).send('Appointment not found');
      }

      res.render('update', { appointment: appointment }); 
  } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
  }
});

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
    const updateTime = req.body.update_date;
    const appointmentId = req.body.appointment_id; 

    try {
      const update = { date: updateTime };
      const updatedAppointment = await Appointment.findOneAndUpdate({ _id: appointmentId }, update, { new: true });
      if(updatedAppointment) {
        res.json({ message: 'Times updated successfully' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred' });
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
  const appointmentController = require('../controllers/appointment.controller')
  const timeslotsController = require('../controllers/timeslots.controller')
  
  router.get('/scheduleAppointment', (req, res) => {
    res.render('scheduleAppointment')
  })
  
  router.get('/scheduleAppointment/lecturerDetails', (req, res) => {
    User.find({role: 'lecture',})
    .then(
      lecturers => {
        // console.log('registered lecturers ', lecturers)
        if (!lecturers) res.status(400).send({message: 'No registered lecturers'})
        else res.status(200).send({data: lecturers})
      }
    )
  })
  router.post('/scheduleAppointment', appointmentController.createAppointment); //updated schedule appointment linking appointment to the logged in user
  router.post('/createTimeslot', timeslotsController.createTimeslot); // create time slot by the logged in user

//display all scheduled appointment of the logged in user
router.get('/studentDashboard', (req, res) => {
  const userId = req.session.userId //session user id
  User.findById(userId).populate('appointments').then(user => {
    if (user) {
      const userAppointments = user.appointments
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
  const userId = req.session.userId; //session user id
  User.findById(userId).populate('appointments').then(user => {
    if (user) {
      const userAppointments = user.appointments
      Appointment.find({ _id: { $in: userAppointments } }).then((appointments) => {
        res.render('lecturerDashboard', { appointments })
      })
    }
    else {
      res.send("Please login")
    }
  })

})

router.get('/timeslots', (req, res) => {
  const userId = req.session.userId;
  User.findById(userId).populate('timeslots').then(user => {
    if (user) {
      const userTimeslots = user.timeslots
      console.log(userTimeslots)
      Timeslot.find({ _id: { $in: userTimeslots } }).then((timeslots) => {
        res.render('timeslots', { timeslots })
      })
    }
    else {
      res.send("Please login")
    }
  })

})

// router to delete  timeslots
router.get('/cancel/timeslot/:id', timeslotsController.deleteTimeslot)

//Get router to cancel the appointment
router.get('/cancel/:id', (req, res) => {
  const appointmentId = req.params.id; //get appointment id from url
  const userId = req.session.userId; // Get user id from session

  // Find the user and appointment
  User.findById(userId)
    .populate('appointments')
    .exec()
    .then(user => {
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Find the appointment to be canceled
      const appointment = user.appointments.find(appt => appt._id.toString() === appointmentId);
      if (!appointment) {
        return res.status(404).json({ error: 'Appointment not found' });
      }
      // Remove the appointment from the user's appointments array
      user.appointments.pull(appointment._id);
      // Save the updated user object
      return user.save();
    })
    .then((user) => {
      if (user.role === 'student') {
        res.redirect('/studentDashboard');
      } else {
        res.redirect('/lectuerDashboard');
      }

    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error: 'Failed to cancel appointment' });
    });
});


module.exports = router
