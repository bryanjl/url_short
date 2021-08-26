const asyncHandler = require('../middleware/async');
const Link = require('../models/Link');
const User = require('../models/User');

exports.shortenURL = asyncHandler(async (req, res, next) => {
    
    const link = await Link.create(req.body);

    let user;

    console.log(req.user);
    if(req.user){
        user = await User.findById(req.user);
    }

    user.links.push(link._id);
    user.save();

    res.status(200).json({
        success: true,
        data: link
    })
});

exports.redirectURL = async(req, res, next) => {
    const redirectLink = await Link.findOne({ short: req.params.id });

    res.redirect(redirectLink.url);
}