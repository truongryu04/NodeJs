const Chat = require('../../models/chatModel')
const uploadToCloudinary = require("../../helpers/uploadToCloudinary")
module.exports = (req, res) => {
    const userId = res.locals.user.id
    const fullName = res.locals.user.fullName
    const roomChatId = req.params.roomChatId
    _io.once('connection', (socket) => {
        socket.join(roomChatId)
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
                images: images,
                room_chat_id: roomChatId,

            })
            await chat.save()
            // Trả về cho client
            _io.to(roomChatId).emit("SERVER_RETURN_MESSAGE", {
                fullName: fullName,
                user_id: userId,
                content: data.content,
                images: images
            })
        })

        // Typing
        socket.on("CLIENT_SEND_TYPING", async (type) => {
            socket.broadcast.to(roomChatId).emit("SERVER_RETURN_TYPING", {
                fullName: fullName,
                user_id: userId,
                type: type
            })
        })
        // End typing
    })
}