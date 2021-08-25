const Link = require('../models/Link');

exports.shortenURL = async(req, res, next) => {
    const link = await Link.create(req.body);

    res.status(200).json({
        success: true,
        data: link
    })
}

exports.redirectURL = async(req, res, next) => {
    const redirectLink = await Link.findOne({ short: req.params.id });

    res.redirect(redirectLink.url);
}