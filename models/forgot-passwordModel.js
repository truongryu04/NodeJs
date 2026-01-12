const mongoose = require("mongoose")
const slug = require('mongoose-slug-updater')
mongoose.plugin(slug)
const generate = require("../helpers/generate")

const forgotPasswordSchema = new mongoose.Schema({
    email: String,
    otp: String,
    expireAt: {
        type: Date,
        default: () => new Date(Date.now() + 3 * 60 * 1000), // 3 phút
        expires: 0
    }
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    }
});

const ForgotPassword = mongoose.model('ForgotPassword', forgotPasswordSchema, "forgot-password")
module.exports = ForgotPassword