const express =  require('express');
const {
    shortenURL,
    redirectURL
} = require('../controllers/link');

const router = express.Router();

router
    .route('/')
    .post(shortenURL);

router
    .route('/:id')
    .get(redirectURL);

module.exports = router;