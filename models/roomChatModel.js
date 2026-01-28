const mongoose = require("mongoose")
const slug = require('mongoose-slug-updater')
mongoose.plugin(slug)

const roomChatSchema = new mongoose.Schema({
    title: String,
    avatar: String,
    typeRoom: String,
    status: String,
    users: [{
        user_id: String,
        role: String,
    }],
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

const RoomChat = mongoose.model('RoomChat', roomChatSchema, "rooms-chat")
module.exports = RoomChat