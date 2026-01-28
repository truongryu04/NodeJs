const flash = require("express-flash")
const RoomChat = require("../../models/roomChatModel")

module.exports.isAccept = async (req, res, next) => {
    const userId = res.locals.user.id
    const roomChatId = req.params.roomChatId
    const existUserInRoomChat = await RoomChat.findOne({
        _id: roomChatId,
        "users.user_id": userId,
        deleted: false
    })
    if (existUserInRoomChat) {
        next()
    }
    else {
        res.redirect("/")
    }

}