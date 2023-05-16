'use Strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const appointmentSchema = new Schema({
  eventTitle: {
    type: String
  },

  startTime:{
    type : String
    },
   
    endTime:{
      type : String
    }
})

const Appointment = mongoose.model('Appointment', appointmentSchema)

module.exports = Appointment
