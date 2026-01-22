const Chat = require('../../models/chatModel')
const User = require('../../models/userModel')
const uploadToCloudinary = require("../../helpers/uploadToCloudinary")
module.exports = (res) => {
    _io.once('connection', (socket) => {
        socket.on("CLIENT_ADD_FRIEND", async (userId) => {
            const myUserId = res.locals.user.id//id của người gửi kết bạn(A)
            // Thêm id của A vào acceptFriends của B
            const existAinB = await User.findOne({
                _id: userId,
                acceptFriends: myUserId
            })
            if (!existAinB) {
                await User.updateOne({
                    _id: userId,
                }, {
                    $push: { acceptFriends: myUserId }
                })
            }
            // Thêm id của B vào requestFriends của A
            const existBinA = await User.findOne({
                _id: myUserId,
                requestFriends: userId
            })
            if (!existBinA) {
                await User.updateOne({
                    _id: myUserId,
                }, {
                    $push: { requestFriends: userId }
                })
            }
        })
    })
}