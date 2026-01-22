const User = require("../../models/userModel")
const usersSocket = require("../../sockets/client/users.socket")
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