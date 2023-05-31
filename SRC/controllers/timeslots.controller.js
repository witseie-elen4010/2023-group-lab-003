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
  // 3.2.1.2. If no; create timeslot

  const userId = req.session.userId; //get user id from session
  let createdTimeslot = 0
  // 1. Find logged in lecturers details
  User.findById(userId).populate("timeslots").exec()
  .then( user=> {
    const data = {
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      numberOfStudents: req.body.numberOfStudents,
      date: req.body.date,
      userId: userId
    }
    const dates_ = []
    const availabilityTimes_ = []
    user.timeslots.forEach(timeslot =>{
      dates_.push(timeslot.date)
      const availabilityTime = {start: timeslot.startTime, end: timeslot.endTime}
      availabilityTimes_.push(availabilityTime)
    })

    console.log('dates ', dates_)
    console.log('times ', availabilityTimes_)

    // Check overlap
    // check if date has been selected
    overlapDate = dateOverlapIndeces (dates_, data.date)
    if(overlapDate.length){
      console.log('Check time range is not overlapping')
    }
    else{
      console.log('Create availability timeslot')
    }


    
    // user.timeslots.forEach(id=> {
    //   Timeslot.findById(id)
    //   .then( timeslots_ => {
    //     if(timeslots_) {
    //       // Check overlap
    //       // check if date has been selected
    //       if(data.date === timeslots_.date){
    //         console.log('checking time range')
    //         let timeArray = [
    //           {start: timeslots_.startTime, end:timeslots_.endTime},
    //           {start: data.startTime, end: data.endTime}
    //         ]

    //         console.log('time array ', timeArray)
    //         if(isOverlappig(timeArray)) console.log('time is overlapping. Cannot create appointment')
    //         else console.log('create appointment')
    //       } 
    //       else {
    //         console.log('can create timeslot')
    //         if(createdTimeslot) console.log('Timeslot already created', createdTimeslot)
    //         else {
    //           console.log('create timeslot ', createdTimeslot + 1)
    //           createdTimeslot++
    //         }

    //       }
    //     }
    //   })
    // })
  })

  const dateOverlapIndeces = (dates_, eventDate) => {
    const indexes = [];
    dates_.forEach((element, index) => {
      if (element === eventDate) {
        indexes.push(index);
      }
    });
    return indexes
  }


  const isOverlappig = (timeArray) => {   
    let i, j;
    for (i = 0; i < timeArray.length - 1; i++) {
        for (j = i + 1; j < timeArray.length; j++) {
          if (overlapping(timeArray[i], timeArray[j])) {
             return true;
          }
       };
    };
    return false;
 }
 const overlapping = (a, b) => {
  const getMinutes = s => {
    const p = s.split(':').map(Number);
    return p[0] * 60 + p[1];
  };
  return getMinutes(a.end) > getMinutes(b.start) && getMinutes(b.end) > getMinutes(a.start);
 }

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