const express = require('express')
const Appointment = require('../models/appointmentSchema')
const Timeslot = require('../models/timeslots.schema')
const router = express.Router()
const User = require('../models/user.schema');
const Logs = require('../models/logs.schema');
const session = require('express-session')
const authController = require('../controllers/auth.controller');
const flash = require('connect-flash');

