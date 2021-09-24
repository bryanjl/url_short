const asyncHandler = require('../middleware/async');
const Link = require('../models/Link');
const User = require('../models/User');
// const geoLookup = require('../middleware/geoLookup');
// const refererHost = require('../middleware/refererHost');

exports.shortenURL = asyncHandler(async (req, res, next) => {

    const link = await Link.create(req.body);

    // let user;

    if(req.user){
        let user = await User.findById(req.user);
        user.links.push(link._id);
        user.save();
    }

    res.status(200).json({
        success: true,
        data: link
    })
});

exports.redirectURL = asyncHandler(async(req, res, next) => {

    const link = await Link.findOne({ short: req.params.id });

    //add to frequency count of referer host
    link.refererCount(req.headers.referer);
        
    //Add 1 to visits
    link.visits++;

    //get location 
    link.getLocation(req.headers['x-forwarded-for']);
    
    // Accessed date
    link.accessedAt.push(Date.now());

    //redirect
    const redirectUrl = link.url;
    res.redirect(redirectUrl);

    //save changes after redirect 
    link.save();
});

exports.toDocs = (req, res, next) => {
    res.redirect('https://documenter.getpostman.com/view/11007762/U16qJiEy');
}

exports.getLinkInfo = asyncHandler(async(req, res, next) => {
    const link = await Link.findOne({ short: req.params.id });

    res.status(200).json({
        success: true,
        data: link
    })
});