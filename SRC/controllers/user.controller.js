'use strict';
const User = require('../models/user.schema');

//register a new user
const register = (req, res, next)=>{
    let user = new User({
        name: req.body.name,
        email:req.body.email,
        password:hashedPass
    })
    User.save().then(user=>{
        res.json({message: 'User Added successfully'})
    }).catch(error=>{
        res.json({message: 'An error occured'})
    })
}

//update user information

const updateUserInfo = (req, res, next)=>{
    let userId = req.body.employeeId;
    
    let UpdatedUserInfo = {
        name: req.body.name,
        email: req.body.email,
        password: hashedPass
    }

    User.findByIdAndUpdate(userId, {$set:UpdatedUserInfo})
    .then(()=>{
        res.json({
            message: 'User information successfully updated '
        })
    }).catch(error=>{
        res.json({
            message:'An error occured'
        })
    })
}




const login = (req, res, next) => {
    var username = req.body.username;
    var password = req.body.password;
    User.findOne({ $or: [{ email: username }, { phone: username }] })
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

module.exports ={
    updateUserInfo, register, login
}