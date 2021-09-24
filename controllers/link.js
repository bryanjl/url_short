const asyncHandler = require('../middleware/async');
const Link = require('../models/Link');
const User = require('../models/User');
const geoLookup = require('../middleware/geoLookup');

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

    //get host name (nwhere the client came from)
    let host = req.headers.referer;
    link.host_name.push(host);
    // console.log(host);
    
    //Add 1 to visits for analytics
    link.visits++;

    //get location -> geoLookup returns country code string
    link.country_code.push(geoLookup(req.headers['x-forwarded-for']));

    // console.log(req);

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