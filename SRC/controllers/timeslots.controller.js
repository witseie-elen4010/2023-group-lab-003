const User = require('../models/user.schema'); //user schema
const Timeslot = require('../models/timeslots.schema'); //timeslot schema

const createTimeslot = (req, res, next) => {

    const userId = req.session.userId; //get user id from session

    User.findOne({ $or: [{ userId: userId }] })
        .then(user => {
            if (user) {

                let timeslot = new Timeslot({

                    availabilityTime: req.body.availabilityTime,
                    numberOfStudents: req.body.numberOfStudents,
                    date: req.body.date,
                    userId: userId

                })
                timeslot.save()
                    .then(timeslot => { //associated logged in user with the appointment they schedule

                        return User.findByIdAndUpdate(userId, { $push: { timeslots: timeslot } }, { new: true });

                    }).then(user => {
                      req.flash('success', 'Timeslot was successfully created');
                      res.redirect('/createTimeslot');
                       

                    })
                    .catch(error => {

                      req.flash('danger', 'failed to create timeslot');
                      res.redirect('/createTimeslot');
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
        req.flash('success', 'Timeslot was successfully deleted');
                   
        res.redirect('/timeslots');
        
  
      })
      .catch(error => {
        req.flash('danger', 'Failed to delete timeslot');
                   
        res.redirect('/timeslots');
      });
};
  

module.exports = {
    createTimeslot,
    deleteTimeslot
}