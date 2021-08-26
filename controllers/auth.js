const User = require("../models/User");
const asyncHandler = require('../middleware/async');
const ErrorResponse = require("../utils/ErrorResponse");


exports.registerUser = asyncHandler(async (req, res, next) => {
    //create the doc in DB
    const user = await User.create(req.body);

    jwtResponse(user, 200, res); //send a jwt token back to client
});

exports.loginUser = asyncHandler(async (req, res, next) => {
    //find the user based on username -> get the password field included
    const user = await User.findOne({ username: req.body.username }).select('+password');

    if(!user) {
        return next(new ErrorResponse(`${req.body.username} cannot be found`));
    }

    //check if password matches
    const isMatch = await user.matchPassword(req.body.password);

    if(!isMatch) {
        return next(new ErrorResponse(`The password doesn't match`, 400));
    }

    jwtResponse(user, 200, res); //send a jwt token back to client
});

exports.getMe = asyncHandler(async (req, res, next) => {
    //check if user is logged in -> coming from authorizeUser
    if(!req.user){
        return next(`You are not signed in`);
    }

    const user = await User.findById(req.user);

    res
    .status(200)
    .json({
        success: true,
        data: user
    });
});

const jwtResponse = function(user, statusCode, res) {
    //get token
    const token = user.signJWT();

    res
        .status(statusCode)
        .json({
            success: true,
            token
        })
}