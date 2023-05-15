'use strict';
const jwt = require('jsonwebtoken');
const User = require('../models/user.schema');

const authenticate = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decode = jwt.verify(token, 'verySecretValue')

        req.user = decode;
        next()
    }
    catch (error) {
        res.json({
            message: 'Authentication Failed'
        })
    }
};

const authLecture = (req, res, next) => {
    if (req.user.role === 'lecturer') {
        return true

        next()
    }
    else {
        res.redirect('/unauthenticated');
    }
}
const authStudent = (req, res, next) => {
    if (req.user.role === 'student') {
        return true;
        next()
    }
    else {
        res.redirect('/unauthenticated');
    }

}

module.exports = {
        authenticate, authLecture, authStudent
    } 