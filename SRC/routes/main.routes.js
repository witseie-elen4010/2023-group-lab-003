const express = require('express');
const router = express.Router();
const user = require('../models/user.schema');
const authController = require('../controllers/auth.controller');


errorHandler = (err) => {
    console.error(err.message, err.code);
};

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/signup', (req, res) => {
    res.render('signup');
});

router.post('/signup',authController.register);


router.get('/signin', (req, res) => {
    res.render('Login');
});


router.post('/signin', async (req, res) => { //asynchronous function
    const { email, password } = req.body; // get email and password from user
    try {
        const User = await user.create({ email, password });
    }
    catch (err) {
        

    }
});


module.exports = router;