'use Strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const appointmentSchema = new Schema({
  eventTitle: {
    type: String
  }, 
  lecturerName: {
    type: String
  },
  timeslot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'timeslots'
  },
  startTime:{
    type : String
  },
  endTime:{
    type : String
  },

  participantCount: {
    type: Number,
    default: 1
  },

  NumberOfSeats: {
    type:Number,
   },

  status: {
    type: String,
    enum: ['Upcoming', 'Cancelled', 'Completed'],
    default: 'Upcoming'
  }
,
  user: { //link the person who set an appointment
    type: mongoose.Types.ObjectId,
    ref: 'users'
  }

  
}, {timestamps: true})

const Appointment = mongoose.model('appointments', appointmentSchema)

module.exports = Appointment
