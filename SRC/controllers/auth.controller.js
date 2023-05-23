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
                        res.redirect('/timeslots');
                        console.log('New timeslot added');

                    })
                    .catch(error => {

                        console.log(error)
                    })
            }

        })
}



// ------------------------------Settings-------------------------------------------------------------------------------------
const updateEmail = async (req, res) => {
    var userId = req.session.userId; // retrieve user id from session
    var email = req.body.email;

    if(email) {
        try {
            // Updating the user's email in the database
            const updatedUser = await User.findOneAndUpdate({ _id: userId }, { email: email }, { new: true });

            if (!updatedUser) {
                console.log('No user found with this id');
                res.status(404).send('No user found with this id');
            } else {
                console.log('Updated User: ', updatedUser);
                res.send('Updated email: ' + updatedUser.email);
            }
        } catch (err) {
            console.log('Error: ', err);
            res.status(404).send('Database error');
        }
    } else {
        console.log('Email not provided');
        res.send('Email not provided');
    }
};

const updatePassword = async (req, res, next) => {
    const userId = req.session.userId;
    const currentPassword = req.body.currentPassword;
    const newPassword = req.body.newPassword;
    const confirmPassword = req.body.confirmPassword;

    const user = await User.findOne({ _id: userId });

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    
    if (!isMatch) {
        return res.status(404).json({ message: 'Incorrect current password' });
    }

    if(newPassword !== confirmPassword) {
        return res.status(404).json({ message: 'Passwords do not match' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();
    
    res.status(200).json({ message: 'Password updated successfully' });
}


const deleteAccount = async (req, res) => {
    const userId = req.session.userId;
    
      await User.findOneAndRemove({ _id: userId });  
      req.session.destroy((err) => {
        if (err) {
          res.status(404).send('An error occurred while deleting the session');
        } else {
          res.redirect('/goodbye');
        }
      });
  };
  

module.exports = {
    register,
    login,
    createAppointment,
    createTimeslot,
    updateEmail,
    updatePassword,
    deleteAccount,
}