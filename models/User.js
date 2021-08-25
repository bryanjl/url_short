const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please provide a username'],
        unique: [true, 'That username has already been taken']
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minLength: 6,
        select: false
    },
    links: {
        type: [mongoose.Schema.ObjectId],
        ref: 'Link'
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

UserSchema.pre('save', async function() {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.matchPassword = async function(enteredPassword) {
    console.log(`this password: ${this.password} entered ${enteredPassword}`);
    return await bcrypt.compare(enteredPassword, this.password);
}

UserSchema.methods.signJWT = function() {
    const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET);
    return token;
}

module.exports = mongoose.model('User', UserSchema);