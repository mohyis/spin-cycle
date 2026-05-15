const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
     firstName: {
        type: String,
        required: true
    },
     lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    otp: {
        type: String,
        require: true
    },
    otpExpiresAt: {
        type: Date
    },
    isVerified: {
        type: Boolean,
        default: false
    }

}, {timestamps: true})

const userModel = mongoose.model('user', userSchema)

module.exports = userModel