const User = require('../models/user.schema'); //user schema
const Appointment = require('../models/appointmentSchema'); //appointment schema
const Timeslot = require('../models/timeslots.schema'); //timeslot schema
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { builtinModules } = require('module');
const session = require('express-session');
const { authLecture, authenticate } = require('../middleware/authenticate.routes');

const register = (req, res, next) => {
    bcrypt.hash(req.body.password, 10, function (err, hashedPass) {
        if (err) {
            res.json({
                error: err
            })
        } let user = new User({
            name: req.body.name,
            surname: req.body.surname,
            role: req.body.role,
            email: req.body.email,
            password: hashedPass

        })
        user.save()
            .then(user => {

                res.redirect('/signin');
                console.log('New user added')

            })
            .catch(error => {

                console.log(error)
            })
    })


}

const login = (req, res, next) => {
    var email = req.body.email;
    var password = req.body.password;
    User.findOne({ $or: [{ email: email }] })
        .then(user => {
            if (user) {
                bcrypt.compare(password, user.password, function (err, results) {
                    if (err) {
                        res.json({
                            error: err
                        })

                    }
                    if (results) {
                        req.session.userId = user._id; //user session id
                        let token = jwt.sign({ email: user.email }, 'verySecretValue')
                        const userId = user._id; 
                        if (user.role === 'lecture') {
                            res.redirect('/lecturerDashboard');
                            //token
                            userId;
                        }
                        else if (user.role === 'student') {
                            res.redirect('/studentDashboard');
                            //token
                            userId;
                        }
                        

                    }
                    else {
                        res.json({
                            message: 'Password does not match!'
                        })
                    }

                })
            }
            else {
                res.json({
                    message: 'No user found!'
                })
            }
        })
}
const createAppointment = (req, res, next) => {

    const userId = req.session.userId; //get user id from session

    User.findOne({ $or: [{ userId: userId }] })
        .then(user => {
            if (user) {

                let appointment = new Appointment({

                    eventTitle: req.body.eventTitle,
                    lecturerName: req.body.lecturerName,
                    date: req.body.date,
                    userId: userId

                })
                let savedAppointment;
                appointment.save()
                    .then(appointment => { //associated logged in user with the appointment they schedule
                        savedAppointment = appointment;
                        return User.findByIdAndUpdate(userId, { $push: { appointments: appointment } }, { new: true });

                    }).then(student =>{
                        return User.findOne({ name: req.body.lecturerName, role: 'lecture' });
                    }).then(lecturer => {
                        if (!lecturer) {
                          // Handle case when the specified lecturer is not found
                          throw new Error('Lecturer not found');
                        }
            
                        // Associate the appointment with the lecturer
                        lecturer.appointments.push(savedAppointment);
                        return lecturer.save();
                      })
                    .then(() => {
                        res.redirect('/studentDashboard');
                        //console.log('New appointment added');

                    })
                    .catch(error => {

                        console.log(error)
                        res.status(500).json({ error: 'Failed to create appointment' });
                    });
            }

        });


};

const createTimeslot = (req, res, next) => {

    const userId = req.session.userId; //get user id from session

    User.findOne({ $or: [{ userId: userId }] })
        .then(user => {
            if (user) {

                let timeslot = new Timeslot({

                    availabilityTime: req.body.availabilityTime,
                    numberOfStudents: req.body.numberOfStudents,
                    date: req.body.date,
                    userId: userId

                })
                timeslot.save()
                    .then(timeslot => { //associated logged in user with the appointment they schedule

                        return User.findByIdAndUpdate(userId, { $push: { timeslots: timeslot } }, { new: true });

                    }).then(user => {
                        res.redirect('/lecturerDashboard');
                        console.log('New timeslot added');

                    })
                    .catch(error => {

                        console.log(error)
                    })
            }

        })
}






module.exports = {
    register,
    login,
    createAppointment,
    createTimeslot,
}