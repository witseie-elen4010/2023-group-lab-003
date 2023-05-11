'use strict';

const mongoose = require('mongoose');
const schema = mangoose.Schema

const UserSchema = new schema ({
    name: {
        type: String,
        required: true,
    },
    surname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },

}, {timestamps: true});