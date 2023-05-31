'use strict';
const mongoose = require('mongoose');


const timeslotSchema = new mongoose.Schema ({
    startTime: {
        type: String,
    },
    endTime: {
        type: String,
    },
    numberOfStudents: {
        type: String,
        
    },
    date:{
        type: String,
        
    },
    user: { //link the person who set an appointment
        type: mongoose.Types.ObjectId,
        ref: 'users'
      }
  
}, {timestamps: true});

const Timeslot = mongoose.model('timeslots', timeslotSchema)

module.exports = Timeslot;