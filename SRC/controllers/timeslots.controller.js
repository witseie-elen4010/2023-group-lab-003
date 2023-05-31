const User = require('../models/user.schema'); //user schema
const Timeslot = require('../models/timeslots.schema'); //timeslot schema

const createTimeslot = (req, res, next) => {

  const userId = req.session.userId; //get user id from session
  User.findById(userId).populate("timeslots").exec()
  .then( user=> {
    const data = {
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      numberOfStudents: req.body.numberOfStudents,
      date: req.body.date,
      userId: userId
    }

    let timeslotsDates_ = []
    let timeslotsTimes_ = []
    user.timeslots.forEach(timeslot =>{
      timeslotsDates_.push(timeslot.date)
      const availabilityTime = {start: timeslot.startTime, end: timeslot.endTime}
      timeslotsTimes_.push(availabilityTime)
    })

    let eventTime = {start: data.startTime, end: data.endTime}
    let eventDate = data.date

    // Check if timeslots overlap
    let overlap = isOverlap(timeslotsDates_, eventDate, timeslotsTimes_, eventTime)

    if(overlap) {
      res.status(500).json({ error: 'timeslot overlaps.' });
    }
    else {
      let timeslot = new Timeslot(data)
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

const isOverlap = (timeslotsDates_, eventDate, timeslotsTimes_, eventTime) => { 
  let overlapDate = dateOverlapIndeces (timeslotsDates_, eventDate)
  let bool = false
  if(overlapDate.length){

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