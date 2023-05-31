'use script'

const User = require('../models/user.schema')
const Appointment = require('../models/appointmentSchema')
const logsController = require('../controllers/logs.controller');

const createAppointment = (req, res, next) => {
  const userId = req.session.userId; //get user id from session

  User.findById(userId )
    .then(user => {
      let consultationOrganizer = `${user.name} ${user.surname}`
      if (user) {
        const data = {
          organizer: consultationOrganizer,
          eventTitle: req.body.eventTitle,
          lecturerName: req.body.lecturerName,
          timeslot: req.body.timeslot,
          userId: userId
        }
        let appointment = new Appointment(data)
        let savedAppointment;
        appointment.save()

          .then(appointment => { //associated logged in user with the appointment they schedule
            savedAppointment = appointment
            return User.findByIdAndUpdate(userId, { $push: { appointments: appointment } }, { new: true });
          })
          .then(student => {
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
            action = 'New appointment created'
            logsController.createLog(userId, action)
            return lecturer.save();
          })
          .then(() => {
            req.flash('success', 'Appointment created successfully');
            res.redirect('/studentDashboard');
          })
          .catch(error => {
            req.flash('danger', 'failed to create appointment: ' + error.message);
            res.redirect('/scheduleAppointment');
          });

        
      }
    });
};

module.exports = {
  createAppointment
}