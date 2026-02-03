const User = require("../../models/userModel")
const RoomChat = require("../../models/roomChatModel")
// GET /rooms-chat/
module.exports.index = async (req, res) => {
    res.render("client/pages/rooms-chat/index", {
        titlePage: "Danh sách phòng",
    })
}

// GET /rooms-chat/create
module.exports.create = async (req, res) => {
    const friendList = res.locals.user.friendList
    for (const friend of friendList) {
        const infoFriend = await User.findOne({
            _id: friend.user_id,
            deleted: false
        }).select("fullName avatar")
        friend.infoFriend = infoFriend
    }
    res.render("client/pages/rooms-chat/create", {
        titlePage: "Tạo phòng chat",
        friendList: friendList
    })
}

// POST /rooms-chat/create
module.exports.createPost = async (req, res) => {
    const title = req.body.title
    const usersId = req.body.usersId
    const dataRoom = {
        title: title,
        // avatar: String,
        typeRoom: "group",
        // status: String,
        users: [],
    }
    for (const userId of usersId) {
        dataRoom.users.push({
            user_id: userId,
            role: "user"
        })
    }
    dataRoom.users.push({
        user_id: res.locals.user.id,
        role: "superAdmin"
    })
    const roomChat = new RoomChat(dataRoom)
    await roomChat.save()
    res.redirect(`/chat/${roomChat.id}`)
}