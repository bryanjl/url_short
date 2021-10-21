const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
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
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpire: {
        type: Date
    }
});

UserSchema.pre('save', async function(next) {
    if(!this.isModified('password')){
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.matchPassword = async function(enteredPassword) {
    // console.log(`this password: ${this.password} entered ${enteredPassword}`);
    return await bcrypt.compare(enteredPassword, this.password);
}

UserSchema.methods.signJWT = function() {
    const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET);
    return token;
}

UserSchema.methods.checkJWT = function() {
    let payload = jwt.verify(token, process.env.JWT_SECRET);
    console.log(payload);
}

UserSchema.methods.getResetToken = function() {
    //generate token
    const resetToken = crypto.randomBytes(20).toString('hex');

    //hash token and set to resetPasswordToken field
    this.resetPasswordToken = crypto
        .createHash('sha256')   
        .update(resetToken)
        .digest('hex');

    //set expire
    this.resetPasswordExpire = Date.now() + 10 * 60* 1000;

    console.log(this.resetPasswordToken);

    return resetToken
}

module.exports = mongoose.model('User', UserSchema);