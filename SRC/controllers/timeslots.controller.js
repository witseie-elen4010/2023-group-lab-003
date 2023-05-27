const User = require('../models/user.schema'); //user schema
const Timeslot = require('../models/timeslots.schema'); //timeslot schema

const createTimeslot = (req, res, next) => {

    const userId = req.session.userId; //get user id from session

    User.findOne({ $or: [{ userId: userId }] })
        .then(user => {
            if (user) {

                let timeslot = new Timeslot({

                  Monday: {
                    Time:  `${req.body.MondayTimeBegin} - ${req.body.MondayTimeEnd}`,
                    numberOfStudents: req.body.numberOfStudentsMon,
                    MaxNumberOfConsulation: req.body.MondayMaxConsulation
                },

                Tuesday: {
                  Time:  `${req.body.TuesdayTimeBegin} - ${req.body.TuesdayTimeEnd}`,
                  numberOfStudents: req.body.numberOfStudentsTues,
                  MaxNumberOfConsulation: req.body.TuesdayMaxConsulation
                },

                Wednesday: {
                  Time:  `${req.body.WednesdayTimeBegin} - ${req.body.WednesdayTimeEnd}`,
                  numberOfStudents: req.body.numberOfStudentsWed,
                  MaxNumberOfConsulation: req.body.WednesdayMaxConsulation
                },

                Thursday: {
                  Time:  `${req.body.ThursdayTimeBegin} - ${req.body.ThursdayTimeEnd}`,
                  numberOfStudents: req.body.numberOfStudentsThurs,
                  MaxNumberOfConsulation: req.body.ThursdayMaxConsulation
                },
                Friday: {
                  Time:  `${req.body.FridayTimeBegin} - ${req.body.FridayTimeEnd}`,
                  numberOfStudents: req.body.numberOfStudentsFri,
                  MaxNumberOfConsulation: req.body.FridayMaxConsulation
                },

                   /* availabilityTime: req.body.availabilityTime,
                    numberOfStudents: req.body.numberOfStudents,
                    date: req.body.date,
                    userId: userId*/

                })
                timeslot.save()
                    .then(timeslot => { //associated logged in user with the appointment they schedule

                        return User.findByIdAndUpdate(userId, { $push: { timeslots: timeslot } }, { new: true });

                    }).then(user => {
                        res.redirect('/timeslots');
                        console.log('New timeslot added');

                    })
                    .catch(error => {

                        console.log(error)
                    })
            }

        })
}

const deleteTimeslot = (req, res) => {
    const timeslotId = req.params.id; //get appointment id from url
    const userId = req.session.userId; // Get user id from session
  
    // Find the user and appointment
    User.findById(userId)
      .populate('appointments')
      .exec()
      .then(user => {
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
  
        // Find the time slot to be deleted
        const timeslot = user.timeslots.find(appt => appt._id.toString() === timeslotId);
        if (!timeslot) {
          return res.status(404).json({ error: 'Time slot not found' });
        }
        // Remove the timeslot from the user's timeslots array
        user.timeslots.pull(timeslot._id);
        // Save the updated user object
        return user.save();
      })
      .then((user) => {
        if (user.role === 'student') {
          res.redirect('/studentDashboard');
        } else {
          res.redirect('/timeslots');
        }
  
      })
      .catch(error => {
        console.log(error);
        res.status(500).json({ error: 'Failed to delete timeslot' });
      });
};
  

module.exports = {
    createTimeslot,
    deleteTimeslot
}