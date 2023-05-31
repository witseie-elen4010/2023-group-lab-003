const User = require('../models/user.schema'); //user schema
const Appointment = require('../models/appointmentSchema'); //appointment schema
const Timeslot = require('../models/timeslots.schema'); //timeslot schema
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { builtinModules } = require('module');
const session = require('express-session');
const { authLecture, authenticate } = require('../middleware/authenticate.routes');
const logsController = require('../controllers/logs.controller');

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
                        action = 'Sign in'
                        logsController.createLog(userId, action)
                        if (user.role === 'lecture') {
                            req.flash('success', 'Login successful');
                            res.redirect('/lecturerDashboard');
                            userId;
                        }
                        else if (user.role === 'student') {
                            req.flash('success', 'Login successful');
                            res.redirect('/studentDashboard');
                            userId;
                        }


                    }
                    else {
                        req.flash('danger', "Password does not match!");
                        res.redirect('/signin');

                    }

                })
            }
            else {
                req.flash('danger', "No user with this email!");
                res.redirect('/signin');


            }
        })
}

// ------------------------------Settings-------------------------------------------------------------------------------------
const updateEmail = async (req, res) => {
    var userId = req.session.userId; // retrieve user id from session
    var email = req.body.email;

    if (email) {
        try {
            // Updating the user's email in the database
            const updatedUser = await User.findOneAndUpdate({ _id: userId }, { email: email }, { new: true });

            if (!updatedUser) {
                console.log('No user found with this id');
                res.status(404).send('No user found with this id');
            } else {
                action = 'Updated email'
                logsController.createLog(userId, action)
                
                req.flash('success', "Email updated successfully");
                res.redirect('/signin');
            }
        } catch (err) {
            console.log('Error: ', err);
            res.status(404).send('Database error');
        }
    } else {
        req.flash('danger', "Email not provided");
                res.redirect('/signin'); // 
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

    if (newPassword !== confirmPassword) {
        return res.status(404).json({ message: 'Passwords do not match' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();
    action = 'Update password'
    logsController.createLog(userId, action)

    res.status(200).json({ message: 'Password updated successfully' });
}


const createAnotherLecturer = (req, res, next) => {
    const userId = req.session.userId; //get user id from session
    res.redirect('/lecturerDashboard');
}


const deleteAccount = async (req, res) => {
    const userId = req.session.userId;

    await User.findOneAndRemove({ _id: userId });
    action = 'Delete account'
                        logsController.createLog(userId, action)
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
    createAnotherLecturer,
    updateEmail,
    updatePassword,
    deleteAccount,

}