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


router.post('/updateConsultationTimes/:id', async (req, res) => {
  const { startTime, endTime } = req.body;
  //Will get appropraite ID document for user in the future
  const appointmentId = req.params.id; //get appointment id from url

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

router.get('/searchAppointment', (req, res) => {
  res.render('searchAppointment');
})

router.post('/searchAppointments', async (req, res, next) => {
  const userId = req.session.userId;
  const searchQuery = req.body.search;

  try {
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(404).render('error', { message: 'User not found' });
    }

    let condition = {};
    if (searchQuery) {
      condition = {
        $or: [
          { eventTitle: { $regex: new RegExp(searchQuery, "i") } },
          { lecturerName: { $regex: new RegExp(searchQuery, "i") } }
        ]
      };
    }

    const appointments = await Appointment.find(condition);

    res.render('searchAppointment', { appointments });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// ------------------- Schedule Appointment -----------------------
// showing schedule appointment form
const { emptyInput, validateEventTitle, validateLecturerName } = require('../public/scripts/backendAppointment')

const timeslotsController = require('../controllers/timeslots.controller')
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

//Join Appointment
router.get('/Join', async (req, res) => {
  const appointmentId = req.query.appointmentId;
  const userId = req.session.userId;

  try {

     const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).send({ message: 'Appointment not found' });
    }

    if (user.appointments.includes(appointmentId)) {
      return res.status(400).send({ message: 'User already in the appointment' });
    }
    

    await User.findByIdAndUpdate(userId, { $push: { appointments: appointmentId } });
    await Appointment.findByIdAndUpdate(appointmentId, { $inc: { participantCount: 1 } });

    res.send({ message: 'Joined the appointment successfully' });
  } catch (error) {
    res.status(500).send({ message: 'Server error' });
  }

  
});



module.exports = router
