const mongoose = require('mongoose');
const randToken = require('rand-token');

const LinkSchema = new mongoose.Schema({
    url: {
        type: String,
        required: [true, 'Please add a URL to Shorten']
    },
    short: {
        type: String
    }
});

LinkSchema.pre('save', function() {
    this.short = randToken.generate(7);
})

module.exports = mongoose.model('Link', LinkSchema);