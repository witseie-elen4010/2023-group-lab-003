'use strict';
const mongoose = require('mongoose');


const timeslots = new mongoose.Schema ({
    timeslot: {
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

const User = mongoose.model('timeslots', timeslots)

module.exports = User;