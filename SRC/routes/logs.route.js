const express = require('express')
const Appointment = require('../models/appointmentSchema')
const Timeslot = require('../models/timeslots.schema')
const router = express.Router()
const User = require('../models/user.schema');
const session = require('express-session')
const authController = require('../controllers/auth.controller');
const flash = require('connect-flash');
const Logs = require('../models/logs.schema');

router.get('/logs', (req, res) => {
    const userId = req.session.userId; //session user id
    User.findById(userId).populate('logs').then(user => {
       
      if (user) {
        const userLogs = user.logs
        Logs.find({ _id: { $in: userLogs } }).then((logs) => {
          const successMessage = req.flash('success'); //flash success message
          res.render('logs', { logs, successMessage })
        })
      }
      else {
        req.flash('danger', 'Please sign in'); //flash success message
        res.redirect('/signin'); // redirect to sigin page
  
      }
    })
  
  })

  module.exports = router
  