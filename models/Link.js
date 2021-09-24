const mongoose = require('mongoose');
const randToken = require('rand-token');
const refererHost = require('../middleware/refererHost');
const geoLookup = require('../middleware/geoLookup');

const LinkSchema = new mongoose.Schema({
    url: {
        type: String,
        required: [true, 'Please add a URL to Shorten']
    },
    short: {
        type: String
    },
    visits: {
        type: Number,
        default: 0
    },
    country_code: {
        type: [String]
    },
    referer: {
        facebook: {
            type: Number,
            default: 0
        },
        twitter: {
            type: Number,
            default: 0
        },
        other: {
            type: Number,
            default: 0
        }
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    },
    accessedAt: {
        type: [Date]
    }
});

LinkSchema.pre('save', function() {
    //only create random token on first save
    if(this.isNew){
        this.short = randToken.generate(7);
    }    
});

LinkSchema.methods.refererCount = function(reqHeaderReferer) {
    if(!reqHeaderReferer){
        this.referer.other++;
    } else {
        let refHost = refererHost(reqHeaderReferer);
        this.referer[refHost]++;
    }
}

LinkSchema.methods.getLocation = function(reqHeaderXForward) {
    if(reqHeaderXForward) {
        this.country_code.push(geoLookup(reqHeaderXForward));
    }
}

module.exports = mongoose.model('Link', LinkSchema);

//need to make more dynamic function for adding https:// to beginning of redirect presave hook