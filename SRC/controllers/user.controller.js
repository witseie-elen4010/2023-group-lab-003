'use strict';
const User = require('../models/user.schema');
const bodyParser = require('body-parser');

//register a new user
const register = (req, res, next) => {
    // Hash the password using a secure algorithm like bcrypt
    const hashedPass = bcrypt.hashSync(req.body.password, 10);

    let user = new User({
        name: req.body.name,
        surname: req.body.surname,
        role: req.body.role,
        email: req.body.email,
        password: hashedPass
    });

    user.save().then(() => {
        res.redirect('/signin'); //redirect to the login page so the person can login    }).catch(error => {
    }).catch(error => {
        console.error(error);
    })
};

//update user information

const updateUserInfo = (req, res, next) => {
    let userId = req.body.employeeId;

    let UpdatedUserInfo = {
        name: req.body.name,
        email: req.body.email,
        password: hashedPass
    }

    User.findByIdAndUpdate(userId, { $set: UpdatedUserInfo })
        .then(() => {
            res.json({
                message: 'User information successfully updated '
            })
        }).catch(error => {
            res.json({
                message: 'An error occured'
            })
        })
}




const login = (req, res, next) => {
    var email = req.body.email;
    var password = req.body.password;
    User.findOne({ $or: [{ email: email }, { phone: username }] })
        .then(user => {
            if (user) {
                bycrypt.compare(password, user.password, function (err, result) {
                    if (err) {
                        res.json({
                            error: err
                        })

                    }
                    if (results) {
                        let token = jwt.sign({ name: user.name }, 'verySecretValue', { expireIn: '1h' })
                        res.json({
                            message: 'Login Successful',
                            token
                        }
                        )

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
    updateUserInfo, register, login
}