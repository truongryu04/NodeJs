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
    const friendListId = myUser.friendList.map(item => item.user_id)
    const users = await User.find({
        $and: [
            { _id: { $nin: requestFriends } },
            { _id: { $ne: userId } },
            { _id: { $nin: acceptFriends } },
            { _id: { $nin: friendListId } },
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
// [GET] /users/friends
module.exports.friends = async (req, res) => {
    // Socket
    usersSocket(res)
    // End socket
    const userId = res.locals.user.id
    const myUser = await User.findOne({
        _id: userId
    })
    const friendList = myUser.friendList
    const friendListId = friendList.map(item => item.user_id)
    const users = await User.find({
        _id: { $in: friendListId },
        status: "active",
        deleted: false
    }).select("id avatar fullName statusOnline")
    for (const user of users) {
        const infoFriend = friendList.find(friend => friend.user_id == user.id)
        user.room_chat_id = infoFriend.room_chat_id
    }
    res.render("client/pages/users/friends", {
        titlePage: "Danh sách bạn bè",
        users: users
    })
}