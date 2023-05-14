const User = require('../models/user.schema');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {builtinModules} = require('module');

const register = (req, res, next) => {
    bcrypt.hash(req.body.password, 10, function (err, hashedPass) {
        if (err) {
            res.json({
                error: err
            })
        } let user = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPass

        })
        user.save()
            .then(user => {
                res.json({
                    message: 'User Added Successfully'
                })
                console.log('New user added')
                
            })
            .catch(error => {
                res.json({
                    message: 'An error occured'
                })
                console.log(error)
            })
    })


}