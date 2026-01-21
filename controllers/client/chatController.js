const Chat = require('../../models/chatModel')
const User = require('../../models/userModel')
const uploadToCloudinary = require("../../helpers/uploadToCloudinary")
// [GET] /chat
module.exports.index = async (req, res) => {
    const userId = res.locals.user.id
    const fullName = res.locals.user.fullName
    _io.once('connection', (socket) => {
        socket.on("CLIENT_SEND_MESSAGE", async (data) => {
            const images = []
            if (data.images.length > 0)
                for (const imageBuffer of data.images) {
                    const link = await uploadToCloudinary.uploadToCloud(imageBuffer)
                    images.push(link)
                }
            const chat = new Chat({
                user_id: userId,
                content: data.content,
                images: images

            })
            await chat.save()
            // Trả về cho client
            _io.emit("SERVER_RETURN_MESSAGE", {
                fullName: fullName,
                user_id: userId,
                content: data.content,
                images: images
            })
        })

        // Typing
        socket.on("CLIENT_SEND_TYPING", async (type) => {
            socket.broadcast.emit("SERVER_RETURN_TYPING", {
                fullName: fullName,
                user_id: userId,
                type: type
            })
        })
        // End typing
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