const asyncHandler = require('../middleware/async');
const Link = require('../models/Link');
const User = require('../models/User');

exports.shortenURL = asyncHandler(async (req, res, next) => {
    
    console.log(req.headers.authorization);


    const link = await Link.create(req.body);

    let user;

    console.log(req.user);
    if(req.user){
        user = await User.findById(req.user);
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
    
    //Add 1 to visits for analytics
    link.visits++;

    //get location 
    console.log(req.socket.remoteAddress);
    link.address.push(req.socket.remoteAddress);

    const redirectUrl = link.url;
    res.redirect(redirectUrl);

    //save
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