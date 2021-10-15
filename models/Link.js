const mongoose = require('mongoose');
const randToken = require('rand-token');
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
        type: Object
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
    },
    visitsPerDay: {
        type: Object
    },
    title: {
        type: String
    }
});

LinkSchema.pre('save', function() {
    //only create random token on first save
    if(this.isNew){
        this.short = randToken.generate(7);
        
        //set initial object for visitsPerDay
        let initialDate = new Date();
        initialDate = initialDate.toISOString().split('T')[0];
        this.visitsPerDay = {
            [initialDate]: 1
        }
        
        this.referer = {
            other: 0
        };
    }    
});

LinkSchema.methods.refererCount = function(reqHeaderReferer) {
    if(!reqHeaderReferer){
        this.referer.other++;
    } else {
        // let refHost = refererHost(reqHeaderReferer);
        if(this.referer[reqHeaderReferer]){
            this.referer[reqHeaderReferer]++;
        } else {
            this.referer[reqHeaderReferer] = 1;
        }
        
    }
}

LinkSchema.methods.getLocation = function(reqHeaderXForward) {
    if(reqHeaderXForward) {
        this.country_code.push(geoLookup(reqHeaderXForward));
    }
}

LinkSchema.methods.visitsPerDayObj = function() {
    //format date
    const currDate = new Date();
    let yyyyMMdd = currDate.toISOString().split('T')[0];

    //update object for formatted date yyyy-mm-dd
    if(!this.visitsPerDay[yyyyMMdd]){
        this.visitsPerDay[yyyyMMdd] = 1;
    } else {
        this.visitsPerDay[yyyyMMdd]++;
    }
}

module.exports = mongoose.model('Link', LinkSchema);

//need to make more dynamic function for adding https:// to beginning of redirect presave hook