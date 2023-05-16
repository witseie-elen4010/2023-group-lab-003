const User = require('../models/user.schema');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {builtinModules} = require('module');
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
                        /*res.json({
                            message: 'Login Successful',
                            token
                        }
                       */

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

module.exports = {
    register,
    login
}