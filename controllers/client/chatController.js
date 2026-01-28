const Chat = require('../../models/chatModel')
const User = require('../../models/userModel')
const uploadToCloudinary = require("../../helpers/uploadToCloudinary")
const chatSocket = require("../../sockets/client/chat.socket")
// [GET] /chat
module.exports.index = async (req, res) => {
    const roomChatId = req.params.roomChatId
    // SocketIO

    chatSocket(req, res)
    // SocketIO
    //  Lấy data từ db
    const chats = await Chat.find({
        room_chat_id: roomChatId,
        deleted: false
    })
    for (const chat of chats) {
        const inforUser = await User.findOne({
            _id: chat.user_id
        }).select("fullName avatar")
        chat.inforUser = inforUser
    }

    res.render("client/pages/chat/index", {
        titlePage: "Chat",
        chats: chats
    })
}