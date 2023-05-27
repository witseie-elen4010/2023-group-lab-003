'use strict';
const mongoose = require('mongoose');


const timeslotSchema = new mongoose.Schema ({

  Monday:{
    Time: { type: String },
    numberOfStudents: {type:Number},
    MaxNumberOfConsulation: {type:Number}
  },

  Tuesday:{
    Time: { type: String },
    numberOfStudents: {type:Number},
    MaxNumberOfConsulation: {type:Number}
  },

  Wednesday:{
    Time: { type: String },
    numberOfStudents: {type:Number},
    MaxNumberOfConsulation: {type:Number}
  },

  Thursday:{
    Time: { type: String },
    numberOfStudents: {type:Number},
    MaxNumberOfConsulation: {type:Number}
  },

  Friday:{
    Time: { type: String },
    numberOfStudents: {type:Number},
    MaxNumberOfConsulation: {type:Number}
  },


   // availabilityTime: {
   //     type: String,  
  //  },
  //  numberOfStudents: {
  //      type: String,  
  //  },
  //  date:{
  //      type: String,    
  //  },
  //  user: { //link the person who set an appointment
  //      type: mongoose.Types.ObjectId,
  //      ref: 'users'
  //    }
  
}, {timestamps: true});

const Timeslot = mongoose.model('timeslots', timeslotSchema)

module.exports = Timeslot;