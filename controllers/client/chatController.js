const Chat = require('../../models/chatModel')
const User = require('../../models/userModel')
const uploadToCloudinary = require("../../helpers/uploadToCloudinary")
const chatSocket = require("../../sockets/client/chat.socket")
// [GET] /chat
module.exports.index = async (req, res) => {
    // SocketIO
    chatSocket(res)
    // SocketIO
    //  Lấy data từ db
    const chats = await Chat.find({
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