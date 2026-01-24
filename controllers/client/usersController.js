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
    const acceptFriends = myUser.acceptFriends
    const users = await User.find({
        $and: [
            { _id: { $nin: requestFriends } },
            { _id: { $ne: userId } },
            { _id: { $nin: acceptFriends } },
            // { _id: { $nin: myUser.friendList } },
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
// [GET] /users/accept
module.exports.accept = async (req, res) => {
    // Socket
    usersSocket(res)
    // End socket
    const userId = res.locals.user.id
    const myUser = await User.findOne({
        _id: userId
    })
    const acceptFriends = myUser.acceptFriends
    const users = await User.find({
        _id: { $in: acceptFriends },
        status: "active",
        deleted: false
    }).select("id avatar fullName")
    res.render("client/pages/users/accept", {
        titlePage: "Lời mời đã nhận",
        users: users
    })
}