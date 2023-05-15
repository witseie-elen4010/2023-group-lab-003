const express = require('express');
const router = express.Router();
const user = require('../models/user.schema');
const authController = require('../controllers/auth.controller');
const { authenticate, authStudent, authLecture } = require('../middleware/authenticate.routes');


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

router.get('/dummyDashboard', (req, res) => {
    res.render('dummyDashboard');
});
router.get('/dummystudentdashboard', (req, res) => {
    res.render('dummystudentdashboard');
})
router.post('/signin', authController.login);

module.exports = router;