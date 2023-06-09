'use strict';
const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    surname: {
        type: String,
        required: true,
    },
    role: { //the user can be a student or a lecture
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true, //only one email is allowed for a user to sign up
        lowercase: true //make the email lower case before storing it in the database
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    appointments: [ //link appointments set by a user
        {
            type: mongoose.Types.ObjectId,
            ref: 'appointments'
        }
    ],
    timeslots: [ //link timeslot set by a user
        {
            type: mongoose.Types.ObjectId,
            ref: 'timeslots'
        }
    ]
    , logs:[
        {
            type: mongoose.Types.ObjectId,
            ref: 'logs'
        }
    ]

}, { timestamps: true });

const User = mongoose.model('users', userSchema)

module.exports = User;