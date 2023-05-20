'use script'

const User = require('../models/user.schema')
const Appointment = require('../models/appointmentSchema')

const createAppointment = (req, res, next) => {
  const userId = req.session.userId; //get user id from session

  User.findOne({ $or: [{ userId: userId }] })
    .then(user => {
      if (user) {
        let appointment = new Appointment({
          eventTitle: req.body.eventTitle,
          lecturerName: req.body.lecturerName,
          date: req.body.date,
          userId: userId
        })

        appointment.save()
        .then(appointment => { //associated logged in user with the appointment they schedule
          return User.findByIdAndUpdate(userId, { $push: { appointments: appointment } }, { new: true });
        })
        .then(user => {
          res.redirect('/studentDashboard');
          console.log('New appointment added');
        })
        .catch(error => {
          console.log(error)
        })
      }
    })
}

module.exports = {
  createAppointment
}