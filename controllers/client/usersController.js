const User = require("../../models/userModel")
const usersSocket = require("../../sockets/client/users.socket")
// [GET] /users/not-friend
module.exports.notFriend = async (req, res) => {
    // Socket
    usersSocket(res)
    // End socket
    const userId = res.locals.user.id
    const myUser = await User.findOne({
        _id: userId
    })
    const requestFriends = myUser.requestFriends
    const users = await User.find({
        $and: [
            { _id: { $nin: requestFriends } },
            { _id: { $ne: userId } },
            { _id: { $nin: acceptFriends } },
        ],
        status: "active",
        deleted: false
    }).select("id avatar fullName")
    res.render("client/pages/users/not-friend", {
        titlePage: "Danh sách người dùng",
        users: users
    })
}

// [GET] /users/request
module.exports.request = async (req, res) => {
    // Socket
    usersSocket(res)
    // End socket
    const userId = res.locals.user.id
    const myUser = await User.findOne({
        _id: userId
    })
    const requestFriends = myUser.requestFriends
    const users = await User.find({
        _id: { $in: requestFriends },
        status: "active",
        deleted: false
    }).select("id avatar fullName")
    res.render("client/pages/users/request", {
        titlePage: "Lời mời đã gửi",
        users: users
    })
}