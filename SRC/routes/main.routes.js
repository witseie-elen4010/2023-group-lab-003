const express = require('express')
const Appointment = require('../models/appointmentSchema')
const Timeslot = require('../models/timeslots.schema')
const router = express.Router()
const User = require('../models/user.schema');
const session = require('express-session')
const authController = require('../controllers/auth.controller');
const flash = require('connect-flash');

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

  const passwordMessage = req.flash('danger');
  const emailMessage = req.flash('danger');
  res.render('Login', { passwordMessage, emailMessage });
});

//signin route, authentication done by authController
router.post('/signin', authController.login);



// ----------------- Update Appointment------------------------------
router.get('/update/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      req.flash('danger', 'Appointment not found'); //flash danger message
      res.redirect('/lecturerDashboard'); // redirect to sigin page

      //return res.status(404).send('Appointment not found');
    }

    res.render('update', { appointment: appointment });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

//----------------- Settings -------------------------------
router.get('/settings', (req, res) => {
  res.render('settings')
})

router.get('/goodbye', (req, res) => {
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


router.post('/updateAppointmentTimeslot', async (req, res) => {
  const userId = req.session.userId; 
  const appointmentId = req.body.appointment_id;
  
  const newTimeslotData = {
    startTime: req.body.startTime,
    endTime: req.body.endTime,
    numberOfStudents: req.body.numberOfStudents,
    date: req.body.date,
  }

  User.findOne({ userId: userId })
    .then(user => {
      if (user) {
        Appointment.findOne({ _id: appointmentId })
          .populate('timeslot') 
          .then(appointment => {
            if (appointment) {
              Timeslot.findByIdAndUpdate(
                appointment.timeslot._id,
                newTimeslotData,
                { new: true }, 
              )
                .then(updatedTimeslot => {
                  res.redirect('/timeslots');
                  console.log('Timeslot updated');
                })
                .catch(error => {
                  console.log(error);
                  res.status(500).send('Error updating timeslot');
                });
            } else {
              res.status(404).send('Appointment not found');
            }
          })
          .catch(error => {
            console.log(error);
            res.status(500).send('Error finding appointment');
          });
      } else {
        res.status(403).send('User not found');
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).send('Error finding user');
    });
});

//--------------------------------------------------------------------


//---------------------Availalbility----------------------------------
//specify availability time slots
router.get('/createTimeslot', (req, res) => {
  res.render('timeslot');
})

router.get('/searchAppointment', (req, res) => {
  const DangerMessage = req.flash('danger');
  const succesMessage = req.flash('success') 
  res.render('searchAppointment', { DangerMessage, succesMessage })
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

    const appointments = await Appointment.find(condition).populate('timeslot')
    if (appointments.length === 0) {
      req.flash('danger', 'No appointments found');
      return res.redirect('/searchAppointment');
    }

    const DangerMessage = req.flash('danger');
    const succesMessage = req.flash('success') 
    res.render('searchAppointment', { appointments, DangerMessage,succesMessage });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// ------------------- Schedule Appointment -----------------------
// showing schedule appointment form
const { emptyInput, validateEventTitle, validateLecturerName } = require('../public/scripts/backendAppointment')
const appointmentController = require('../controllers/appointment.controller')
const timeslotsController = require('../controllers/timeslots.controller')

router.get('/scheduleAppointment', (req, res) => {
  //fetch lecturer names and timeslots from the database
  //User.find({role:'lecture'},'name timeslots')
  //.populate('timeslots')
  //.then(lecturers =>{
  res.render('scheduleAppointment');
  //})

})
//get lectuers for selection 
router.get('/scheduleAppointment/lecturerDetails', (req, res) => {
  User.find({ role: 'lecture', })
    .populate('timeslots')
    .then(
      lecturers => {
        // console.log('registered lecturers ', lecturers)
        if (!lecturers) res.status(400).send({ message: 'No registered lecturers' })
        else res.status(200).send({ data: lecturers })
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
      Appointment.find({ _id: { $in: userAppointments } })
      .populate('timeslot')
      .then((appointments) => {
        const successMessage = req.flash('success'); //flash success message
        res.render('studentDashboard', { appointments, successMessage });
      })
    }
    else {
      req.flash('danger', 'Please sign in'); //flash success message
      res.redirect('/signin'); // redirect to sigin page

    }
  })
})

//display all timeslots made by the logged in lecture
router.get('/lecturerDashboard', (req, res) => {
  const userId = req.session.userId; //session user id
  User.findById(userId).populate('appointments').then(user => {
    if (user) {
      const userAppointments = user.appointments
      Appointment.find({ _id: { $in: userAppointments } })
      .populate('timeslot')
      .then((appointments) => {
        const successMessage = req.flash('success'); //flash success message
        
          res.render('lecturerDashboard', { appointments, successMessage })
      })
    }
    else {
      req.flash('danger', 'Please sign in'); //flash success message
      res.redirect('/signin'); // redirect to sigin page

    }
  });

});

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
      req.flash('danger', 'Please sign in'); //flash success message
      res.redirect('/signin'); // redirect to sigin page

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
      appointment.status = 'Cancelled'; //update the appointment status to

      // Save the updated appointment object
      return appointment.save();
    })
    .then(() => {
      return User.findById(userId)
    })
    .then((user) => {
      if (user.role === 'student') {
        
        res.redirect('/studentDashboard');
      } else {
        res.redirect('/lecturerDashboard');
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
      req.flash('danger', 'Please signin');
      return res.redirect('/signin')
    }

    const appointment = await Appointment.findById(appointmentId).populate('timeslot');
    if (!appointment) {
      req.flash('danger', 'Appointment not Found');
      return res.redirect('/searchAppointment')
    }

    if (user.appointments.includes(appointmentId)) {
      req.flash('danger', 'You are already part of the appointment');
      return res.redirect('/searchAppointment')
   }

   const timeslot = appointment.timeslot;

   
   const numberOfStudents = timeslot.numberOfStudents;


    console.log(numberOfStudents)
    
    await Appointment.findByIdAndUpdate(appointmentId, { $inc: { participantCount: 1 } }, { new: true }).populate('timeslot');

    const currentSeatNum = (numberOfStudents - appointment.participantCount)
    
    await User.findByIdAndUpdate(userId, { $push: { appointments: appointmentId } });

    await Appointment.findByIdAndUpdate(appointmentId, {NumberOfSeats : currentSeatNum }, { new: true }).populate('timeslot');
    
    req.flash('success', 'Appointment joined successfully');
    res.redirect('/searchAppointment');
  } catch (error) {
    res.status(500).send({ message: 'Server error' });
  }


});



//---------------------Add another lecturer----------------------------------

router.get('/includeAnotherLecturer', (req, res) => {
  res.render('includeAnotherLecturer');
});
router.post('/createAnotherLecturer', authController.createAnotherLecturer); // TODO
//specify another lectruer
router.get('/createAnotherLecturer', (req, res) => {
  //res.render('timeslot'); TODO
});


//Student Cancelled appoinments
router.get('/student-cancelled-appointments', (req, res) => {
  const userId = req.session.userId //session user id
  console.log(userId)
  User.findById(userId).populate('appointments').then(user => {
    if (user) {
      const userAppointments = user.appointments
      Appointment.find({ _id: { $in: userAppointments } })
      .populate('timeslot')
      .then((appointments) => {
        res.render('studentCancelledAppointments', { appointments })
      })
    }
    else {
      req.flash('danger', 'Please sign in'); //flash success message
      res.redirect('/signin'); // redirect to sigin page

    }
  })
});

//Lecturer Cancelled appoinments
router.get('/lecturer-cancelled-appointments', (req, res) => {
  const userId = req.session.userId //session user id
  User.findById(userId).populate('appointments').then(user => {
    if (user) {
      const userAppointments = user.appointments
      Appointment.find({ _id: { $in: userAppointments } })
      .populate('timeslot')
      .then((appointments) => {
        res.render('lecturerCancelledAppointments', { appointments })
      })
    }
    else {
      req.flash('danger', 'Please sign in'); //flash success message
      res.redirect('/signin'); // redirect to sigin page

    }
  });

});


module.exports = router
