const Chat = require('../../models/chatModel')
const User = require('../../models/userModel')
const uploadToCloudinary = require("../../helpers/uploadToCloudinary")
module.exports = (res) => {
    _io.once('connection', (socket) => {
        // Chức năng gửi yêu cầu
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


        // Chức năng huỷ gửi yêu cầu
        socket.on("CLIENT_CANCEL_FRIEND", async (userId) => {
            const myUserId = res.locals.user.id  //id của (A)

            // Xoá id của A vào acceptFriends của B
            const existAinB = await User.findOne({
                _id: userId,
                acceptFriends: myUserId
            })
            if (existAinB) {
                await User.updateOne({
                    _id: userId,
                }, {
                    $pull: { acceptFriends: myUserId }
                })
            }
            // Xoá id của B vào requestFriends của A
            const existBinA = await User.findOne({
                _id: myUserId,
                requestFriends: userId
            })
            if (existBinA) {
                await User.updateOne({
                    _id: myUserId,
                }, {
                    $pull: { requestFriends: userId }
                })
            }
        })

        // Chức năng từ chối kết bạn
        socket.on("CLIENT_REFUSE_FRIEND", async (userId) => {
            const myUserId = res.locals.user.id  //id của (B)

            // Xoá id của A vào acceptFriends của B
            const existAinB = await User.findOne({
                _id: myUserId,
                acceptFriends: userId
            })
            if (existAinB) {
                await User.updateOne({
                    _id: myUserId,
                }, {
                    $pull: { acceptFriends: userId }
                })
            }
            // Xoá id của B vào requestFriends của A
            const existBinA = await User.findOne({
                _id: userId,
                requestFriends: myUserId
            })
            if (existBinA) {
                await User.updateOne({
                    _id: userId,
                }, {
                    $pull: { requestFriends: myUserId }
                })
            }
        })

        // Chức năng chấp nhận kết bạn
        socket.on("CLIENT_ACCEPT_FRIEND", async (userId) => {
            const myUserId = res.locals.user.id  //id của (B)
            // Thêm {user_id,room_chat_id} của A vào friendList B
            // Xoá id của A vào acceptFriends của B
            const existAinB = await User.findOne({
                _id: myUserId,
                acceptFriends: userId
            })
            if (existAinB) {
                await User.updateOne({
                    _id: myUserId,
                }, {
                    $push: {
                        friendList: {
                            user_id: userId,
                            room_chat_id: ""
                        }
                    },
                    $pull: { acceptFriends: userId }
                })
            }

            // Thêm {user_id,room_chat_id} của b vào friendList A
            // Xoá id của B vào requestFriends của A
            const existBinA = await User.findOne({
                _id: userId,
                requestFriends: myUserId
            })
            if (existBinA) {
                await User.updateOne({
                    _id: userId,
                }, {
                    $push: {
                        friendList: {
                            user_id: myUserId,
                            room_chat_id: ""
                        }
                    },
                    $pull: { requestFriends: myUserId }
                })
            }
        })
    })
}