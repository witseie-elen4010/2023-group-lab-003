'use Strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const appointmentSchema = new Schema({
  eventTitle: {
    type: String
  }
})

const Appointment = mongoose.model('Appointment', appointmentSchema)

module.exports = Appointment
