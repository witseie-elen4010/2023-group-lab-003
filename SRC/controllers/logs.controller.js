const express = require('express')
const Appointment = require('../models/appointmentSchema')
const Timeslot = require('../models/timeslots.schema')
const router = express.Router()
const User = require('../models/user.schema');
const Logs = require('../models/logs.schema');
const session = require('express-session')
const authController = require('../controllers/auth.controller');

const createLog = {
    createLog: (userId, action) => {
        User.findOne({ $or: [{ userId: userId }] })
            .then(user => {
                if (user) {
                    const logs = new Logs({
                        userId: userId,
                        action: action,
                        timestamp: new Date()
                    })
                    let saveLog;
                    logs.save()
                        .then(log => {
                            saveLog = log;
                            return User.findByIdAndUpdate(userId, { $push: { logs: log } }, { new: true });
                        })
                    console.log('log created')

                }
            });
    }
};

module.exports = createLog

