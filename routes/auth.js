const express = require('express');

const {
    registerUser,
    loginUser,
    getMe
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

module.exports = router;