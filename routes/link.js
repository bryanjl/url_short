const express =  require('express');
const {
    shortenURL,
    redirectURL,
    toDocs
} = require('../controllers/link');

const {
    authorizeUser
} = require('../middleware/auth');

const router = express.Router();

router
    .route('/')
    .post(authorizeUser, shortenURL)
    .get(toDocs);

router
    .route('/:id')
    .get(redirectURL);

module.exports = router;


// .post(authorizeUser, shortenURL)