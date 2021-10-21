const crypto = require('crypto');
const User = require("../models/User");
const asyncHandler = require('../middleware/async');
const ErrorResponse = require("../utils/ErrorResponse");
const sendEmail = require('../utils/sendEmail');


exports.registerUser = asyncHandler(async (req, res, next) => {
    //create the doc in DB
    const user = await User.create(req.body);

    jwtResponse(user, 200, res); //send a jwt token back to client
});

exports.loginUser = asyncHandler(async (req, res, next) => {
    if(!req.body.username || !req.body.password) return next(new ErrorResponse(`Please enter email and password`, 400));

    //find the user based on username -> get the password field included
    const user = await User.findOne({ username: req.body.username }).select('+password');

    if(!user) {
        return next(new ErrorResponse(`${req.body.username} cannot be found`, 404));
    }

    //check if password matches
    const isMatch = await user.matchPassword(req.body.password);

    if(!isMatch) {
        return next(new ErrorResponse(`The password doesn't match`, 400));
    }

    jwtResponse(user, 200, res); //send a jwt token back to client
});

exports.getMe = asyncHandler(async (req, res, next) => {
    // console.log(req.protocol, req.get(('host')));
    //check if user is logged in -> coming from authorizeUser
    if(!req.user){
        return next(`You are not signed in`);
    }

    const user = await User.findOne({ _id: req.user }).populate({ 
        path: 'links', 
        select: 'url title' 
    });
    
    res
    .status(200)
    .json({
        success: true,
        data: user
    });
});

exports.forgotPassword = asyncHandler(async (req,  res, next) => {
    //check if user exists
    let user  = await User.findOne({ username: req.body.email });

    if(!user){
        return next(new ErrorResponse(`User with email ${req.body.email} does not exist`, 404)); 
    }

    let resetToken = user.getResetToken(); //need to make method

    await user.save({ validationBeforeSave: false });

    const url =  `${req.protocol}://${req.get('host')}/auth/resetpassword/${resetToken}`
    //send email to supplied email address
    let emailOptions = {
        email: req.body.email,
        subject: 'Reset Password',
        message: `You are recieving this email because someone has requested to reset your password for the URL Shortening Chrome extension. Please visit ${url}`
    };

    try {
        await sendEmail(emailOptions);

        res.status(200).json({
            success: true,
            data: "email sent"
        });
    } catch (error) {
        console.log(error);

        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new ErrorResponse(`Email could not be sent`, 500));
    }
});

exports.resetPassword = asyncHandler(async (req, res, next) => {
    console.log(req.params.resettoken);
    let resetPasswordToken = crypto
                                .createHash('sha256')
                                .update(req.params.resettoken)
                                .digest('hex');

    let user = await User.findOne({ 
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() } 
    });

    console.log(resetPasswordToken, user);



    if(!user){
        return next(new ErrorResponse(`Invalid token`, 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    jwtResponse(user, 200, res);
});

const jwtResponse = function(user, statusCode, res) {
    //get token
    const token = user.signJWT();

    res
        .status(statusCode)
        .json({
            success: true,
            username: user.username,
            token
        })
}