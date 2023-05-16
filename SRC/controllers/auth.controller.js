const User = require('../models/user.schema'); //user schema
const Appointment = require('../models/appointmentSchema'); //appointment schema
const Timeslot = require('../models/lectureTimeslots.schema'); //timeslot schema
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {builtinModules} = require('module');
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
                        let token = jwt.sign({ email: user.email }, 'verySecretValue')
                        
                        if (user.role === 'lecture') {
                            res.redirect('/lecturerDashboard');
                            token
                        }
                        else if (user.role === 'student') {
                            res.redirect('/studentDashboard');
                            token
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
   
    const userId = req.session.userId ; //get user id from session
     
    User.findOne({ $or: [{ userId: userId }] })
        .then(user => {
            if (user) {

                let timeslot = new Timeslot({

                    eventTitle: req.body.eventTitle,
                    lecturerName: req.body.lecturerName,
                    date: req.body.date,
                    userId: userId
                    
                })
                timeslot.save()
                    .then(timeslot => { //associated logged in user with the appointment they schedule
                        
                        return User.findByIdAndUpdate(userId, { $push: { timeslot: timeslot} }, { new: true });
                       
                    }).then(user => {
                        res.redirect('/studentDashboard');
                        console.log('New appointment added');

                    })
                    .catch(error => {

                        console.log(error)
                    })
            }

        })
    }

    const createTimeslot = (req, res, next) => {
   
        const userId = req.session.userId ; //get user id from session
         
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
                            
                            return User.findByIdAndUpdate(userId, { $push: { timeslots: timeslot} }, { new: true });
                           
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
    login
}