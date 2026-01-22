const mongoose = require("mongoose")
const slug = require('mongoose-slug-updater')
mongoose.plugin(slug)
const generate = require("../helpers/generate")

const UserSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    password: String,
    tokenUser: {
        type: String,
        default: generate.generateRandomString(20)
    },
    phone: String,
    avatar: String,
    requestFriends: Array,//Lời mời đã gửi
    acceptFriends: Array,//Lời mời đã nhận 
    friendList: [{
        user_id: String,
        room_chat_id: String,
    }],
    status: {
        type: String,
        default: "active"
    },
    deleted: {
        type: Boolean,
        default: false,
    },
    deletedAt: Date
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    }
});

const User = mongoose.model('User', UserSchema, "users")
module.exports = User