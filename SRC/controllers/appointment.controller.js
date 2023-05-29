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
          timeslot: req.body.timeslot,
          userId: userId
        })
        let savedAppointment;
        appointment.save()
        .then(appointment => { //associated logged in user with the appointment they schedule
          savedAppointment = appointment
          return User.findByIdAndUpdate(userId, { $push: { appointments: appointment } }, { new: true });
        })
        .then(student =>{
          const lecturerFullName = req.body.lecturerName.split(' ')
          const name = lecturerFullName.slice(0, -1).join(' ');
          const surname = lecturerFullName.slice(-1).join(' ');
          return User.findOne({ name: name, surname: surname, role: 'lecture' });
        })
        .then(lecturer => {
          if (!lecturer) {
            // Handle case when the specified lecturer is not found
            throw new Error('Lecturer not found');
          }
          // Associate the appointment with the lecturer
          lecturer.appointments.push(savedAppointment);
          return lecturer.save();
        })
        .then(() => {
          res.redirect('/studentDashboard');
        })
        .catch(error => {
          console.log(error)
          res.status(500).json({ message: 'Failed to create appointment' });
        });
      }
  });
};

module.exports = {
  createAppointment
}