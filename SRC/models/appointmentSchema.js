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
  date: {
    type: String
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
  status: {
    type: String,
    enum: ['upcoming', 'cancelled', 'completed'],
    default: 'upcoming'
  }
,
  user: { //link the person who set an appointment
    type: mongoose.Types.ObjectId,
    ref: 'users'
  }

  
}, {timestamps: true})

const Appointment = mongoose.model('appointments', appointmentSchema)

module.exports = Appointment
