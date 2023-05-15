'use Strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const appointmentSchema = new Schema({
  eventTitle: {
    type: String,
    required: true
  },
  lecturerName: {
    type: String,
    required: true
  }
}, {timestamps: true})

const Appointment = mongoose.model('Appointment', appointmentSchema)

module.exports = Appointment
