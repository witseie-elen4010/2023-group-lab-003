const User = require('../models/user.schema'); //user schema
const Timeslot = require('../models/timeslots.schema'); //timeslot schema

const createTimeslot = (req, res, next) => {

  //steps to follow: 
  // 1. Find logged in lecturers details
  // 2. Find all scheduled lecturers timeslots
  // 3. Check if date selected by user has already been selected
  // 3.1. If no; create timeslot
  // 3.2. If yes:
  // 3.2.1. Check if time range has been selected 
  // 3.2.1.1. If yes; display clash
  // 3.2.1.2. If no; cretae timeslot

  const userId = req.session.userId; //get user id from session
  
  User.findById(userId) //find logged in user
  .then( user=> {
    const data = {
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      numberOfStudents: req.body.numberOfStudents,
      date: req.body.date,
      userId: userId
    }
      // get all timeslots for current user
      user.timeslots.forEach(id=> {
        Timeslot.findById(id)
        .then( timeslots_ => {
          if(timeslots_) console.log(timeslots_.date)
          return timeslots_
        })
        // .then( )
      })
  
  })

    // Is modified
    // User.findOne({ $or: [{ userId: userId }] })
    //     .then(user => {
    //       console.log('user ', user)
    //         if (user) {

    //           const data = {
    //             startTime: req.body.startTime,
    //             endTime: req.body.endTime,
    //             numberOfStudents: req.body.numberOfStudents,
    //             date: req.body.date,
    //             userId: userId
    //           }

              // checkOverlap(user, data)
              // console.log('date ', data)
              // console.log('validate ', validateDate(data.date))

                // let timeslot = new Timeslot(data)
                // timeslot.save()
                //     .then(timeslot => { //associated logged in user with the appointment they schedule

                //         return User.findByIdAndUpdate(userId, { $push: { timeslots: timeslot } }, { new: true });

                //     }).then(user => {
                //         res.redirect('/timeslots');
                //         console.log('New timeslot added');

                //     })
                //     .catch(error => {

                //         console.log(error)
                //     })
        //     }

        // })
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