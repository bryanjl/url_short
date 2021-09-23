const express =  require('express');
const {
    shortenURL,
    redirectURL,
    toDocs,
    getLinkInfo
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

router
    .route('/link/:id')
    .get(getLinkInfo)

module.exports = router;


// .post(authorizeUser, shortenURL)