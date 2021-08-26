const express =  require('express');
const {
    shortenURL,
    redirectURL
} = require('../controllers/link');

const {
    authorizeUser
} = require('../middleware/auth');

const router = express.Router();

router
    .route('/')
    .post(authorizeUser, shortenURL);

router
    .route('/:id')
    .get(redirectURL);

module.exports = router;