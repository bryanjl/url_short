const asyncHandler = require('../middleware/async');
const jwt = require('jsonwebtoken');

exports.authorizeUser = asyncHandler(async (req, res, next) => {
    let token;

    //check if bearer token and get token
    if(req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    }
    
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    
    //set user property to the req object
    req.user = payload.id;

    next();
});