'use strict';

const mongoose = require('mongoose');


const userSchema = new mongoose.Schema ({
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
        required: [true, 'Please select a user role'],
    },
    email: {
        type: String,
        required: [true, 'Please enter your email address'],
        unique: true, //only one email is allowed for a user to sign up
        lowercase: true //make the email lower case before storing it in the database
    },
    password: {
        type: String,
        required: [true, 'Please enter your password'],
        minlength: [8, 'Password must be atleast 8 characters long'],
    },

}, {timestamps: true});

const User = mongoose.model('users', userSchema)

module.exports = User;