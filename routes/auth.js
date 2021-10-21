const express = require('express');

const {
    registerUser,
    loginUser,
    getMe,
    forgotPassword,
    resetPassword
} = require('../controllers/auth');

const {
    authorizeUser
} = require('../middleware/auth');

const router = express.Router();

router  
    .route('/register')
    .post(registerUser);

router
    .route('/login')
    .post(loginUser);

router
    .route('/getme')
    .get(authorizeUser, getMe);

router
    .route('/forgotpassword')
    .post(forgotPassword);

router
    .route('/resetpassword/:resettoken')
    .put(resetPassword);

module.exports = router;