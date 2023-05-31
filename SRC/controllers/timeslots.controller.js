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

    const timeslotsDates_ = []
    const timeslotsTimes_ = []
    user.timeslots.forEach(timeslot =>{
      timeslotsDates_.push(timeslot.date)
      const availabilityTime = {start: timeslot.startTime, end: timeslot.endTime}
      timeslotsTimes_.push(availabilityTime)
    })

    console.log('dates ', timeslotsDates_)
    console.log('times ', timeslotsTimes_)
    let eventTime = {start: data.startTime, end: data.endTime}
    let eventDate = data.date

    // Check overlap
    // check if date has been selected
    let overlap = isOverlap(timeslotsDates_, eventDate, timeslotsTimes_, eventTime)
    console.log('Event : ', eventDate, eventTime)
    console.log('overlap ', overlap)


    
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
    //   TimeOverlapping(timeArray)) console.log('time is overlapping. Cannot create appointment')
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

  const isOverlap = (timeslotsDates_, eventDate, timeslotsTimes_, eventTime) => {

    // check if date is overlapping. 
    // if date is overlapping, compare time ranges and check if they overlap
    // if yes lecturer cannot  create timeslot, 
    let overlapDate = dateOverlapIndeces (timeslotsDates_, eventDate)
    let bool = false
    if(overlapDate.length){
      console.log('Check time range is not overlapping')

      // check time overlap for each date
      overlapDate.forEach(dateIndex => {
        let timeslotTime = timeslotsTimes_[dateIndex]
        let timeArray = [timeslotTime, eventTime] 
        if(isTimeOverlapping(timeArray)){
          bool = true
          return bool
        }
      })
      return bool
    }
    else{
      return bool
    }
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

const dateOverlapIndeces = (timeslotsDates_, eventDate) => {
  const indexes = [];
  timeslotsDates_.forEach((element, index) => {
    if (element === eventDate) {
      indexes.push(index);
    }
  });
  return indexes
}


const isTimeOverlapping = (timeArray) => {   
  let i, j;
  for (i = 0; i < timeArray.length - 1; i++) {
      for (j = i + 1; j < timeArray.length; j++) {
        if (timeoverlapping(timeArray[i], timeArray[j])) {
           return true;
        }
     };
  };
  return false;
}

const timeoverlapping = (a, b) => {
  const getMinutes = s => {
    const p = s.split(':').map(Number);
    return p[0] * 60 + p[1];
  };
  return getMinutes(a.end) > getMinutes(b.start) && getMinutes(b.end) > getMinutes(a.start);
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