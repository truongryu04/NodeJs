const Chat = require('../../models/chatModel')
const User = require('../../models/userModel')
// [GET] /chat
module.exports.index = async (req, res) => {
    const userId = res.locals.user.id
    const fullName = res.locals.user.fullName
    _io.once('connection', (socket) => {
        socket.on("CLIENT_SEND_MESSAGE", async (content) => {
            const chat = new Chat({
                user_id: userId,
                content: content,
            })
            await chat.save()
            // Trả về cho client
            _io.emit("SERVER_RETURN_MESSAGE", {
                fullName: fullName,
                user_id: userId,
                content: content
            })
        })
    })
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