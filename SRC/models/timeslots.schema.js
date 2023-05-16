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
  
}, {timestamps: true});

const User = mongoose.model('timeslots', timeslots)

module.exports = User;