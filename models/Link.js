const mongoose = require('mongoose');
const randToken = require('rand-token');

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
    host_name: {
        type: [String]
    }
});

LinkSchema.pre('save', function() {
    //only create random token on first save
    if(this.isNew){
        this.short = randToken.generate(7);
    }    
})

module.exports = mongoose.model('Link', LinkSchema);

//need to make more dynamic function for adding https:// to beginning of redirect presave hook